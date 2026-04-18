import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      name
      username
      imageUrl
      bio
      profileColor
      isAdmin
      createdAt
      players {
        id
        game {
          id
          name
          slug
          backgroundImageUrl
        }
        leagueEntries {
          id
          currentElo
          position
          league {
            id
            name
          }
        }
      }
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($pagination: PaginationInput, $query: String) {
    searchUsers(pagination: $pagination, query: $query) {
      nodes {
        id
        name
        username
        imageUrl
      }
      totalCount
      hasNextPage
    }
  }
`;
