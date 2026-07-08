// config.js — reads from env.js (which is gitignored).
// If ENV_* variables are not defined, falls back to placeholder strings
// so the rest of the app doesn't crash during development.

const PAYSTACK_PUBLIC_KEY =
  typeof ENV_PAYSTACK_PUBLIC_KEY !== "undefined"
    ? ENV_PAYSTACK_PUBLIC_KEY
    : "pk_test_MISSING_ENV_KEY";

const CURRENCY =
  typeof ENV_CURRENCY !== "undefined" ? ENV_CURRENCY : "GHS";
