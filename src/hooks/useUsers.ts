import fetcher from "../utils/fetcher";
import { useContext } from "react";
import APIContext from "../utils/APIContext";
import { UsersRes } from "../res-types";
import { useQuery } from "react-query";

type UserSubset = {
	id: number;
	userName: string;
	points: number;
	rank: number;
	weeks: number[];
};

function getUsers(key: string, authToken: string, leagueId: string) {
	return fetcher<UsersRes>(
		`https://api.cover5.com/v2/contests/${leagueId}/leaderboard_prizes`,
		authToken
	).then((json) => {
		return json?.map((user) => {
			return {
				id: user.UserId,
				userName: user.UserName,
				points: user.Points,
				rank: user.Rank,
				weeks: user.RoundEntries.map((round) => round.Points),
			};
		});
	});
}

export default function useUsers() {
	const { authToken, leagueId } = useContext(APIContext);
	const { data: users } = useQuery(["users", authToken, leagueId], getUsers);

	return users;
}
