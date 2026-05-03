import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      name
      username
      imagePath
      bio
      profileColor
      isAdmin
      createdAt
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
        imagePath
      }
      totalCount
      hasNextPage
    }
  }
`;
