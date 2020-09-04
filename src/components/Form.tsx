import React, { FormEvent, useState, ChangeEvent } from "react";
import "./Form.scss";

type FormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  defaultLeagueId: string;
  defaultAuthToken: string;
  defaultStartWeek: string;
  defaultEndWeek: string;
};

export default function Form({
  onSubmit,
  defaultLeagueId,
  defaultAuthToken,
  defaultStartWeek,
  defaultEndWeek
}: FormProps) {
  const [minWeek, setMinWeek] = useState("2");
  const [maxWeek, setMaxWeek] = useState("17");
  const [startWeek, setStartWeek] = useState(defaultStartWeek);
  const [endWeek, setEndWeek] = useState(defaultEndWeek);

  function handleStartWeekChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setMinWeek(val);
    setStartWeek(val);
  }

  function handleEndWeekChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEndWeek(val);
    setMaxWeek(val);
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="access-token">Access Token</label>
        <span id="access-token-desc" className="desc">
          To get an access token, log in to Cover5, open your console, enter{" "}
          <code>
            JSON.parse(localStorage.getItem('cover5App.authorizationData')).access_token
          </code>
          , and copy the output.
        </span>
        <input
          id="access-token"
          type="text"
          aria-describedby="access-token-desc"
          defaultValue={defaultAuthToken}
          placeholder="SDWwMDQdsT3lAOYi8GxWi3rilFLBEQEDPqCCBoqgWy5QiaXo_Vi4sbzbeU-Q6Srcxnved0f-yVa0oHWpvTZcQSuzT5uju8x1Vc7KZ3D7hBU6npAoYZ8N3jja9TpClrTzbED2PzmBIOc6ekuDAWHsfyf9d27DYy3p26YCE-Xoxke0X-Gpy12CBvNJguW4lnNyKdUhP2_DDCqVoW5GCkyR2ebSod3WUucr_r2Ci4Gzm3TE3zjaqX2yIdQqsJyMiiOfpqSJVd4dMEx_ZKmnqklec0qd8W_BreeVND_cpliDDAP0Ib0I1SrhAHR-8_8nyWK52XYtpn6ht4el-6ammHTKWkdVnFkqR4Hs-kpZyz229R_NKPcj3Uc5TOIqWDGAG1zU"
        />
      </div>
      <div>
        <label htmlFor="league-id">League Id</label>
        <span id="league-id-desc" className="desc">
          After selecting your league in Cover5, enter the number after{" "}
          <code>contest</code> in the URL.
        </span>
        <input
          id="league-id"
          type="text"
          aria-describedby="league-id-desc"
          defaultValue={defaultLeagueId}
          placeholder="82871"
        />
      </div>
      <div className="ranges">
        <div>
          <label htmlFor="start-week">Start Week</label>
          <input
            id="start-week"
            type="range"
            value={startWeek}
            min={1}
            step={1}
            max={maxWeek}
            onChange={handleStartWeekChange}
          />
          <span>{startWeek}</span>
        </div>
        <div>
          <label htmlFor="end-week">End Week</label>
          <input
            id="end-week"
            type="range"
            value={endWeek}
            min={minWeek}
            step={1}
            max={17}
            onChange={handleEndWeekChange}
          />
          <span>{endWeek}</span>
        </div>
      </div>

      <button type="submit">Update</button>
    </form>
  );
}
