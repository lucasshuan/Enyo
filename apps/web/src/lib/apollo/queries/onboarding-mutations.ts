import { gql } from "@apollo/client";

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding {
    completeOnboarding {
      id
      onboardingCompleted
    }
  }
`;
