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
  query GetLeagues($gameId: String!, $pagination: PaginationInput) {
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
          startDate
          endDate
          game {
            id
            name
            slug
            thumbnailImagePath
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
        isApproved
        startDate
        endDate
        registrationStartDate
        registrationEndDate
        createdAt
        updatedAt
        game {
          id
          name
          slug
          thumbnailImagePath
          status
        }
      }
    }
  }
`;
