// src/Admin/Users/UserList.tsx
// v1 has no user-administration endpoint: there is no GET /admin/users, no
// suspend, no reinstate, no account-status field, and the contract deliberately
// keeps user lookups out of the admin surface (PII minimisation — orders and
// makers carry display names and emails only). Rather than invent data, this
// screen says so and points at what an admin *can* do today.

import { useNavigate } from "react-router-dom";
import styles from "./UserList.module.css";

const MISSING_ENDPOINTS = [
  "GET /api/v1/admin/users — list accounts",
  "PATCH /api/v1/admin/users/{id}/suspend — suspend",
  "PATCH /api/v1/admin/users/{id}/reinstate — reinstate",
];

const available = [
  {
    label: "Maker applications",
    detail: "Approve or reject pending makers, with a note they can see.",
    to: "/admin/makers",
  },
  {
    label: "Orders",
    detail: "Every order across statuses, with the escrow on each.",
    to: "/admin/orders",
  },
  {
    label: "Disputes",
    detail: "Release the escrow to the maker, or refund the buyer.",
    to: "/admin/disputes",
  },
];

const UserList = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <p className={styles.subtitle}>
          Account administration is not part of the v1 API. Nothing on this screen
          is faked — there is nothing to load yet.
        </p>
      </div>

      <div className={styles.summaryBar}>
        <strong>What is missing</strong>
        <ul>
          {MISSING_ENDPOINTS.map((endpoint) => (
            <li key={endpoint}>
              <code>{endpoint}</code>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.summaryBar}>
        <strong>What an admin can do today</strong>
        <ul>
          {available.map((item) => (
            <li key={item.to}>
              <button
                type="button"
                className={styles.filterBtn}
                onClick={() => navigate(item.to)}
              >
                {item.label}
              </button>{" "}
              — {item.detail}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.emptyState}>
        <p>
          Why it is absent: adding a user list means exposing every account's
          email to an admin screen, so it belongs with an explicit decision (and
          an audit trail) rather than alongside the v1 order loop. Track it as a
          post-v1 ticket.
        </p>
      </div>
    </div>
  );
};

export default UserList;
