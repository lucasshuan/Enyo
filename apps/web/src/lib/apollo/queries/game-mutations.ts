import { gql } from "@apollo/client";

export const REQUEST_UPLOAD_URL = gql`
  mutation RequestUploadUrl($filename: String!, $contentType: String!) {
    requestUploadUrl(filename: $filename, contentType: $contentType) {
      uploadUrl
      path
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(input: $input) {
      id
      name
      slug
      status
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {
    updateGame(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const APPROVE_GAME = gql`
  mutation ApproveGame($id: ID!) {
    approveGame(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
      slug
    }
  }
`;

export const SET_GAME_STAFF = gql`
  mutation SetGameStaff($gameId: ID!, $members: [GameStaffMemberInput!]!) {
    setGameStaff(gameId: $gameId, members: $members) {
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
