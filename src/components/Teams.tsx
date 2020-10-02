import React, { useState, useMemo } from "react";
import "./Form.scss";
import Charty from "react-charty";
import useTeams from "../hooks/useTeams";

type TeamsProps = {
	teams: ReturnType<typeof useTeams>;
};

export default function Teams({ teams }: TeamsProps) {
	const [currentTeam, setCurrentTeam] = useState<
		ReturnType<typeof useTeams>[0]
	>();
	const rankedTeams = useMemo(() => {
		const sorted = Object.keys(teams).map((key) => teams[key]);
		sorted.sort((a, b) => b.totalPoints - a.totalPoints);
		return sorted;
	}, [teams]);

	return (
		<section className="teams">
			<div className="list">
				<h2>All Teams</h2>
				<table>
					<thead>
						<tr>
							<th>Team</th>
							<th>Average</th>
							<th>Total</th>
							<th>Best Week</th>
							<th>Worst Week</th>
						</tr>
					</thead>
					<tbody>
						{rankedTeams.map((team) => {
							return (
								<tr key={team.name}>
									<td>
										<button
											className="button"
											onClick={() => setCurrentTeam(team)}
										>
											{team.name}
										</button>
									</td>
									<td>{team.averagePoints}</td>
									<td>{team.totalPoints}</td>
									<td>
										{team.bestWeek[1]} ({team.bestWeek[0]})
									</td>
									<td>
										{team.worstWeek[1]} ({team.worstWeek[0]})
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="chart">
				<h2>Team Info</h2>
				{currentTeam && (
					<Charty
						type="line"
						title={currentTeam.name}
						data={{
							x: currentTeam.weeks.map((week) => week.week),
							y0: currentTeam.weeks.map((week) => week.points),
						}}
						colors={{
							y0: "#5FB641",
							y1: "red",
						}}
						names={{
							x: "Week",
							y0: "Points",
						}}
						startX={currentTeam.weeks[0].week}
						endX={currentTeam.weeks[currentTeam.weeks.length - 1].week}
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
