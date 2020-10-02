export type UsersRes = Array<{
	EntryId: number;
	UserId: number;
	UserName: string;
	FullName: string;
	ContestId: number;
	IsCommissioner: boolean;
	Rank: number;
	LastRank: number;
	Movement: number;
	Points: number;
	Pic: string;
	RoundEntries: UserRoundEntriesEntity[];
	LateEntryPenaltyPoints: number;
	AdjustedPoints: number;
	EntryStatus: number;
	IsActiveEntryStatus: boolean;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
}>;

type UserRoundEntriesEntity = {
	RoundId: number;
	Rank: number;
	LastRank: number;
	Movement: number;
	Points: number;
	PenaltyPoints: number;
};

export type LeagueRes = {
	ContestId: number;
	ContestStatus: number;
	Title: string;
	SubTitle: string;
	TournamentId: number;
	Tournament: string;
	TournamentTitle: string;
	ContestTournament: ContestTournament;
	OrgSport: OrgSport;
	NumRounds: number;
	NumEntries: number;
	EnrollmentStartDate: string;
	EnrollmentEndDate: string;
	StartDate: string;
	EndDate: string;
	CurrentRoundId: number;
	Rounds: RoundsEntity[];
	NoPickPenalty: number;
	NoPickPenaltyPoints: number;
	LateEntryPenalty: number;
	LateEntryPenaltyPoints: number;
	Code: string;
	IsCustomAds: boolean;
	ContestUrl: string;
	ContestPrizes: null[];
	IsHostedContest: boolean;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
};

type ContestTournament = {
	TournamentId: number;
	OrganizationId: number;
	SportId: number;
	Title: string;
	TournamentStatus: number;
	IsStatsPackAvailable: boolean;
	IsActive: boolean;
};

type OrgSport = {
	Organization: Organization;
	Sport: Sport;
	Title: string;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
};

type Organization = {
	OrganizationId: number;
	Title: string;
};

type Sport = {
	SportId: number;
	Title: string;
};

type RoundsEntity = {
	RoundId: number;
	ContestId: number;
	TournamentId: number;
	Title: string;
	StartDate: string;
	EndDate: string;
	RoundStatus: number;
	TournamentRoundId: number;
};

export type UserRes = {
	EntryId: number;
	UserId: number;
	UserName: string;
	FullName: string;
	ContestId: number;
	IsCommissioner: boolean;
	Rank: number;
	LastRank: number;
	Movement: number;
	Points: number;
	Pic: string;
	Picks: PicksEntity[];
	RoundEntries: RoundEntriesEntity[];
	LateEntryPenaltyPoints: number;
	AdjustedPoints: number;
	EntryStatus: number;
	IsActiveEntryStatus: boolean;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
};

type PicksEntity = {
	PickId: number;
	RoundId: number;
	FixtureId: number;
	LineUpId: number;
	EntryId: number;
	FixtureStatus: number;
	Points: number;
	TeamId: number;
	Team: string;
	BackgroundColor: string;
	ForegroundColor: string;
	FixtureStartDate: string;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
};

type RoundEntriesEntity = {
	RoundId: number;
	Rank: number;
	LastRank: number;
	Movement: number;
	Points: number;
	PenaltyPoints: number;
};

export type RoundRes = Array<{
	FixtureId: number;
	Title: string;
	TournamentId: number;
	StartDate: string;
	FixtureStatus: number;
	HomeTeamId: number;
	AwayTeamId: number;
	Favorite: FavoriteOrUnderdog;
	Underdog: FavoriteOrUnderdog;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
}>;

type FavoriteOrUnderdog = {
	LineupId: number;
	TeamId: number;
	Team: string;
	FixtureId: number;
	NickName: string;
	ShortName: string;
	City: string;
	ForegroundColor: string;
	BackgroundColor: string;
	HomeAwayState: number;
	Spread: number;
	Score: number;
	Points: number;
	GameOutcome: number;
	StatsIcon: string;
	GameSpreadOutcome: number;
	CreatedDate: string;
	UpdatedDate: string;
	IsActive: boolean;
};
