import { gql } from "@apollo/client";

export const CHECK_EVENT_SLUG = gql`
  query CheckEventSlug($gameId: String!, $slug: String!, $excludeEventId: ID) {
    checkEventSlug(
      gameId: $gameId
      slug: $slug
      excludeEventId: $excludeEventId
    )
  }
`;

export const GET_LEAGUES = gql`
  query GetLeagues($gameId: String, $pagination: PaginationInput) {
    leagues(gameId: $gameId, pagination: $pagination) {
      nodes {
        eventId
        classificationSystem
        config
        allowDraw
        allowedFormats
        event {
          id
          name
          slug
          type
          isApproved
          status
          thumbnailImagePath
          startDate
          endDate
          game {
            id
            name
            slug
            thumbnailImagePath
          }
          followCount
          entriesCount
          topEntries {
            id
            displayName
            imagePath
            stats
            user {
              imagePath
              country
            }
          }
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_LEAGUE = gql`
  query GetLeague($gameSlug: String!, $leagueSlug: String!) {
    league(gameSlug: $gameSlug, slug: $leagueSlug) {
      eventId
      classificationSystem
      config
      allowDraw
      allowedFormats
      customFieldSchema
      event {
        id
        name
        slug
        description
        about
        type
        participationMode
        isApproved
        status
        visibility
        startDate
        endDate
        registrationsEnabled
        registrationStartDate
        registrationEndDate
        maxParticipants
        requiresApproval
        waitlistEnabled
        officialLinks
        thumbnailImagePath
        createdAt
        updatedAt
        followCount
        game {
          id
          name
          slug
          thumbnailImagePath
          description
          status
        }
      }
    }
  }
`;

export const GET_EVENT_ENTRIES = gql`
  query GetEventEntries($eventId: ID!, $take: Int, $skip: Int) {
    eventEntries(
      eventId: $eventId
      pagination: { take: $take, skip: $skip }
    ) {
      nodes {
        id
        displayName
        imagePath
        entryStatus
        stats
        user {
          id
          name
          username
          imagePath
          country
        }
      }
      totalCount
      hasNextPage
    }
  }
`;
