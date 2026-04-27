import { gql } from "@apollo/client";

export const CREATE_LEAGUE = gql`
  mutation CreateLeague(
    $event: CreateLeagueEventInput!
    $league: CreateLeagueConfigInput!
    $staff: [InitialStaffInput!]
    $participants: [InitialEntryInput!]
  ) {
    createLeague(
      event: $event
      league: $league
      staff: $staff
      participants: $participants
    ) {
      eventId
      classificationSystem
      config
      event {
        id
        name
        slug
        status
        visibility
        registrationsEnabled
        registrationStartDate
        registrationEndDate
        maxParticipants
        officialLinks
      }
    }
  }
`;

export const UPDATE_LEAGUE = gql`
  mutation UpdateLeague(
    $eventId: ID!
    $event: UpdateLeagueEventInput
    $league: UpdateLeagueConfigInput
  ) {
    updateLeague(eventId: $eventId, event: $event, league: $league) {
      eventId
      classificationSystem
      config
      event {
        id
        name
        slug
      }
    }
  }
`;
