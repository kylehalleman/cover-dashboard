import React, { useState, FormEvent, useMemo } from "react";

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

export default function App() {
  const [leagueId, setLeagueId] = useState(
    localStorage.getItem("leagueId") || ""
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || ""
  );
  const [startWeek, setStartWeek] = useState(
    parseInt(localStorage.getItem("startWeek") || "0")
  );
  const [endWeek, setEndWeek] = useState(
    parseInt(localStorage.getItem("endWeek") || "0")
  );

  const teams = useTeams(leagueId, authToken, startWeek, endWeek);
  const context = useMemo(() => ({ authToken, leagueId, startWeek, endWeek }), [
    authToken,
    endWeek,
    leagueId,
    startWeek
  ]);

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const elements = e.currentTarget.elements as FormElements;
    const authToken = elements["access-token"];
    const leagueId = elements["league-id"];
    const startWeek = elements["start-week"];
    const endWeek = elements["end-week"];

    localStorage.setItem("startWeek", startWeek.value);
    setStartWeek(parseInt(startWeek.value));

    localStorage.setItem("endWeek", endWeek.value);
    setEndWeek(parseInt(endWeek.value));

    localStorage.setItem("leagueId", leagueId.value);
    setLeagueId(leagueId.value);

    localStorage.setItem("authToken", authToken.value);
    setAuthToken(authToken.value);
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
