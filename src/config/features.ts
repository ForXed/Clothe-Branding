// src/config/features.ts
// Feature switches that mirror what the backend actually serves.
//
// Chat is deliberately OFF: the contract defines the per-order REST pair
// (GET/POST /api/v1/orders/{id}/messages) and a STOMP endpoint at /ws, but the
// backend team has not shipped either yet, so every chat screen would be an
// empty shell talking to a 404. Flip VITE_FEATURE_CHAT=true once those land —
// no other change is needed, because the screens and services are already built.

export const CHAT_ENABLED = import.meta.env.VITE_FEATURE_CHAT === "true";
