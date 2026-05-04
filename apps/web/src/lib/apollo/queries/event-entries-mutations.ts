import { gql } from "@apollo/client";

export const ADD_EVENT_ENTRY = gql`
  mutation AddEventEntry($input: CreateEventEntryInput!) {
    addEventEntry(input: $input) {
      id
      displayName
      entryStatus
      userId
    }
  }
`;
