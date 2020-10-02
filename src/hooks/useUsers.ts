import fetcher from "../utils/fetcher";
import { useEffect, useState, useContext } from "react";
import APIContext from "../utils/APIContext";
import { UsersRes } from "../res-types";

type UserSubset = {
	id: number;
	userName: string;
	points: number;
	rank: number;
	weeks: number[];
};

export default function useUsers() {
	const [users, setUsers] = useState<UserSubset[]>([]);
	const { authToken, leagueId } = useContext(APIContext);

	useEffect(() => {
		if (authToken && leagueId) {
			fetcher<UsersRes>(
				`https://api.cover5.com/v2/contests/${leagueId}/leaderboard_prizes`,
				authToken
			).then((json) => {
				const users = json?.map((user) => {
					return {
						id: user.UserId,
						userName: user.UserName,
						points: user.Points,
						rank: user.Rank,
						weeks: user.RoundEntries.map((round) => round.Points),
					};
				});
				if (users) {
					setUsers(users);
				}
			});
		}
	}, [authToken, leagueId]);

	return users;
}
