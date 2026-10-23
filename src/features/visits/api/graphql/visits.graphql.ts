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
        phone
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

export const GET_APPOINTMENT_VISITS = gql`
  query AppointmentVisits($orgId: String!, $limit: Int!, $search: String) {
    pending: visits(orgId: $orgId, page: 1, limit: $limit, status: PENDING, search: $search) {
      data {
        id
        referenceId
        name
        phone
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
    approved: visits(orgId: $orgId, page: 1, limit: $limit, status: APPROVED, search: $search) {
      data {
        id
        referenceId
        name
        phone
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
    rejected: visits(orgId: $orgId, page: 1, limit: $limit, status: REJECTED, search: $search) {
      data {
        id
        referenceId
        name
        phone
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

export const GET_CHECK_IN_VISITS = gql`
  query CheckInVisits($orgId: String!, $limit: Int!, $search: String) {
    signedIn: visits(orgId: $orgId, page: 1, limit: $limit, status: SIGNED_IN, search: $search) {
      data {
        id
        referenceId
        name
        phone
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
    signedOff: visits(orgId: $orgId, page: 1, limit: $limit, status: SIGNED_OFF, search: $search) {
      data {
        id
        referenceId
        name
        phone
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
      phone?: string | null;
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

export type VisitGroupQueryVariables = {
  orgId: string;
  limit: number;
  search?: string | null;
};

export type VisitGroupQueryResult = Partial<
  Record<"pending" | "approved" | "rejected" | "signedIn" | "signedOff", VisitsQueryResult["visits"]>
>;