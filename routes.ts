/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/api/uploadthing",
    "/auth/new-verification",
    "/api/webhooks/stripe"
];

/**
 * An array of routes that are use for authentication.
 * These routes will redirect logged in users to /(marketing page).
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect route after a user logs in.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/";