import fetcher from "../utils/fetcher";
import { useState, useEffect } from "react";
import { LeagueRes, RoundRes } from "../res-types";

type Round = {
	id: number;
	title: string;
};

type Teams = {
	[id: string]: {
		name: string;
		id: number;
		weeks: Array<{
			week: number;
			points: number;
		}>;
		totalPoints: number;
		worstWeek: [number, number];
		bestWeek: [number, number];
		averagePoints: number;
	};
};

type RoundFromServer = {
	RoundId: number;
	Title: string;
};

type TeamsObject = {
	[key: string]: ReturnType<typeof getTeamObject>;
};

function getTeamObject(
	team: {
		TeamId: number;
		NickName: string;
		Points: number;
	},
	week: number
) {
	return {
		id: team.TeamId,
		name: team.NickName,
		points: team.Points,
		week,
	};
}

function hasData<Res>(x: Res | undefined): x is Res {
	return !!x;
}

export default function useTeams(
	leagueId: string,
	authToken: string,
	startWeek: number,
	endWeek: number
) {
	const [rounds, setRounds] = useState<Round[]>([]);
	const [teams, setTeams] = useState<Teams>({});

	useEffect(() => {
		if (authToken && leagueId) {
			fetcher<LeagueRes>(
				`https://api.cover5.com/v2/contests/${leagueId}`,
				authToken
			).then((data) => {
				if (data) {
					const rounds = data.Rounds?.map((round: RoundFromServer) => ({
						title: round.Title,
						id: round.RoundId,
					}));
					if (rounds) {
						setRounds(rounds);
					}
				}
			});
		}
	}, [authToken, leagueId]);

	useEffect(() => {
		if (rounds.length) {
			const promises = rounds.map((round) => {
				return fetcher<RoundRes>(
					`https://api.cover5.com/v2/contests/${leagueId}/rounds/${round.id}/fixtures`,
					authToken
				);
			});

			Promise.all(promises).then((data) => {
				const weeksWithTeams = data.filter(hasData).reduce((acc, week, i) => {
					const weeks = week.reduce((acc, game) => {
						const team1 = getTeamObject(game.Favorite, i + 1);
						const team2 = getTeamObject(game.Underdog, i + 1);
						acc[team1.name] = team1;
						acc[team2.name] = team2;
						return acc;
					}, {} as TeamsObject);

					return acc.concat(weeks);
				}, [] as Array<TeamsObject>);

				const emptyWeeks = Array.from(Array(weeksWithTeams.length).fill(0));

				const teams = weeksWithTeams
					.reduce((acc, next, week) => {
						return acc.concat(
							Object.keys(next).map((key) => [next[key].id, next[key].name])
						);
					}, [] as [number, string][])
					.filter((val, i, src) => src.findIndex(([id]) => id === val[0]) === i)
					.reduce((acc, [id, name]) => {
						acc[name] = {
							name: name,
							id,
							weeks: Array.from(emptyWeeks),
							totalPoints: 0,
							worstWeek: [0, 0],
							bestWeek: [0, 0],
							averagePoints: 0,
						};
						return acc;
					}, {} as Teams);

				const finalTeams = Object.keys(teams).reduce((acc, key) => {
					const weeks = weeksWithTeams.map((week, i) => {
						return {
							week: i + 1,
							points: week[key] ? week[key].points : 0,
						};
					});
					const weeksInRange = weeks.slice(startWeek - 1, endWeek);

					acc[key] = {
						...teams[key],
						weeks: weeksInRange,
						totalPoints: weeksInRange.reduce(
							(acc: number, next) => acc + (next.points || 0),
							0
						),
						worstWeek: weeksInRange.reduce(
							(acc, next, i) => {
								const points = next.points || 0;
								if (points < acc[1]) {
									return [next.week, points];
								} else {
									return acc;
								}
							},
							[0, 100]
						),
						bestWeek: weeksInRange.reduce(
							(acc, next, i) => {
								const points = next.points || 0;
								if (points >= acc[1]) {
									return [next.week, points];
								} else {
									return acc;
								}
							},
							[0, 0]
						),
						averagePoints: Math.round(
							weeksInRange.reduce((acc, next) => acc + next.points, 0) /
								weeksInRange.length
						),
					};

					return acc;
				}, {} as Teams);

				setTeams(finalTeams);
			});
		}
	}, [authToken, endWeek, leagueId, rounds, startWeek]);

	return teams;
}
