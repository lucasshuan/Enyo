/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AddPlayerToGameInput = {
  gameId: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type CreateEloLeagueInput = {
  allowDraw: Scalars['Boolean']['input'];
  allowedFormats: Array<Scalars['String']['input']>;
  authorId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  gameId?: InputMaybe<Scalars['String']['input']>;
  gameName?: InputMaybe<Scalars['String']['input']>;
  inactivityDecay: Scalars['Int']['input'];
  inactivityDecayFloor: Scalars['Int']['input'];
  inactivityThresholdHours: Scalars['Int']['input'];
  initialElo: Scalars['Int']['input'];
  kFactor: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  scoreRelevance: Scalars['Float']['input'];
  slug: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateGameInput = {
  authorId: Scalars['String']['input'];
  backgroundImageUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  steamUrl?: InputMaybe<Scalars['String']['input']>;
  thumbnailImageUrl?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStandardLeagueInput = {
  allowDraw: Scalars['Boolean']['input'];
  allowedFormats: Array<Scalars['String']['input']>;
  authorId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  gameId?: InputMaybe<Scalars['String']['input']>;
  gameName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pointsPerDraw: Scalars['Int']['input'];
  pointsPerLoss: Scalars['Int']['input'];
  pointsPerWin: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EloLeague = {
  __typename?: 'EloLeague';
  allowDraw: Scalars['Boolean']['output'];
  allowedFormats: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  entries: Array<EloLeagueEntry>;
  game: Game;
  gameId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inactivityDecay: Scalars['Int']['output'];
  inactivityDecayFloor: Scalars['Int']['output'];
  inactivityThresholdHours: Scalars['Int']['output'];
  initialElo: Scalars['Int']['output'];
  isApproved: Scalars['Boolean']['output'];
  kFactor: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  scoreRelevance: Scalars['Float']['output'];
  slug: Scalars['String']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EloLeagueEntry = {
  __typename?: 'EloLeagueEntry';
  currentElo: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  league?: Maybe<EloLeague>;
  leagueId: Scalars['String']['output'];
  player?: Maybe<Player>;
  playerId: Scalars['String']['output'];
  position?: Maybe<Scalars['Int']['output']>;
};

export type EventMeta = {
  __typename?: 'EventMeta';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type Game = {
  __typename?: 'Game';
  _count?: Maybe<GameCounts>;
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['String']['output']>;
  backgroundImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eloLeagues: Array<EloLeague>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  standardLeagues: Array<StandardLeague>;
  status: Scalars['String']['output'];
  steamUrl?: Maybe<Scalars['String']['output']>;
  thumbnailImageUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type GameCounts = {
  __typename?: 'GameCounts';
  leagues: Scalars['Int']['output'];
  players: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addPlayerToEloLeague: EloLeagueEntry;
  addPlayerToGame: Player;
  addPlayerToStandardLeague: StandardLeagueEntry;
  approveGame: Game;
  completeOnboarding: User;
  createEloLeague: EloLeague;
  createGame: Game;
  createStandardLeague: StandardLeague;
  registerSelfToEloLeague: EloLeagueEntry;
  registerSelfToStandardLeague: StandardLeagueEntry;
  requestUploadUrl: UploadUrlResponse;
  updateEloLeague: EloLeague;
  updateGame: Game;
  updateProfile: User;
  updateStandardLeague: StandardLeague;
};


export type MutationAddPlayerToEloLeagueArgs = {
  initialElo?: InputMaybe<Scalars['Int']['input']>;
  leagueId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type MutationAddPlayerToGameArgs = {
  input: AddPlayerToGameInput;
};


export type MutationAddPlayerToStandardLeagueArgs = {
  leagueId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
};


export type MutationApproveGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateEloLeagueArgs = {
  input: CreateEloLeagueInput;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateStandardLeagueArgs = {
  input: CreateStandardLeagueInput;
};


export type MutationRegisterSelfToEloLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationRegisterSelfToStandardLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationRequestUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
};


export type MutationUpdateEloLeagueArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEloLeagueInput;
};


export type MutationUpdateGameArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGameInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateStandardLeagueArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStandardLeagueInput;
};

export type PaginatedEloLeagues = {
  __typename?: 'PaginatedEloLeagues';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<EloLeague>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedGames = {
  __typename?: 'PaginatedGames';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<Game>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedPlayers = {
  __typename?: 'PaginatedPlayers';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<PlayerUsername>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedStandardLeagues = {
  __typename?: 'PaginatedStandardLeagues';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<StandardLeague>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type PaginationInput = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type Player = {
  __typename?: 'Player';
  currentElo: Scalars['Int']['output'];
  eloLeagueEntries?: Maybe<Array<EloLeagueEntry>>;
  game?: Maybe<Game>;
  gameId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  standardLeagueEntries?: Maybe<Array<StandardLeagueEntry>>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  usernames: Array<PlayerUsername>;
};

export type PlayerUsername = {
  __typename?: 'PlayerUsername';
  id: Scalars['ID']['output'];
  player?: Maybe<Player>;
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  eloLeague?: Maybe<EloLeague>;
  eloLeagues: PaginatedEloLeagues;
  eventMeta?: Maybe<EventMeta>;
  game?: Maybe<Game>;
  games: PaginatedGames;
  me?: Maybe<User>;
  player?: Maybe<Player>;
  searchPlayers: PaginatedPlayers;
  searchUsers: PaginatedUsers;
  standardLeague?: Maybe<StandardLeague>;
  standardLeagues: PaginatedStandardLeagues;
  user?: Maybe<User>;
};


export type QueryEloLeagueArgs = {
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryEloLeaguesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryEventMetaArgs = {
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryGameArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGamesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPlayerArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchPlayersArgs = {
  gameId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStandardLeagueArgs = {
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryStandardLeaguesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type StandardLeague = {
  __typename?: 'StandardLeague';
  allowDraw: Scalars['Boolean']['output'];
  allowedFormats: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  entries: Array<StandardLeagueEntry>;
  game: Game;
  gameId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pointsPerDraw: Scalars['Int']['output'];
  pointsPerLoss: Scalars['Int']['output'];
  pointsPerWin: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StandardLeagueEntry = {
  __typename?: 'StandardLeagueEntry';
  draws: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  league?: Maybe<StandardLeague>;
  leagueId: Scalars['String']['output'];
  losses: Scalars['Int']['output'];
  player?: Maybe<Player>;
  playerId: Scalars['String']['output'];
  points: Scalars['Int']['output'];
  position?: Maybe<Scalars['Int']['output']>;
  wins: Scalars['Int']['output'];
};

export type UpdateEloLeagueInput = {
  allowDraw?: InputMaybe<Scalars['Boolean']['input']>;
  allowedFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  inactivityDecay?: InputMaybe<Scalars['Int']['input']>;
  inactivityDecayFloor?: InputMaybe<Scalars['Int']['input']>;
  inactivityThresholdHours?: InputMaybe<Scalars['Int']['input']>;
  initialElo?: InputMaybe<Scalars['Int']['input']>;
  kFactor?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  scoreRelevance?: InputMaybe<Scalars['Float']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGameInput = {
  backgroundImageUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  steamUrl?: InputMaybe<Scalars['String']['input']>;
  thumbnailImageUrl?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  onboardingCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  profileColor?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStandardLeagueInput = {
  allowDraw?: InputMaybe<Scalars['Boolean']['input']>;
  allowedFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pointsPerDraw?: InputMaybe<Scalars['Int']['input']>;
  pointsPerLoss?: InputMaybe<Scalars['Int']['input']>;
  pointsPerWin?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UploadUrlResponse = {
  __typename?: 'UploadUrlResponse';
  finalUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  onboardingCompleted: Scalars['Boolean']['output'];
  players: Array<Player>;
  profileColor?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type CreateEloLeagueMutationVariables = Exact<{
  input: CreateEloLeagueInput;
}>;


export type CreateEloLeagueMutation = { __typename?: 'Mutation', createEloLeague: { __typename?: 'EloLeague', id: string, name: string, slug: string } };

export type AddPlayerToEloLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
  initialElo?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddPlayerToEloLeagueMutation = { __typename?: 'Mutation', addPlayerToEloLeague: { __typename?: 'EloLeagueEntry', id: string, currentElo: number } };

export type RegisterSelfToEloLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
}>;


export type RegisterSelfToEloLeagueMutation = { __typename?: 'Mutation', registerSelfToEloLeague: { __typename?: 'EloLeagueEntry', id: string } };

export type UpdateEloLeagueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateEloLeagueInput;
}>;


export type UpdateEloLeagueMutation = { __typename?: 'Mutation', updateEloLeague: { __typename?: 'EloLeague', id: string, name: string, slug: string } };

export type GetEloLeaguesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetEloLeaguesQuery = { __typename?: 'Query', eloLeagues: { __typename?: 'PaginatedEloLeagues', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'EloLeague', id: string, name: string, slug: string, description?: string | null, type: string, isApproved: boolean, createdAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null }, entries: Array<{ __typename?: 'EloLeagueEntry', id: string, currentElo: number, position?: number | null, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, name: string, username: string, country?: string | null } | null } | null }> }> } };

export type GetEloLeagueQueryVariables = Exact<{
  gameSlug: Scalars['String']['input'];
  leagueSlug: Scalars['String']['input'];
}>;


export type GetEloLeagueQuery = { __typename?: 'Query', eloLeague?: { __typename?: 'EloLeague', id: string, name: string, slug: string, description?: string | null, type: string, initialElo: number, allowDraw: boolean, kFactor: number, scoreRelevance: number, inactivityDecay: number, inactivityThresholdHours: number, inactivityDecayFloor: number, allowedFormats: Array<string>, gameId: string, isApproved: boolean, createdAt: any, updatedAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null, status: string }, entries: Array<{ __typename?: 'EloLeagueEntry', id: string, leagueId: string, playerId: string, currentElo: number, position?: number | null, player?: { __typename?: 'Player', id: string, userId: string, user?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null, country?: string | null } | null } | null }> } | null };

export type GetEventMetaQueryVariables = Exact<{
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
}>;


export type GetEventMetaQuery = { __typename?: 'Query', eventMeta?: { __typename?: 'EventMeta', id: string, type: string } | null };

export type RequestUploadUrlMutationVariables = Exact<{
  filename: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
}>;


export type RequestUploadUrlMutation = { __typename?: 'Mutation', requestUploadUrl: { __typename?: 'UploadUrlResponse', uploadUrl: string, finalUrl: string } };

export type CreateGameMutationVariables = Exact<{
  input: CreateGameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'Game', id: string, name: string, slug: string, status: string } };

export type UpdateGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGameInput;
}>;


export type UpdateGameMutation = { __typename?: 'Mutation', updateGame: { __typename?: 'Game', id: string, name: string, slug: string } };

export type ApproveGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveGameMutation = { __typename?: 'Mutation', approveGame: { __typename?: 'Game', id: string, status: string } };

export type GetGamesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGamesQuery = { __typename?: 'Query', games: { __typename?: 'PaginatedGames', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null, backgroundImageUrl?: string | null, steamUrl?: string | null, status: string, createdAt: any, updatedAt: any, _count?: { __typename?: 'GameCounts', leagues: number, players: number } | null }> } };

export type GetGameQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetGameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null, backgroundImageUrl?: string | null, steamUrl?: string | null, websiteUrl?: string | null, status: string, authorId?: string | null, createdAt: any, updatedAt: any, author?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null } | null, eloLeagues: Array<{ __typename?: 'EloLeague', id: string, name: string, slug: string, description?: string | null, initialElo: number, isApproved: boolean, startDate?: any | null, endDate?: any | null, createdAt: any, entries: Array<{ __typename?: 'EloLeagueEntry', id: string, currentElo: number, position?: number | null, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, name: string, username: string, country?: string | null } | null } | null }> }>, standardLeagues: Array<{ __typename?: 'StandardLeague', id: string, name: string, slug: string, description?: string | null, pointsPerWin: number, pointsPerDraw: number, pointsPerLoss: number, isApproved: boolean, startDate?: any | null, endDate?: any | null, createdAt: any, entries: Array<{ __typename?: 'StandardLeagueEntry', id: string, points: number, wins: number, draws: number, losses: number, position?: number | null, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, name: string, username: string, country?: string | null } | null } | null }> }>, _count?: { __typename?: 'GameCounts', leagues: number, players: number } | null } | null };

export type GetGamesSimpleQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGamesSimpleQuery = { __typename?: 'Query', games: { __typename?: 'PaginatedGames', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null }> } };

export type CreateLeagueMutationVariables = Exact<{
  input: CreateEloLeagueInput;
}>;


export type CreateLeagueMutation = { __typename?: 'Mutation', createLeague: { __typename?: 'EloLeague', id: string, name: string, slug: string } };

export type AddPlayerToLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
  initialElo?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddPlayerToLeagueMutation = { __typename?: 'Mutation', addPlayerToLeague: { __typename?: 'EloLeagueEntry', id: string, currentElo: number } };

export type RegisterSelfToLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
}>;


export type RegisterSelfToLeagueMutation = { __typename?: 'Mutation', registerSelfToLeague: { __typename?: 'EloLeagueEntry', id: string } };

export type UpdateLeagueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateEloLeagueInput;
}>;


export type UpdateLeagueMutation = { __typename?: 'Mutation', updateLeague: { __typename?: 'EloLeague', id: string, name: string, slug: string } };

export type GetLeaguesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLeaguesQuery = { __typename?: 'Query', leagues: { __typename?: 'PaginatedEloLeagues', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'EloLeague', id: string, name: string, slug: string, description?: string | null, type: string, isApproved: boolean, createdAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null }, entries: Array<{ __typename?: 'EloLeagueEntry', id: string, currentElo: number, position?: number | null, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, name: string, username: string, country?: string | null } | null } | null }> }> } };

export type GetLeagueQueryVariables = Exact<{
  gameSlug: Scalars['String']['input'];
  leagueSlug: Scalars['String']['input'];
}>;


export type GetLeagueQuery = { __typename?: 'Query', league?: { __typename?: 'EloLeague', id: string, name: string, slug: string, description?: string | null, initialElo: number, type: string, allowDraw: boolean, kFactor: number, scoreRelevance: number, inactivityDecay: number, inactivityThresholdHours: number, inactivityDecayFloor: number, gameId: string, isApproved: boolean, allowedFormats: Array<string>, createdAt: any, updatedAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null, status: string }, entries: Array<{ __typename?: 'EloLeagueEntry', id: string, leagueId: string, playerId: string, currentElo: number, position?: number | null, player?: { __typename?: 'Player', id: string, userId: string, user?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null, country?: string | null } | null } | null }> } | null };

export type CompleteOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding: { __typename?: 'User', id: string, onboardingCompleted: boolean } };

export type AddPlayerToGameMutationVariables = Exact<{
  input: AddPlayerToGameInput;
}>;


export type AddPlayerToGameMutation = { __typename?: 'Mutation', addPlayerToGame: { __typename?: 'Player', id: string } };

export type SearchPlayersQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
}>;


export type SearchPlayersQuery = { __typename?: 'Query', searchPlayers: { __typename?: 'PaginatedPlayers', nodes: Array<{ __typename?: 'PlayerUsername', id: string, username: string, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, country?: string | null } | null } | null }> } };

export type GetPlayerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPlayerQuery = { __typename?: 'Query', player?: { __typename?: 'Player', id: string, currentElo: number, user?: { __typename?: 'User', name: string, username: string, imageUrl?: string | null, country?: string | null, createdAt: any } | null, usernames: Array<{ __typename?: 'PlayerUsername', id: string, username: string }> } | null };

export type CreateStandardLeagueMutationVariables = Exact<{
  input: CreateStandardLeagueInput;
}>;


export type CreateStandardLeagueMutation = { __typename?: 'Mutation', createStandardLeague: { __typename?: 'StandardLeague', id: string, name: string, slug: string } };

export type AddPlayerToStandardLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
}>;


export type AddPlayerToStandardLeagueMutation = { __typename?: 'Mutation', addPlayerToStandardLeague: { __typename?: 'StandardLeagueEntry', id: string, points: number } };

export type RegisterSelfToStandardLeagueMutationVariables = Exact<{
  leagueId: Scalars['ID']['input'];
}>;


export type RegisterSelfToStandardLeagueMutation = { __typename?: 'Mutation', registerSelfToStandardLeague: { __typename?: 'StandardLeagueEntry', id: string } };

export type UpdateStandardLeagueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateStandardLeagueInput;
}>;


export type UpdateStandardLeagueMutation = { __typename?: 'Mutation', updateStandardLeague: { __typename?: 'StandardLeague', id: string, name: string, slug: string } };

export type GetStandardLeaguesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetStandardLeaguesQuery = { __typename?: 'Query', standardLeagues: { __typename?: 'PaginatedStandardLeagues', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'StandardLeague', id: string, name: string, slug: string, description?: string | null, type: string, isApproved: boolean, createdAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null }, entries: Array<{ __typename?: 'StandardLeagueEntry', id: string, points: number, wins: number, draws: number, losses: number, position?: number | null, player?: { __typename?: 'Player', id: string, user?: { __typename?: 'User', id: string, name: string, username: string, country?: string | null } | null } | null }> }> } };

export type GetStandardLeagueQueryVariables = Exact<{
  gameSlug: Scalars['String']['input'];
  leagueSlug: Scalars['String']['input'];
}>;


export type GetStandardLeagueQuery = { __typename?: 'Query', standardLeague?: { __typename?: 'StandardLeague', id: string, name: string, slug: string, description?: string | null, type: string, allowDraw: boolean, pointsPerWin: number, pointsPerDraw: number, pointsPerLoss: number, allowedFormats: Array<string>, gameId: string, isApproved: boolean, createdAt: any, updatedAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null, status: string }, entries: Array<{ __typename?: 'StandardLeagueEntry', id: string, leagueId: string, playerId: string, points: number, wins: number, draws: number, losses: number, position?: number | null, player?: { __typename?: 'Player', id: string, userId: string, user?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null, country?: string | null } | null } | null }> } | null };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, username: string, name: string, imageUrl?: string | null } };

export type GetUserQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null, bio?: string | null, profileColor?: string | null, isAdmin: boolean, createdAt: any, players: Array<{ __typename?: 'Player', id: string, game?: { __typename?: 'Game', id: string, name: string, slug: string, backgroundImageUrl?: string | null } | null, eloLeagueEntries?: Array<{ __typename?: 'EloLeagueEntry', id: string, currentElo: number, position?: number | null, league?: { __typename?: 'EloLeague', id: string, name: string } | null }> | null }> } | null };

export type SearchUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'PaginatedUsers', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null }> } };


export const CreateEloLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEloLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEloLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateEloLeagueMutation, CreateEloLeagueMutationVariables>;
export const AddPlayerToEloLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPlayerToEloLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"initialElo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPlayerToEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"playerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"initialElo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"initialElo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}}]}}]}}]} as unknown as DocumentNode<AddPlayerToEloLeagueMutation, AddPlayerToEloLeagueMutationVariables>;
export const RegisterSelfToEloLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterSelfToEloLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerSelfToEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RegisterSelfToEloLeagueMutation, RegisterSelfToEloLeagueMutationVariables>;
export const UpdateEloLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEloLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEloLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateEloLeagueMutation, UpdateEloLeagueMutationVariables>;
export const GetEloLeaguesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEloLeagues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eloLeagues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetEloLeaguesQuery, GetEloLeaguesQueryVariables>;
export const GetEloLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEloLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"initialElo"}},{"kind":"Field","name":{"kind":"Name","value":"allowDraw"}},{"kind":"Field","name":{"kind":"Name","value":"kFactor"}},{"kind":"Field","name":{"kind":"Name","value":"scoreRelevance"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityDecay"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityThresholdHours"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityDecayFloor"}},{"kind":"Field","name":{"kind":"Name","value":"allowedFormats"}},{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"leagueId"}},{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEloLeagueQuery, GetEloLeagueQueryVariables>;
export const GetEventMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventMeta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetEventMetaQuery, GetEventMetaQueryVariables>;
export const RequestUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filename"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filename"}}},{"kind":"Argument","name":{"kind":"Name","value":"contentType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"finalUrl"}}]}}]}}]} as unknown as DocumentNode<RequestUploadUrlMutation, RequestUploadUrlMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const UpdateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>;
export const ApproveGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ApproveGameMutation, ApproveGameMutationVariables>;
export const GetGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"steamUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leagues"}},{"kind":"Field","name":{"kind":"Name","value":"players"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetGamesQuery, GetGamesQueryVariables>;
export const GetGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"steamUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eloLeagues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"initialElo"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"standardLeagues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerWin"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerDraw"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerLoss"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"wins"}},{"kind":"Field","name":{"kind":"Name","value":"draws"}},{"kind":"Field","name":{"kind":"Name","value":"losses"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leagues"}},{"kind":"Field","name":{"kind":"Name","value":"players"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameQuery, GetGameQueryVariables>;
export const GetGamesSimpleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGamesSimple"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetGamesSimpleQuery, GetGamesSimpleQueryVariables>;
export const CreateLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEloLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createLeague"},"name":{"kind":"Name","value":"createEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateLeagueMutation, CreateLeagueMutationVariables>;
export const AddPlayerToLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPlayerToLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"initialElo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"addPlayerToLeague"},"name":{"kind":"Name","value":"addPlayerToEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"playerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"initialElo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"initialElo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}}]}}]}}]} as unknown as DocumentNode<AddPlayerToLeagueMutation, AddPlayerToLeagueMutationVariables>;
export const RegisterSelfToLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterSelfToLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"registerSelfToLeague"},"name":{"kind":"Name","value":"registerSelfToEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RegisterSelfToLeagueMutation, RegisterSelfToLeagueMutationVariables>;
export const UpdateLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEloLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updateLeague"},"name":{"kind":"Name","value":"updateEloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateLeagueMutation, UpdateLeagueMutationVariables>;
export const GetLeaguesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeagues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"leagues"},"name":{"kind":"Name","value":"eloLeagues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetLeaguesQuery, GetLeaguesQueryVariables>;
export const GetLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"league"},"name":{"kind":"Name","value":"eloLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"initialElo"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"allowDraw"}},{"kind":"Field","name":{"kind":"Name","value":"kFactor"}},{"kind":"Field","name":{"kind":"Name","value":"scoreRelevance"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityDecay"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityThresholdHours"}},{"kind":"Field","name":{"kind":"Name","value":"inactivityDecayFloor"}},{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"allowedFormats"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"leagueId"}},{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLeagueQuery, GetLeagueQueryVariables>;
export const CompleteOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingCompleted"}}]}}]}}]} as unknown as DocumentNode<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;
export const AddPlayerToGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPlayerToGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddPlayerToGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPlayerToGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddPlayerToGameMutation, AddPlayerToGameMutationVariables>;
export const SearchPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPlayers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPlayers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchPlayersQuery, SearchPlayersQueryVariables>;
export const GetPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usernames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlayerQuery, GetPlayerQueryVariables>;
export const CreateStandardLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStandardLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStandardLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStandardLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateStandardLeagueMutation, CreateStandardLeagueMutationVariables>;
export const AddPlayerToStandardLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPlayerToStandardLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPlayerToStandardLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"playerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]}}]} as unknown as DocumentNode<AddPlayerToStandardLeagueMutation, AddPlayerToStandardLeagueMutationVariables>;
export const RegisterSelfToStandardLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterSelfToStandardLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerSelfToStandardLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RegisterSelfToStandardLeagueMutation, RegisterSelfToStandardLeagueMutationVariables>;
export const UpdateStandardLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStandardLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStandardLeagueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStandardLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateStandardLeagueMutation, UpdateStandardLeagueMutationVariables>;
export const GetStandardLeaguesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStandardLeagues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standardLeagues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"wins"}},{"kind":"Field","name":{"kind":"Name","value":"draws"}},{"kind":"Field","name":{"kind":"Name","value":"losses"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetStandardLeaguesQuery, GetStandardLeaguesQueryVariables>;
export const GetStandardLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStandardLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standardLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"allowDraw"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerWin"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerDraw"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPerLoss"}},{"kind":"Field","name":{"kind":"Name","value":"allowedFormats"}},{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"leagueId"}},{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"wins"}},{"kind":"Field","name":{"kind":"Name","value":"draws"}},{"kind":"Field","name":{"kind":"Name","value":"losses"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetStandardLeagueQuery, GetStandardLeagueQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profileColor"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eloLeagueEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentElo"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"league"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;