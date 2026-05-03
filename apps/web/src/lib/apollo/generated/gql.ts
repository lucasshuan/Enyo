/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetEventMeta($gameSlug: String!, $slug: String!) {\n    eventMeta(gameSlug: $gameSlug, slug: $slug) {\n      id\n      type\n    }\n  }\n": typeof types.GetEventMetaDocument,
    "\n  mutation RequestUploadUrl($filename: String!, $contentType: String!) {\n    requestUploadUrl(filename: $filename, contentType: $contentType) {\n      uploadUrl\n      path\n    }\n  }\n": typeof types.RequestUploadUrlDocument,
    "\n  mutation CreateGame($input: CreateGameInput!) {\n    createGame(input: $input) {\n      id\n      name\n      slug\n      status\n    }\n  }\n": typeof types.CreateGameDocument,
    "\n  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {\n    updateGame(id: $id, input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": typeof types.UpdateGameDocument,
    "\n  mutation ApproveGame($id: ID!) {\n    approveGame(id: $id) {\n      id\n      status\n    }\n  }\n": typeof types.ApproveGameDocument,
    "\n  mutation DeleteGame($id: ID!) {\n    deleteGame(id: $id) {\n      id\n      slug\n    }\n  }\n": typeof types.DeleteGameDocument,
    "\n  query GetGames($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n        backgroundImagePath\n        status\n        _count {\n          events\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": typeof types.GetGamesDocument,
    "\n  query GetGame($slug: String!) {\n    game(slug: $slug) {\n      id\n      name\n      slug\n      description\n      thumbnailImagePath\n      backgroundImagePath\n      steamUrl\n      websiteUrl\n      status\n      authorId\n      createdAt\n      updatedAt\n      author {\n        id\n        name\n        username\n        imagePath\n      }\n      _count {\n        events\n      }\n    }\n  }\n": typeof types.GetGameDocument,
    "\n  query GetGameActions($slug: String!) {\n    game(slug: $slug) {\n      id\n      slug\n      authorId\n    }\n  }\n": typeof types.GetGameActionsDocument,
    "\n  query GetGameLayout($slug: String!) {\n    game(slug: $slug) {\n      id\n      backgroundImagePath\n    }\n  }\n": typeof types.GetGameLayoutDocument,
    "\n  query CheckGameSlug($slug: String!, $excludeId: ID) {\n    checkGameSlug(slug: $slug, excludeId: $excludeId)\n  }\n": typeof types.CheckGameSlugDocument,
    "\n  query GetGamesSimple($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": typeof types.GetGamesSimpleDocument,
    "\n  mutation CreateLeague(\n    $event: CreateLeagueEventInput!\n    $league: CreateLeagueConfigInput!\n    $staff: [InitialStaffInput!]\n    $participants: [InitialEntryInput!]\n  ) {\n    createLeague(\n      event: $event\n      league: $league\n      staff: $staff\n      participants: $participants\n    ) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n        status\n        visibility\n        registrationsEnabled\n        registrationStartDate\n        registrationEndDate\n        maxParticipants\n        requiresApproval\n        waitlistEnabled\n        officialLinks\n      }\n    }\n  }\n": typeof types.CreateLeagueDocument,
    "\n  mutation UpdateLeague(\n    $eventId: ID!\n    $event: UpdateLeagueEventInput\n    $league: UpdateLeagueConfigInput\n  ) {\n    updateLeague(eventId: $eventId, event: $event, league: $league) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n      }\n    }\n  }\n": typeof types.UpdateLeagueDocument,
    "\n  query CheckEventSlug($gameId: String!, $slug: String!, $excludeEventId: ID) {\n    checkEventSlug(gameId: $gameId, slug: $slug, excludeEventId: $excludeEventId)\n  }\n": typeof types.CheckEventSlugDocument,
    "\n  query GetLeagues($gameId: String!, $pagination: PaginationInput) {\n    leagues(gameId: $gameId, pagination: $pagination) {\n      nodes {\n        eventId\n        classificationSystem\n        config\n        allowDraw\n        allowedFormats\n        event {\n          id\n          name\n          slug\n          type\n          isApproved\n          startDate\n          endDate\n          game {\n            id\n            name\n            slug\n            thumbnailImagePath\n          }\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": typeof types.GetLeaguesDocument,
    "\n  query GetLeague($gameSlug: String!, $leagueSlug: String!) {\n    league(gameSlug: $gameSlug, slug: $leagueSlug) {\n      eventId\n      classificationSystem\n      config\n      allowDraw\n      allowedFormats\n      customFieldSchema\n      event {\n        id\n        name\n        slug\n        description\n        about\n        type\n        isApproved\n        startDate\n        endDate\n        registrationStartDate\n        registrationEndDate\n        createdAt\n        updatedAt\n        game {\n          id\n          name\n          slug\n          thumbnailImagePath\n          status\n        }\n      }\n    }\n  }\n": typeof types.GetLeagueDocument,
    "\n  mutation CompleteOnboarding {\n    completeOnboarding {\n      id\n      onboardingCompleted\n    }\n  }\n": typeof types.CompleteOnboardingDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      name\n      imagePath\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  query GetUser($username: String!) {\n    user(username: $username) {\n      id\n      name\n      username\n      imagePath\n      bio\n      profileColor\n      isAdmin\n      createdAt\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query SearchUsers($pagination: PaginationInput, $query: String) {\n    searchUsers(pagination: $pagination, query: $query) {\n      nodes {\n        id\n        name\n        username\n        imagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": typeof types.SearchUsersDocument,
};
const documents: Documents = {
    "\n  query GetEventMeta($gameSlug: String!, $slug: String!) {\n    eventMeta(gameSlug: $gameSlug, slug: $slug) {\n      id\n      type\n    }\n  }\n": types.GetEventMetaDocument,
    "\n  mutation RequestUploadUrl($filename: String!, $contentType: String!) {\n    requestUploadUrl(filename: $filename, contentType: $contentType) {\n      uploadUrl\n      path\n    }\n  }\n": types.RequestUploadUrlDocument,
    "\n  mutation CreateGame($input: CreateGameInput!) {\n    createGame(input: $input) {\n      id\n      name\n      slug\n      status\n    }\n  }\n": types.CreateGameDocument,
    "\n  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {\n    updateGame(id: $id, input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": types.UpdateGameDocument,
    "\n  mutation ApproveGame($id: ID!) {\n    approveGame(id: $id) {\n      id\n      status\n    }\n  }\n": types.ApproveGameDocument,
    "\n  mutation DeleteGame($id: ID!) {\n    deleteGame(id: $id) {\n      id\n      slug\n    }\n  }\n": types.DeleteGameDocument,
    "\n  query GetGames($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n        backgroundImagePath\n        status\n        _count {\n          events\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": types.GetGamesDocument,
    "\n  query GetGame($slug: String!) {\n    game(slug: $slug) {\n      id\n      name\n      slug\n      description\n      thumbnailImagePath\n      backgroundImagePath\n      steamUrl\n      websiteUrl\n      status\n      authorId\n      createdAt\n      updatedAt\n      author {\n        id\n        name\n        username\n        imagePath\n      }\n      _count {\n        events\n      }\n    }\n  }\n": types.GetGameDocument,
    "\n  query GetGameActions($slug: String!) {\n    game(slug: $slug) {\n      id\n      slug\n      authorId\n    }\n  }\n": types.GetGameActionsDocument,
    "\n  query GetGameLayout($slug: String!) {\n    game(slug: $slug) {\n      id\n      backgroundImagePath\n    }\n  }\n": types.GetGameLayoutDocument,
    "\n  query CheckGameSlug($slug: String!, $excludeId: ID) {\n    checkGameSlug(slug: $slug, excludeId: $excludeId)\n  }\n": types.CheckGameSlugDocument,
    "\n  query GetGamesSimple($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": types.GetGamesSimpleDocument,
    "\n  mutation CreateLeague(\n    $event: CreateLeagueEventInput!\n    $league: CreateLeagueConfigInput!\n    $staff: [InitialStaffInput!]\n    $participants: [InitialEntryInput!]\n  ) {\n    createLeague(\n      event: $event\n      league: $league\n      staff: $staff\n      participants: $participants\n    ) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n        status\n        visibility\n        registrationsEnabled\n        registrationStartDate\n        registrationEndDate\n        maxParticipants\n        requiresApproval\n        waitlistEnabled\n        officialLinks\n      }\n    }\n  }\n": types.CreateLeagueDocument,
    "\n  mutation UpdateLeague(\n    $eventId: ID!\n    $event: UpdateLeagueEventInput\n    $league: UpdateLeagueConfigInput\n  ) {\n    updateLeague(eventId: $eventId, event: $event, league: $league) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n      }\n    }\n  }\n": types.UpdateLeagueDocument,
    "\n  query CheckEventSlug($gameId: String!, $slug: String!, $excludeEventId: ID) {\n    checkEventSlug(gameId: $gameId, slug: $slug, excludeEventId: $excludeEventId)\n  }\n": types.CheckEventSlugDocument,
    "\n  query GetLeagues($gameId: String!, $pagination: PaginationInput) {\n    leagues(gameId: $gameId, pagination: $pagination) {\n      nodes {\n        eventId\n        classificationSystem\n        config\n        allowDraw\n        allowedFormats\n        event {\n          id\n          name\n          slug\n          type\n          isApproved\n          startDate\n          endDate\n          game {\n            id\n            name\n            slug\n            thumbnailImagePath\n          }\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": types.GetLeaguesDocument,
    "\n  query GetLeague($gameSlug: String!, $leagueSlug: String!) {\n    league(gameSlug: $gameSlug, slug: $leagueSlug) {\n      eventId\n      classificationSystem\n      config\n      allowDraw\n      allowedFormats\n      customFieldSchema\n      event {\n        id\n        name\n        slug\n        description\n        about\n        type\n        isApproved\n        startDate\n        endDate\n        registrationStartDate\n        registrationEndDate\n        createdAt\n        updatedAt\n        game {\n          id\n          name\n          slug\n          thumbnailImagePath\n          status\n        }\n      }\n    }\n  }\n": types.GetLeagueDocument,
    "\n  mutation CompleteOnboarding {\n    completeOnboarding {\n      id\n      onboardingCompleted\n    }\n  }\n": types.CompleteOnboardingDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      name\n      imagePath\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  query GetUser($username: String!) {\n    user(username: $username) {\n      id\n      name\n      username\n      imagePath\n      bio\n      profileColor\n      isAdmin\n      createdAt\n    }\n  }\n": types.GetUserDocument,
    "\n  query SearchUsers($pagination: PaginationInput, $query: String) {\n    searchUsers(pagination: $pagination, query: $query) {\n      nodes {\n        id\n        name\n        username\n        imagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n": types.SearchUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEventMeta($gameSlug: String!, $slug: String!) {\n    eventMeta(gameSlug: $gameSlug, slug: $slug) {\n      id\n      type\n    }\n  }\n"): (typeof documents)["\n  query GetEventMeta($gameSlug: String!, $slug: String!) {\n    eventMeta(gameSlug: $gameSlug, slug: $slug) {\n      id\n      type\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestUploadUrl($filename: String!, $contentType: String!) {\n    requestUploadUrl(filename: $filename, contentType: $contentType) {\n      uploadUrl\n      path\n    }\n  }\n"): (typeof documents)["\n  mutation RequestUploadUrl($filename: String!, $contentType: String!) {\n    requestUploadUrl(filename: $filename, contentType: $contentType) {\n      uploadUrl\n      path\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGame($input: CreateGameInput!) {\n    createGame(input: $input) {\n      id\n      name\n      slug\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreateGame($input: CreateGameInput!) {\n    createGame(input: $input) {\n      id\n      name\n      slug\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {\n    updateGame(id: $id, input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {\n    updateGame(id: $id, input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ApproveGame($id: ID!) {\n    approveGame(id: $id) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation ApproveGame($id: ID!) {\n    approveGame(id: $id) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteGame($id: ID!) {\n    deleteGame(id: $id) {\n      id\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteGame($id: ID!) {\n    deleteGame(id: $id) {\n      id\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGames($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n        backgroundImagePath\n        status\n        _count {\n          events\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"): (typeof documents)["\n  query GetGames($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n        backgroundImagePath\n        status\n        _count {\n          events\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGame($slug: String!) {\n    game(slug: $slug) {\n      id\n      name\n      slug\n      description\n      thumbnailImagePath\n      backgroundImagePath\n      steamUrl\n      websiteUrl\n      status\n      authorId\n      createdAt\n      updatedAt\n      author {\n        id\n        name\n        username\n        imagePath\n      }\n      _count {\n        events\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGame($slug: String!) {\n    game(slug: $slug) {\n      id\n      name\n      slug\n      description\n      thumbnailImagePath\n      backgroundImagePath\n      steamUrl\n      websiteUrl\n      status\n      authorId\n      createdAt\n      updatedAt\n      author {\n        id\n        name\n        username\n        imagePath\n      }\n      _count {\n        events\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGameActions($slug: String!) {\n    game(slug: $slug) {\n      id\n      slug\n      authorId\n    }\n  }\n"): (typeof documents)["\n  query GetGameActions($slug: String!) {\n    game(slug: $slug) {\n      id\n      slug\n      authorId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGameLayout($slug: String!) {\n    game(slug: $slug) {\n      id\n      backgroundImagePath\n    }\n  }\n"): (typeof documents)["\n  query GetGameLayout($slug: String!) {\n    game(slug: $slug) {\n      id\n      backgroundImagePath\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckGameSlug($slug: String!, $excludeId: ID) {\n    checkGameSlug(slug: $slug, excludeId: $excludeId)\n  }\n"): (typeof documents)["\n  query CheckGameSlug($slug: String!, $excludeId: ID) {\n    checkGameSlug(slug: $slug, excludeId: $excludeId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGamesSimple($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"): (typeof documents)["\n  query GetGamesSimple($pagination: PaginationInput, $search: String) {\n    games(pagination: $pagination, search: $search) {\n      nodes {\n        id\n        name\n        slug\n        description\n        thumbnailImagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLeague(\n    $event: CreateLeagueEventInput!\n    $league: CreateLeagueConfigInput!\n    $staff: [InitialStaffInput!]\n    $participants: [InitialEntryInput!]\n  ) {\n    createLeague(\n      event: $event\n      league: $league\n      staff: $staff\n      participants: $participants\n    ) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n        status\n        visibility\n        registrationsEnabled\n        registrationStartDate\n        registrationEndDate\n        maxParticipants\n        requiresApproval\n        waitlistEnabled\n        officialLinks\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLeague(\n    $event: CreateLeagueEventInput!\n    $league: CreateLeagueConfigInput!\n    $staff: [InitialStaffInput!]\n    $participants: [InitialEntryInput!]\n  ) {\n    createLeague(\n      event: $event\n      league: $league\n      staff: $staff\n      participants: $participants\n    ) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n        status\n        visibility\n        registrationsEnabled\n        registrationStartDate\n        registrationEndDate\n        maxParticipants\n        requiresApproval\n        waitlistEnabled\n        officialLinks\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLeague(\n    $eventId: ID!\n    $event: UpdateLeagueEventInput\n    $league: UpdateLeagueConfigInput\n  ) {\n    updateLeague(eventId: $eventId, event: $event, league: $league) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLeague(\n    $eventId: ID!\n    $event: UpdateLeagueEventInput\n    $league: UpdateLeagueConfigInput\n  ) {\n    updateLeague(eventId: $eventId, event: $event, league: $league) {\n      eventId\n      classificationSystem\n      config\n      event {\n        id\n        name\n        slug\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckEventSlug($gameId: String!, $slug: String!, $excludeEventId: ID) {\n    checkEventSlug(gameId: $gameId, slug: $slug, excludeEventId: $excludeEventId)\n  }\n"): (typeof documents)["\n  query CheckEventSlug($gameId: String!, $slug: String!, $excludeEventId: ID) {\n    checkEventSlug(gameId: $gameId, slug: $slug, excludeEventId: $excludeEventId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLeagues($gameId: String!, $pagination: PaginationInput) {\n    leagues(gameId: $gameId, pagination: $pagination) {\n      nodes {\n        eventId\n        classificationSystem\n        config\n        allowDraw\n        allowedFormats\n        event {\n          id\n          name\n          slug\n          type\n          isApproved\n          startDate\n          endDate\n          game {\n            id\n            name\n            slug\n            thumbnailImagePath\n          }\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"): (typeof documents)["\n  query GetLeagues($gameId: String!, $pagination: PaginationInput) {\n    leagues(gameId: $gameId, pagination: $pagination) {\n      nodes {\n        eventId\n        classificationSystem\n        config\n        allowDraw\n        allowedFormats\n        event {\n          id\n          name\n          slug\n          type\n          isApproved\n          startDate\n          endDate\n          game {\n            id\n            name\n            slug\n            thumbnailImagePath\n          }\n        }\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLeague($gameSlug: String!, $leagueSlug: String!) {\n    league(gameSlug: $gameSlug, slug: $leagueSlug) {\n      eventId\n      classificationSystem\n      config\n      allowDraw\n      allowedFormats\n      customFieldSchema\n      event {\n        id\n        name\n        slug\n        description\n        about\n        type\n        isApproved\n        startDate\n        endDate\n        registrationStartDate\n        registrationEndDate\n        createdAt\n        updatedAt\n        game {\n          id\n          name\n          slug\n          thumbnailImagePath\n          status\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetLeague($gameSlug: String!, $leagueSlug: String!) {\n    league(gameSlug: $gameSlug, slug: $leagueSlug) {\n      eventId\n      classificationSystem\n      config\n      allowDraw\n      allowedFormats\n      customFieldSchema\n      event {\n        id\n        name\n        slug\n        description\n        about\n        type\n        isApproved\n        startDate\n        endDate\n        registrationStartDate\n        registrationEndDate\n        createdAt\n        updatedAt\n        game {\n          id\n          name\n          slug\n          thumbnailImagePath\n          status\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteOnboarding {\n    completeOnboarding {\n      id\n      onboardingCompleted\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteOnboarding {\n    completeOnboarding {\n      id\n      onboardingCompleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      name\n      imagePath\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      name\n      imagePath\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($username: String!) {\n    user(username: $username) {\n      id\n      name\n      username\n      imagePath\n      bio\n      profileColor\n      isAdmin\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetUser($username: String!) {\n    user(username: $username) {\n      id\n      name\n      username\n      imagePath\n      bio\n      profileColor\n      isAdmin\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchUsers($pagination: PaginationInput, $query: String) {\n    searchUsers(pagination: $pagination, query: $query) {\n      nodes {\n        id\n        name\n        username\n        imagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"): (typeof documents)["\n  query SearchUsers($pagination: PaginationInput, $query: String) {\n    searchUsers(pagination: $pagination, query: $query) {\n      nodes {\n        id\n        name\n        username\n        imagePath\n      }\n      totalCount\n      hasNextPage\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;