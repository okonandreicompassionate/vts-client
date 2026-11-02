export interface Organization {
  orgSlug: string;
}

/** What a public visitor link may know about its organization. */
export interface PublicOrganization {
  name: string;
  /** Current slug - differs from the URL's when the link uses an old one. */
  slug: string;
}
