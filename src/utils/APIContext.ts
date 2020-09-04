import { createContext } from "react";

export default createContext({
  authToken: "",
  leagueId: "",
  startWeek: 0,
  endWeek: 0
});
