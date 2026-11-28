/**
 * Turns whatever a request threw into a message that is safe to show a user.
 * The API's error envelope is: { error: { code, message }, timestamp, path }.
 * Written against axios-style errors but duck-typed, so no axios import needed.
 */
type HttpishError = {
  response?: {
    status?: number;
    data?: { error?: { code?: string; message?: string } };
  };
  request?: unknown;
};

export function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null) {
    return (err as HttpishError).response?.status;
  }
  return undefined;
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (typeof err === "object" && err !== null) {
    const e = err as HttpishError;

    if (e.response) {
      // Prefer the server's own message
      const serverMessage = e.response.data?.error?.message;
      if (serverMessage) return serverMessage;

      const status = e.response.status ?? 0;
      if (status === 401)
        return "Your session has expired. Please sign in again.";
      if (status === 403) return "You don't have permission to do that.";
      if (status === 404) return "We couldn't find that order.";
      if (status === 409)
        return "That isn't allowed for the order's current status. The page has been refreshed.";
      if (status === 413) return "Those files are too large to upload.";
      if (status === 400 || status === 422)
        return "The request was invalid. Check the details and try again.";
      if (status >= 500)
        return "The server hit a problem. Please try again shortly.";
    } else if (e.request) {
      // request was sent, nothing came back
      return "Can't reach the server. Check your connection and try again.";
    }
  }

  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
