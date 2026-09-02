import { gql } from "@apollo/client";

export const GET_VISITS = gql`
  query Visits(
    $orgId: String!
    $page: Int!
    $limit: Int!
    $status: VisitorStatus
    $search: String
  ) {
    visits(
      orgId: $orgId
      page: $page
      limit: $limit
      status: $status
      search: $search
    ) {
      data {
        id
        referenceId
        name
        phoneNumber
        email
        hostName
        purpose
        checkInTime
        status
        registeredAt
      }
      meta {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export type VisitsQueryVariables = {
  orgId: string;
  page: number;
  limit: number;
  status?: string | null;
  search?: string | null;
};

export type VisitsQueryResult = {
  visits: {
    data: Array<{
      id: string;
      referenceId: string;
      name: string;
      phoneNumber?: string | null;
      email?: string | null;
      hostName?: string | null;
      purpose?: string | null;
      checkInTime?: string | null;
      status: string;
      registeredAt: string;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};