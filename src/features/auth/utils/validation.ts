import type { Rule } from "antd/es/form";

export const emailRules: Rule[] = [
  { required: true, message: "Please enter your email address" },
  { type: "email", message: "Please enter a valid email address" },
];

export const getPasswordRules = (options?: { minLength?: number; required?: boolean }): Rule[] => {
  const rules: Rule[] = [];
  if (options?.required !== false) {
    rules.push({ required: true, message: "Please enter a password" });
  }
  if (options?.minLength) {
    rules.push({
      min: options.minLength,
      message: `Password must be at least ${options.minLength} characters`,
    });
  }
  return rules;
};

export const getConfirmPasswordRules = (passwordFieldName: string): Rule[] => [
  { required: true, message: "Please confirm your password" },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue(passwordFieldName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  }),
];
