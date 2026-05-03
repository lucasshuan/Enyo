import { gql } from "@apollo/client";

export const GET_GAMES = gql`
  query GetGames($pagination: PaginationInput, $search: String) {
    games(pagination: $pagination, search: $search) {
      nodes {
        id
        name
        slug
        description
        thumbnailImagePath
        backgroundImagePath
        status
        _count {
          events
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($slug: String!) {
    game(slug: $slug) {
      id
      name
      slug
      description
      thumbnailImagePath
      backgroundImagePath
      steamUrl
      websiteUrl
      status
      authorId
      createdAt
      updatedAt
      author {
        id
        name
        username
        imagePath
      }
      _count {
        events
      }
    }
  }
`;

export const GET_GAME_STAFF = gql`
  query GetGameStaff($gameId: ID!) {
    gameStaff(gameId: $gameId) {
      id
      userId
      capabilities
      isFullAccess
      user {
        id
        name
        username
        imagePath
      }
    }
  }
`;
export const GET_GAME_ACTIONS = gql`
  query GetGameActions($slug: String!) {
    game(slug: $slug) {
      id
      slug
      authorId
    }
  }
`;

export const GET_GAME_LAYOUT = gql`
  query GetGameLayout($slug: String!) {
    game(slug: $slug) {
      id
      backgroundImagePath
    }
  }
`;

export const CHECK_GAME_SLUG = gql`
  query CheckGameSlug($slug: String!, $excludeId: ID) {
    checkGameSlug(slug: $slug, excludeId: $excludeId)
  }
`;

export const GET_GAMES_SIMPLE = gql`
  query GetGamesSimple($pagination: PaginationInput, $search: String) {
    games(pagination: $pagination, search: $search) {
      nodes {
        id
        name
        slug
        description
        thumbnailImagePath
      }
      totalCount
      hasNextPage
    }
  }
`;
