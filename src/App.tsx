import React, { FormEvent, useMemo, useReducer } from "react";

import "./App.css";

import useTeams from "./hooks/useTeams";

import Form from "./components/Form";
import Teams from "./components/Teams";
import Players from "./components/Players";
import APIContext from "./utils/APIContext";

interface FormElements extends HTMLFormControlsCollection {
	"access-token": HTMLInputElement;
	"league-id": HTMLInputElement;
	"start-week": HTMLInputElement;
	"end-week": HTMLInputElement;
}

const initialState = {
	leagueId: "",
	authToken: "",
	startWeek: 0,
	endWeek: 0,
};

type State = typeof initialState;
type Action = {
	type: "update";
	payload: State;
};

function init(initialState: State) {
	return {
		leagueId: localStorage.getItem("leagueId") || "",
		authToken: localStorage.getItem("authToken") || "",
		startWeek: parseInt(localStorage.getItem("startWeek") || "0"),
		endWeek: parseInt(localStorage.getItem("endWeek") || "0"),
	};
}

function reducer(state: State, { type, payload }: Action) {
	switch (type) {
		case "update":
			const nextState = {
				...state,
				...payload,
			};
			Object.entries(nextState).forEach(([key, value]) => {
				localStorage.setItem(key, String(value));
			});
			return nextState;
		default:
			return state;
	}
}

export default function App() {
	const [{ leagueId, authToken, startWeek, endWeek }, dispatch] = useReducer(
		reducer,
		initialState,
		init
	);

	const teams = useTeams(leagueId, authToken, startWeek, endWeek);
	const context = useMemo(() => ({ authToken, leagueId, startWeek, endWeek }), [
		authToken,
		endWeek,
		leagueId,
		startWeek,
	]);

	function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const elements = e.currentTarget.elements as FormElements;

		dispatch({
			type: "update",
			payload: {
				leagueId: elements["league-id"].value,
				authToken: elements["access-token"].value,
				startWeek: parseInt(elements["start-week"].value),
				endWeek: parseInt(elements["end-week"].value),
			},
		});
	}

	return (
		<main className="container">
			<header>
				<h1>Cover5 Dashboard</h1>
			</header>
			<Form
				onSubmit={handleFormSubmit}
				defaultLeagueId={leagueId}
				defaultAuthToken={authToken}
				defaultStartWeek={String(startWeek)}
				defaultEndWeek={String(endWeek)}
			/>
			<APIContext.Provider value={context}>
				<Teams teams={teams} />
				<Players teams={teams} />
			</APIContext.Provider>
		</main>
	);
}
