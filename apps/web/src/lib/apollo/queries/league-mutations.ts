import { gql } from "@apollo/client";

export const CREATE_LEAGUE = gql`
  mutation CreateLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      id
      name
      slug
    }
  }
`;

export const ADD_PLAYER_TO_LEAGUE = gql`
  mutation AddPlayerToLeague($leagueId: ID!, $playerId: ID!, $initialElo: Int) {
    addPlayerToLeague(
      leagueId: $leagueId
      playerId: $playerId
      initialElo: $initialElo
    ) {
      id
      currentElo
    }
  }
`;

export const REGISTER_SELF_TO_LEAGUE = gql`
  mutation RegisterSelfToLeague($leagueId: ID!) {
    registerSelfToLeague(leagueId: $leagueId) {
      id
    }
  }
`;

export const UPDATE_LEAGUE = gql`
  mutation UpdateLeague($id: ID!, $input: UpdateLeagueInput!) {
    updateLeague(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;
