import React, { useEffect, useRef, useState } from "react";

import "./App.css";

type DataRes = Array<{
	Lineups: Array<{
		Team: string;
		NickName: string;
		Points: number;
	}>;
}>;

type TeamWithPoints = {
	city: string;
	name: string;
	points: number[];
};

function getTeamData(data: DataRes) {
	const teamsWithPoints = data.reduce((acc, matchup) => {
		const [homeTeam, awayTeam] = matchup.Lineups;
		const homeTeamName = `${homeTeam.Team} ${homeTeam.NickName}`;
		const awayTeamName = `${awayTeam.Team} ${awayTeam.NickName}`;

		if (!acc[homeTeamName]) {
			acc[homeTeamName] = {
				city: homeTeam.Team,
				name: homeTeam.NickName,
				points: [homeTeam.Points],
			};
		} else {
			acc[homeTeamName].points.push(homeTeam.Points);
		}

		if (!acc[awayTeamName]) {
			acc[awayTeamName] = {
				city: awayTeam.Team,
				name: awayTeam.NickName,
				points: [awayTeam.Points],
			};
		} else {
			acc[awayTeamName].points.push(awayTeam.Points);
		}

		return acc;
	}, {} as { [teamName: string]: TeamWithPoints });

	const teamsWithDerivedData: [string, TeamData][] = Object.entries(
		teamsWithPoints
	).map(([team, { points, ...rest }]) => {
		const total = points.reduce((acc, next) => acc + next, 0);
		return [
			team,
			{
				...rest,
				best: points.reduce((max, next) => (next > max ? next : max)),
				worst: points.reduce((min, next) => (next < min ? next : min)),
				total,
				average: (total / points.length).toFixed(1),
			},
		];
	});

	teamsWithDerivedData.sort(([, a], [, b]) => b.total - a.total);

	return teamsWithDerivedData;
}

type Status = "idle" | "loading" | "success" | "error";

function useFetch(url: string, options?: RequestInit) {
	const [status, setStatus] = useState<Status>("idle");
	const [data, setData] = useState<Array<[string, TeamData]>>();

	useEffect(() => {
		setStatus("loading");
		fetch(url, options)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error("Response not OK");
				}
			})
			.then((data) => {
				setStatus("success");
				setData(getTeamData(data));
			})
			.catch((err) => {
				setStatus("error");
			});
	}, [options, url]);

	return {
		status,
		data,
	};
}

type TeamData = {
	city: string;
	name: string;
	total: number;
	average: string;
	best: number;
	worst: number;
};

function Teams() {
	// otherwise you'll just keep on fetching
	const renderDate = useRef(new Date().toISOString());
	const { data: teams = [], status } = useFetch(
		`https://api.cover5.com/v1/fixtures?pagesize=1000&endDate=${renderDate.current}&startDate=2021-09-09T06:00:00Z`
	);

	switch (status) {
		case "idle":
			return null;
		case "loading":
			return <p>Loading teams data...</p>;
		case "error":
			return <p>Error loading teams!</p>;
		case "success":
			return (
				<>
					<table>
						<caption>All Teams</caption>
						<thead>
							<tr>
								<th>Team</th>
								<th>Best</th>
								<th>Worst</th>
								<th>Average</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{teams.map(
								([key, { city, name, total, best, worst, average }]) => {
									return (
										<tr key={key}>
											<td>
												{city} <b>{name}</b>
											</td>
											<td>{best}</td>
											<td>{worst}</td>
											<td>{average}</td>
											<td>{total}</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				</>
			);
	}
}

export default function App() {
	return (
		<main className="container">
			<h1>Cover5 Dashboard</h1>
			<Teams />
		</main>
	);
}
