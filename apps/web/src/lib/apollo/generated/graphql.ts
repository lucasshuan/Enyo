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
  /** JSON custom scalar type */
  JSON: { input: any; output: any; }
};

export type AddEventStaffInput = {
  eventId: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type ClaimEntryInput = {
  entryId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventEntryInput = {
  displayName: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
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

export type CreateLeagueConfigInput = {
  allowDraw?: InputMaybe<Scalars['Boolean']['input']>;
  allowedFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  classificationSystem: Scalars['String']['input'];
  config: Scalars['JSON']['input'];
  customFieldSchema?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateLeagueEventInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  gameId?: InputMaybe<Scalars['String']['input']>;
  gameName?: InputMaybe<Scalars['String']['input']>;
  maxParticipants?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  officialLinks?: InputMaybe<Scalars['JSON']['input']>;
  participationMode?: InputMaybe<Scalars['String']['input']>;
  registrationEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  registrationStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  registrationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  requiresApproval?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
  waitlistEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateMatchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  format: Scalars['String']['input'];
  participants?: InputMaybe<Array<CreateMatchParticipantInput>>;
  phaseId?: InputMaybe<Scalars['String']['input']>;
  playedAt?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateMatchParticipantInput = {
  entryId: Scalars['String']['input'];
  outcome: Scalars['String']['input'];
  score?: InputMaybe<Scalars['Float']['input']>;
};

export type EntryClaim = {
  __typename?: 'EntryClaim';
  createdAt: Scalars['DateTime']['output'];
  entryId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  initiatedBy: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type Event = {
  __typename?: 'Event';
  about?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  game: Game;
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  league?: Maybe<League>;
  maxParticipants?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  officialLinks?: Maybe<Scalars['JSON']['output']>;
  participationMode: Scalars['String']['output'];
  registrationEndDate?: Maybe<Scalars['DateTime']['output']>;
  registrationStartDate?: Maybe<Scalars['DateTime']['output']>;
  registrationsEnabled: Scalars['Boolean']['output'];
  requiresApproval: Scalars['Boolean']['output'];
  slug: Scalars['String']['output'];
  staff?: Maybe<Array<EventStaff>>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visibility: Scalars['String']['output'];
  waitlistEnabled: Scalars['Boolean']['output'];
};

export type EventEntry = {
  __typename?: 'EventEntry';
  claims?: Maybe<Array<EntryClaim>>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  entryStatus: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<TeamMember>>;
  stats: Scalars['JSON']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type EventMeta = {
  __typename?: 'EventMeta';
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type EventStaff = {
  __typename?: 'EventStaff';
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type Game = {
  __typename?: 'Game';
  _count?: Maybe<GameCounts>;
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['String']['output']>;
  backgroundImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: Scalars['String']['output'];
  steamUrl?: Maybe<Scalars['String']['output']>;
  thumbnailImageUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type GameCounts = {
  __typename?: 'GameCounts';
  events: Scalars['Int']['output'];
};

export type InitialEntryInput = {
  displayName: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type InitialStaffInput = {
  role?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type League = {
  __typename?: 'League';
  allowDraw: Scalars['Boolean']['output'];
  allowedFormats: Array<Scalars['String']['output']>;
  classificationSystem: Scalars['String']['output'];
  config: Scalars['JSON']['output'];
  customFieldSchema?: Maybe<Scalars['JSON']['output']>;
  event?: Maybe<Event>;
  eventId: Scalars['ID']['output'];
};

export type Match = {
  __typename?: 'Match';
  attachments?: Maybe<Array<MatchAttachment>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eventId: Scalars['String']['output'];
  format: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participants?: Maybe<Array<MatchParticipant>>;
  phaseId?: Maybe<Scalars['String']['output']>;
  playedAt?: Maybe<Scalars['DateTime']['output']>;
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MatchAttachment = {
  __typename?: 'MatchAttachment';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  matchId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type MatchParticipant = {
  __typename?: 'MatchParticipant';
  attachments?: Maybe<Array<MatchAttachment>>;
  customStats?: Maybe<Scalars['JSON']['output']>;
  entryId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  matchId: Scalars['String']['output'];
  outcome: Scalars['String']['output'];
  ratingChange?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEventEntry: EventEntry;
  addEventStaff: EventStaff;
  approveGame: Game;
  claimEventEntry: EventEntry;
  completeOnboarding: User;
  createGame: Game;
  createLeague: League;
  createMatch: Match;
  deleteGame: Game;
  recordMatchOutcome: Match;
  removeEventStaff: EventStaff;
  requestUploadUrl: UploadUrlResponse;
  reviewEntryClaim: EventEntry;
  updateEventEntry: EventEntry;
  updateGame: Game;
  updateLeague: League;
  updateMatch: Match;
  updateProfile: User;
};


export type MutationAddEventEntryArgs = {
  input: CreateEventEntryInput;
};


export type MutationAddEventStaffArgs = {
  input: AddEventStaffInput;
};


export type MutationApproveGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationClaimEventEntryArgs = {
  input: ClaimEntryInput;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateLeagueArgs = {
  event: CreateLeagueEventInput;
  league: CreateLeagueConfigInput;
  participants?: InputMaybe<Array<InitialEntryInput>>;
  staff?: InputMaybe<Array<InitialStaffInput>>;
};


export type MutationCreateMatchArgs = {
  input: CreateMatchInput;
};


export type MutationDeleteGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRecordMatchOutcomeArgs = {
  input: RecordOutcomeInput;
};


export type MutationRemoveEventStaffArgs = {
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRequestUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
};


export type MutationReviewEntryClaimArgs = {
  input: ReviewClaimInput;
};


export type MutationUpdateEventEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEventEntryInput;
};


export type MutationUpdateGameArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGameInput;
};


export type MutationUpdateLeagueArgs = {
  event?: InputMaybe<UpdateLeagueEventInput>;
  eventId: Scalars['ID']['input'];
  league?: InputMaybe<UpdateLeagueConfigInput>;
};


export type MutationUpdateMatchArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMatchInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type PaginatedEventEntries = {
  __typename?: 'PaginatedEventEntries';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<EventEntry>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedGames = {
  __typename?: 'PaginatedGames';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<Game>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedLeagues = {
  __typename?: 'PaginatedLeagues';
  hasNextPage: Scalars['Boolean']['output'];
  nodes: Array<League>;
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

export type Query = {
  __typename?: 'Query';
  checkEventSlug: Scalars['Boolean']['output'];
  checkGameSlug: Scalars['Boolean']['output'];
  eventEntries: PaginatedEventEntries;
  eventEntry?: Maybe<EventEntry>;
  eventMatches: Array<Match>;
  eventMeta?: Maybe<EventMeta>;
  eventStaff: Array<EventStaff>;
  game?: Maybe<Game>;
  games: PaginatedGames;
  league?: Maybe<League>;
  leagues: PaginatedLeagues;
  match?: Maybe<Match>;
  me?: Maybe<User>;
  searchUsers: PaginatedUsers;
  user?: Maybe<User>;
};


export type QueryCheckEventSlugArgs = {
  excludeEventId?: InputMaybe<Scalars['ID']['input']>;
  gameId: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryCheckGameSlugArgs = {
  excludeId?: InputMaybe<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
};


export type QueryEventEntriesArgs = {
  eventId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryEventEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventMatchesArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventMetaArgs = {
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryEventStaffArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryGameArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGamesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLeagueArgs = {
  gameSlug: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryLeaguesArgs = {
  gameId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMatchArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type RecordOutcomeInput = {
  matchId: Scalars['ID']['input'];
  participants: Array<CreateMatchParticipantInput>;
  playedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ReviewClaimInput = {
  claimId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type TeamMember = {
  __typename?: 'TeamMember';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  entryId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type UpdateEventEntryInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateLeagueConfigInput = {
  allowDraw?: InputMaybe<Scalars['Boolean']['input']>;
  allowedFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  classificationSystem?: InputMaybe<Scalars['String']['input']>;
  config?: InputMaybe<Scalars['JSON']['input']>;
  customFieldSchema?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateLeagueEventInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxParticipants?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  officialLinks?: InputMaybe<Scalars['JSON']['input']>;
  registrationEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  registrationStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  registrationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  requiresApproval?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
  waitlistEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMatchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  participants?: InputMaybe<Array<CreateMatchParticipantInput>>;
  phaseId?: InputMaybe<Scalars['String']['input']>;
  playedAt?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  profileColor?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

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

export type DeleteGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGameMutation = { __typename?: 'Mutation', deleteGame: { __typename?: 'Game', id: string, slug: string } };

export type GetGamesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGamesQuery = { __typename?: 'Query', games: { __typename?: 'PaginatedGames', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null, backgroundImageUrl?: string | null, status: string, _count?: { __typename?: 'GameCounts', events: number } | null }> } };

export type GetGameQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetGameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null, backgroundImageUrl?: string | null, steamUrl?: string | null, websiteUrl?: string | null, status: string, authorId?: string | null, createdAt: any, updatedAt: any, author?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null } | null, _count?: { __typename?: 'GameCounts', events: number } | null } | null };

export type GetGameActionsQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetGameActionsQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, slug: string, authorId?: string | null } | null };

export type GetGameLayoutQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetGameLayoutQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, backgroundImageUrl?: string | null } | null };

export type CheckGameSlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  excludeId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CheckGameSlugQuery = { __typename?: 'Query', checkGameSlug: boolean };

export type GetGamesSimpleQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGamesSimpleQuery = { __typename?: 'Query', games: { __typename?: 'PaginatedGames', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'Game', id: string, name: string, slug: string, description?: string | null, thumbnailImageUrl?: string | null }> } };

export type CreateLeagueMutationVariables = Exact<{
  event: CreateLeagueEventInput;
  league: CreateLeagueConfigInput;
  staff?: InputMaybe<Array<InitialStaffInput> | InitialStaffInput>;
  participants?: InputMaybe<Array<InitialEntryInput> | InitialEntryInput>;
}>;


export type CreateLeagueMutation = { __typename?: 'Mutation', createLeague: { __typename?: 'League', eventId: string, classificationSystem: string, config: any, event?: { __typename?: 'Event', id: string, name: string, slug: string, status: string, visibility: string, registrationsEnabled: boolean, registrationStartDate?: any | null, registrationEndDate?: any | null, maxParticipants?: number | null, requiresApproval: boolean, waitlistEnabled: boolean, officialLinks?: any | null } | null } };

export type UpdateLeagueMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  event?: InputMaybe<UpdateLeagueEventInput>;
  league?: InputMaybe<UpdateLeagueConfigInput>;
}>;


export type UpdateLeagueMutation = { __typename?: 'Mutation', updateLeague: { __typename?: 'League', eventId: string, classificationSystem: string, config: any, event?: { __typename?: 'Event', id: string, name: string, slug: string } | null } };

export type CheckEventSlugQueryVariables = Exact<{
  gameId: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  excludeEventId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CheckEventSlugQuery = { __typename?: 'Query', checkEventSlug: boolean };

export type GetLeaguesQueryVariables = Exact<{
  gameId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLeaguesQuery = { __typename?: 'Query', leagues: { __typename?: 'PaginatedLeagues', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'League', eventId: string, classificationSystem: string, config: any, allowDraw: boolean, allowedFormats: Array<string>, event?: { __typename?: 'Event', id: string, name: string, slug: string, type: string, isApproved: boolean, startDate?: any | null, endDate?: any | null, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null } } | null }> } };

export type GetLeagueQueryVariables = Exact<{
  gameSlug: Scalars['String']['input'];
  leagueSlug: Scalars['String']['input'];
}>;


export type GetLeagueQuery = { __typename?: 'Query', league?: { __typename?: 'League', eventId: string, classificationSystem: string, config: any, allowDraw: boolean, allowedFormats: Array<string>, customFieldSchema?: any | null, event?: { __typename?: 'Event', id: string, name: string, slug: string, description?: string | null, about?: string | null, type: string, isApproved: boolean, startDate?: any | null, endDate?: any | null, registrationStartDate?: any | null, registrationEndDate?: any | null, createdAt: any, updatedAt: any, game: { __typename?: 'Game', id: string, name: string, slug: string, thumbnailImageUrl?: string | null, status: string } } | null } | null };

export type CompleteOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding: { __typename?: 'User', id: string, onboardingCompleted: boolean } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, username: string, name: string, imageUrl?: string | null } };

export type GetUserQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null, bio?: string | null, profileColor?: string | null, isAdmin: boolean, createdAt: any } | null };

export type SearchUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'PaginatedUsers', totalCount: number, hasNextPage: boolean, nodes: Array<{ __typename?: 'User', id: string, name: string, username: string, imageUrl?: string | null }> } };


export const GetEventMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventMeta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetEventMetaQuery, GetEventMetaQueryVariables>;
export const RequestUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filename"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filename"}}},{"kind":"Argument","name":{"kind":"Name","value":"contentType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"finalUrl"}}]}}]}}]} as unknown as DocumentNode<RequestUploadUrlMutation, RequestUploadUrlMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const UpdateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>;
export const ApproveGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ApproveGameMutation, ApproveGameMutationVariables>;
export const DeleteGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<DeleteGameMutation, DeleteGameMutationVariables>;
export const GetGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetGamesQuery, GetGamesQueryVariables>;
export const GetGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"steamUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameQuery, GetGameQueryVariables>;
export const GetGameActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameActions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}}]}}]}}]} as unknown as DocumentNode<GetGameActionsQuery, GetGameActionsQueryVariables>;
export const GetGameLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}}]}}]}}]} as unknown as DocumentNode<GetGameLayoutQuery, GetGameLayoutQueryVariables>;
export const CheckGameSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckGameSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkGameSlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeId"}}}]}]}}]} as unknown as DocumentNode<CheckGameSlugQuery, CheckGameSlugQueryVariables>;
export const GetGamesSimpleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGamesSimple"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetGamesSimpleQuery, GetGamesSimpleQueryVariables>;
export const CreateLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeagueEventInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"league"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeagueConfigInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"staff"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitialStaffInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participants"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitialEntryInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"league"},"value":{"kind":"Variable","name":{"kind":"Name","value":"league"}}},{"kind":"Argument","name":{"kind":"Name","value":"staff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"staff"}}},{"kind":"Argument","name":{"kind":"Name","value":"participants"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participants"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"classificationSystem"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"registrationsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"registrationStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"registrationEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"requiresApproval"}},{"kind":"Field","name":{"kind":"Name","value":"waitlistEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"officialLinks"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLeagueMutation, CreateLeagueMutationVariables>;
export const UpdateLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLeagueEventInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"league"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLeagueConfigInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLeague"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}},{"kind":"Argument","name":{"kind":"Name","value":"league"},"value":{"kind":"Variable","name":{"kind":"Name","value":"league"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"classificationSystem"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLeagueMutation, UpdateLeagueMutationVariables>;
export const CheckEventSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckEventSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeEventId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkEventSlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeEventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeEventId"}}}]}]}}]} as unknown as DocumentNode<CheckEventSlugQuery, CheckEventSlugQueryVariables>;
export const GetLeaguesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeagues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leagues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"classificationSystem"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"allowDraw"}},{"kind":"Field","name":{"kind":"Name","value":"allowedFormats"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetLeaguesQuery, GetLeaguesQueryVariables>;
export const GetLeagueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeague"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"league"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"classificationSystem"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"allowDraw"}},{"kind":"Field","name":{"kind":"Name","value":"allowedFormats"}},{"kind":"Field","name":{"kind":"Name","value":"customFieldSchema"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"registrationStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"registrationEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLeagueQuery, GetLeagueQueryVariables>;
export const CompleteOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingCompleted"}}]}}]}}]} as unknown as DocumentNode<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profileColor"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;