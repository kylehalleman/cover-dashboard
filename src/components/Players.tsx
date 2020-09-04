import React, { useState, useMemo, useContext } from "react";
import "./Form.scss";
import Charty from "react-charty";
import useUsers from "../hooks/useUsers";
import fetcher from "../utils/fetcher";
import useTeams from "../hooks/useTeams";
import APIContext from "../utils/APIContext";
import { UserRes } from "../res-types";

type UserSubset = {
  id: number;
  userName: string;
  points: number;
  rank: number;
  // weeks: number[]
};

type Rounds = {
  [key: string]: Array<{ teamName: string; teamId: number; points: number }>;
};

type UserInfo = {
  teams: {
    [key: string]: number;
  };
  picks: Rounds;
  rounds: Array<{
    roundId: number;
    rank: number;
    points: number;
  }>;
};

type RoundEntries = Array<{
  RoundId: number;
  Rank: number;
  Points: number;
}>;

type UserResponse = {
  Picks: Picks;
  RoundEntries: RoundEntries;
};

type Picks = Array<{
  Team: string;
  TeamId: number;
  RoundId: number;
  Points: number;
}>;

type Series = number[];

type PlayersProps = {
  teams: ReturnType<typeof useTeams>;
};

const EMPTY_USER = {} as UserSubset;
const EMPTY_INFO = {} as UserInfo;

const cumulativeSum = (sum: number) => (value: number) => (sum += value);

const COLORS = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600"
];

export default function Players({ teams }: PlayersProps) {
  const [currentUser, setCurrentUser] = useState<UserSubset>(EMPTY_USER);
  const users = useUsers();
  const [userInfo, setUserInfo] = useState<UserInfo>(EMPTY_INFO);
  const [series, setSeries] = useState<Series>([]);
  const { authToken, leagueId, startWeek, endWeek } = useContext(APIContext);

  function getUserInfo(id: UserSubset["id"]) {
    setCurrentUser(users.find(user => user.id === id) || EMPTY_USER);
    if (leagueId && authToken) {
      fetcher<UserRes>(
        `https://api.cover5.com/v2/contests/${leagueId}/entries/${id}/withPicks`,
        authToken
      ).then(json => {
        if (json) {
          const info = {
            teams: json?.Picks?.reduce((acc, next) => {
              const [name = ""] =
                Object.entries(teams).find(
                  ([, values]) => values.id === next.TeamId
                ) || [];

              const team = acc[name];

              if (acc.hasOwnProperty(name)) {
                acc[name] = team + 1;
              } else {
                acc[name] = 1;
              }
              return acc;
            }, {} as { [key: string]: number }),
            picks: json?.Picks?.map(pick => ({
              teamName: pick.Team,
              teamId: pick.TeamId,
              roundId: pick.RoundId,
              points: pick.Points
            })).reduce((acc, next) => {
              const { roundId, ...rest } = next;
              const id = String(roundId);
              if (acc[id]) {
                acc[id] = acc[id].concat(rest);
              } else {
                acc[id] = ([] as Rounds[0]).concat(rest);
              }
              return acc;
            }, {} as Rounds),
            rounds: json?.RoundEntries?.map(entry => ({
              roundId: entry.RoundId,
              rank: entry.Rank,
              points: entry.Points
            }))
          };

          if (info) {
            setUserInfo(info);
          }

          if (info.rounds) {
            setSeries(info.rounds.map(round => round.points));
          }
        }
      });
    }
  }

  const usersFavoriteTeams = useMemo(() => {
    if (userInfo.teams) {
      const sorted = Object.entries(userInfo.teams);
      sorted.sort((a, b) => b[1] - a[1]);
      return sorted;
    } else {
      return [];
    }
  }, [userInfo]);

  return (
    <section className="users">
      <div className="list">
        <h2 id="users-table-caption">All Users</h2>
        <table aria-labelledby="users-table-caption">
          <thead>
            <tr>
              <th>User</th>
              <th>Rank</th>
              <th>Points</th>
              {/* {users?.[0]?.weeks.map((week, i) => (
                <th>Week {i + 1}</th>
              ))} */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              return (
                <tr key={user.id}>
                  <td>
                    {user.userName}{" "}
                    <button onClick={() => getUserInfo(user.id)}>
                      Get Info
                    </button>
                  </td>
                  <td>{i + 1}</td>
                  <td>{user.points}</td>
                  {/* {user.weeks.map(week => (
                    <td>{week}</td>
                  ))} */}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <ol className="users__list">
          {users.map(user => {
            return (
              <li key={user.id}>
                {user.userName} :: {user.points}
                <button onClick={() => getUserInfo(user.id)}>Get Info</button>
              </li>
            );
          })}
        </ol> */}
      </div>
      <div className="chart">
        {/* <h2>User Info {currentUser.userName}</h2>
        <h3>Favorite Teams</h3>
        <ol>
          {usersFavoriteTeams.map(([name, picks]) => (
            <li key={name}>
              {name} {picks}
            </li>
          ))}
        </ol> */}
        <h3>Stuff</h3>
        {!!users.length && (
          <Charty
            type="line"
            title={"Users"}
            data={{
              x: users?.[0]?.weeks.map((week, i) => i + 1),
              ...users?.reduce((acc, next, i) => {
                acc[`y${i}`] = next.weeks.map(cumulativeSum(0));
                return acc;
              }, {} as { [key: string]: number[] })
            }}
            colors={{
              x: "red",
              ...users?.reduce((acc, next, i) => {
                acc[`y${i}`] = COLORS[i % COLORS.length];
                return acc;
              }, {} as { [key: string]: string })
            }}
            names={{
              ...users?.reduce((acc, next, i) => {
                acc[`y${i}`] = next.userName;
                return acc;
              }, {} as { [key: string]: string })
            }}
            startX={1}
            endX={series.length}
            xAxisStep={1}
            showPreview={false}
            showRangeText={true}
            showLegendTitle={true}
          />
        )}
      </div>
    </section>
  );
}
