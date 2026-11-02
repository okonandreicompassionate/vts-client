import type { HostItem } from "../types/api-types";

const normalizeHostName = (host: HostItem): string => {
  if (typeof host.fullName === "string" && host.fullName.trim()) {
    return host.fullName.trim();
  }

  if (typeof host.name === "string" && host.name.trim()) {
    return host.name.trim();
  }

  const firstName = typeof host.firstName === "string" ? host.firstName.trim() : "";
  const lastName = typeof host.lastName === "string" ? host.lastName.trim() : "";

  return `${firstName} ${lastName}`.trim();
};

/** Normalizes a host list response into unique, named hosts for the host picker. */
export const toHostOptions = (
  response: HostItem[] | { items?: HostItem[]; users?: HostItem[] },
) => {
  const hosts = Array.isArray(response) ? response : (response.items ?? response.users ?? []);

  return hosts
    .map((host) => {
      const fullName = normalizeHostName(host);
      return fullName ? { ...host, fullName } : null;
    })
    .filter((host): host is HostItem & { fullName: string } => Boolean(host))
    .filter(
      (host, index, array) => array.findIndex((item) => item.fullName === host.fullName) === index,
    );
};
