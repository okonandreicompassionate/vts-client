export interface Organization {
  orgSlug: string;
  requireVisitorEmailVerification: boolean;
}

/** What a public visitor link may know about its organization. */
export interface PublicOrganization {
  requireVisitorEmailVerification: boolean;
  name: string;
  /** Current slug - differs from the URL's when the link uses an old one. */
  slug: string;
}
