import type { Rule } from "antd/es/form";

/** The server stores first and last names separately and requires both. */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);

  return { firstName, lastName: rest.join(" ") };
}

/** Form rule for a "Full Name" field that must contain a first and last name. */
export const fullNameRules: Rule[] = [
  { required: true, whitespace: true, message: "Please enter your full name" },
  {
    validator: (_rule, value?: string) =>
      !value?.trim() || splitFullName(value).lastName
        ? Promise.resolve()
        : Promise.reject(new Error("Please enter your first and last name")),
  },
];
