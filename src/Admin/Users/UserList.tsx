// src/Admin/Users/UserList.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { adminService } from "../../services/adminService";
import { getErrorMessage, getErrorStatus } from "../../utils/apiError";
import type { AdminUserSummary, UserAccountStatus, SuspendUserInput } from "../../types/admin";
import type { VerificationStatus } from "../../types/maker";
import styles from "./UserList.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS: { value: UserAccountStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Terminated" },
];

const ACCOUNT_STATUS_COLORS: Record<UserAccountStatus, string> = {
  ACTIVE: "#10b981",
  SUSPENDED: "#f59e0b",
  TERMINATED: "#ef4444",
};

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  PENDING: "#f59e0b",
  VERIFIED: "#10b981",
  REJECTED: "#ef4444",
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const shortId = (id: string) => id.slice(0, 8);

const roleLabel = (roles: string[]): string => {
  if (roles.includes("ADMIN")) return "Admin";
  if (roles.includes("MAKER")) return "Maker";
  if (roles.includes("BRAND") || roles.includes("BUYER")) return "Brand";
  return roles.join(", ") || "User";
};

/* ------------------------------------------------------------------ */
/* Suspend prompt                                                      */
/* ------------------------------------------------------------------ */

const SuspendPrompt = ({
  userName,
  onCancel,
  onConfirm,
  submitting,
}: {
  userName: string;
  onCancel: () => void;
  onConfirm: (input: SuspendUserInput) => void;
  submitting: boolean;
}) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState<"PERMANENT" | "TEMPORARY">("TEMPORARY");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reason.trim()) {
      setError("A suspension reason is required.");
      return;
    }

    if (duration === "TEMPORARY" && !expiresAt) {
      setError("An expiry date is required for temporary suspensions.");
      return;
    }

    onConfirm({
      reason: reason.trim(),
      duration,
      ...(duration === "TEMPORARY" && { expiresAt }),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.modalHeader}>
          <p>Suspend "{userName}"</p>
          <button type="button" onClick={onCancel} disabled={submitting}>
            X
          </button>
        </div>

        <div className={styles.modalField}>
          <label htmlFor="suspendReason">Reason (internal record)</label>
          <textarea
            id="suspendReason"
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            disabled={submitting}
            placeholder="e.g. Repeated delivery proof fraud across 3 orders."
          />
        </div>

        <div className={styles.modalField}>
          <label>Duration</label>
          <div className={styles.radioRow}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="duration"
                value="TEMPORARY"
                checked={duration === "TEMPORARY"}
                onChange={() => setDuration("TEMPORARY")}
                disabled={submitting}
              />
              <span>Temporary</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="duration"
                value="PERMANENT"
                checked={duration === "PERMANENT"}
                onChange={() => setDuration("PERMANENT")}
                disabled={submitting}
              />
              <span>Permanent</span>
            </label>
          </div>
        </div>

        {duration === "TEMPORARY" && (
          <div className={styles.modalField}>
            <label htmlFor="suspendExpiry">Expires on</label>
            <input
              id="suspendExpiry"
              type="date"
              value={expiresAt}
              onChange={(e) => {
                setExpiresAt(e.target.value);
                if (error) setError("");
              }}
              disabled={submitting}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        )}

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.modalConfirmBtn}
            disabled={submitting}
          >
            {submitting ? "Suspending…" : "Confirm Suspension"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* User row card                                                       */
/* ------------------------------------------------------------------ */

const UserRow = ({
  user,
  onSuspend,
  onReinstate,
  pendingId,
}: {
  user: AdminUserSummary;
  onSuspend: (user: AdminUserSummary) => void;
  onReinstate: (user: AdminUserSummary) => void;
  pendingId: string | null;
}) => {
  const isSuspended = user.accountStatus === "SUSPENDED";
  const isTerminated = user.accountStatus === "TERMINATED";
  const isMaker = user.roles.includes("MAKER");
  const isBusy = pendingId === user.id;

  return (
    <div className={`${styles.row} ${isSuspended ? styles.rowSuspended : ""} ${isTerminated ? styles.rowTerminated : ""}`}>
      <div className={styles.rowMain}>
        <div className={styles.rowIdentity}>
          <span className={styles.userName}>
            {user.firstName} {user.lastName}
          </span>
          <span className={styles.roleTag}>{roleLabel(user.roles)}</span>
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor: ACCOUNT_STATUS_COLORS[user.accountStatus],
            }}
          >
            {user.accountStatus}
          </span>
        </div>

        <p className={styles.rowMeta}>
          {user.email} • ID: {shortId(user.id)} • Joined {formatDate(user.createdAt)}
        </p>

        {isMaker && user.makerVerificationStatus && (
          <div className={styles.makerLine}>
            <span className={styles.makerLabel}>MAKER VERIFICATION</span>
            <span
              className={styles.makerBadge}
              style={{
                backgroundColor:
                  VERIFICATION_COLORS[user.makerVerificationStatus],
              }}
            >
              {user.makerVerificationStatus}
            </span>
            {user.makerId && (
              <span className={styles.makerId}>#{shortId(user.makerId)}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.rowActions}>
        {!isTerminated && !isSuspended && (
          <button
            type="button"
            className={styles.suspendBtn}
            onClick={() => onSuspend(user)}
            disabled={isBusy}
          >
            Suspend
          </button>
        )}
        {isSuspended && (
          <button
            type="button"
            className={styles.reinstateBtn}
            onClick={() => onReinstate(user)}
            disabled={isBusy}
          >
            {isBusy ? "Reinstating…" : "Reinstate"}
          </button>
        )}
        {isTerminated && (
          <span className={styles.terminatedNote}>Account closed</span>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const UserList = () => {
  // ✅ FIX 2: include "ALL" in the union type
  const [filter, setFilter] = useState<UserAccountStatus | "ALL">("ALL");

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<AdminUserSummary | null>(null);

  const requestId = useRef(0);
  const busy = useRef(false);

  // ✅ FIX 1: parameter accepts null instead of undefined
  const fetchUsers = useCallback(async (status: UserAccountStatus | null) => {
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getUsers();
      if (current !== requestId.current) return;
      const filtered = status
        ? data.filter((u) => u.accountStatus === status)
        : data;
      setUsers(filtered);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load users."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ✅ FIX 1: pass null instead of undefined
    void fetchUsers(filter === "ALL" ? null : filter);
    return () => {
      requestId.current += 1;
    };
  }, [fetchUsers, filter]);

  /* ---------------------------------------------------------------- */
  /* Suspend action                                                    */
  /* ---------------------------------------------------------------- */

  const handleSuspend = async (input: SuspendUserInput) => {
    if (!suspendingUser || busy.current) return;
    busy.current = true;
    setPendingId(suspendingUser.id);
    setError(null);

    try {
      await adminService.suspendUser(suspendingUser.id, input);
      setSuspendingUser(null);
      // ✅ FIX 1: null not undefined
      await fetchUsers(filter === "ALL" ? null : filter);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 409) {
        await fetchUsers(filter === "ALL" ? null : filter);
      }
      setError(getErrorMessage(err, "Failed to suspend user."));
      setSuspendingUser(null);
    } finally {
      busy.current = false;
      setPendingId(null);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Reinstate action                                                  */
  /* ---------------------------------------------------------------- */

  const handleReinstate = async (user: AdminUserSummary) => {
    if (busy.current) return;
    if (!window.confirm(`Reinstate "${user.firstName} ${user.lastName}"?`)) return;

    busy.current = true;
    setPendingId(user.id);
    setError(null);

    try {
      await adminService.reinstateUser(user.id);
      // ✅ FIX 1: null not undefined
      await fetchUsers(filter === "ALL" ? null : filter);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 409) {
        await fetchUsers(filter === "ALL" ? null : filter);
      }
      setError(getErrorMessage(err, "Failed to reinstate user."));
    } finally {
      busy.current = false;
      setPendingId(null);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Counts                                                            */
  /* ---------------------------------------------------------------- */

  const allCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.accountStatus] = (acc[u.accountStatus] ?? 0) + 1;
    return acc;
  }, {});

  const totalCount = users.length;

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Users</h2>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "45%" }} />
              <div className={styles.skeletonBar} style={{ width: "70%" }} />
              <div className={styles.skeletonBar} style={{ width: "30%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Error state                                                       */
  /* ---------------------------------------------------------------- */

  if (error && users.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Users</h2>
        </div>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          {/* ✅ FIX 1: null not undefined */}
          <button type="button" onClick={() => fetchUsers(filter === "ALL" ? null : filter)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Main render                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Users</h2>
        <p className={styles.subtitle}>
          Manage platform accounts. Suspend or reinstate users who violate
          Brutige policies.
        </p>
      </div>

      {error && users.length > 0 && (
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "ALL" ? totalCount : allCounts[f.value] ?? 0;
          return (
            <button
              key={f.value}
              type="button"
              className={`${styles.filterBtn} ${
                filter === f.value ? styles.filterBtnActive : ""
              }`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {count > 0 && (
                <span className={styles.filterCount}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {users.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {filter === "ALL"
              ? "No platform users yet."
              : `No ${filter.toLowerCase()} users.`}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onSuspend={(u) => setSuspendingUser(u)}
              onReinstate={handleReinstate}
              pendingId={pendingId}
            />
          ))}
        </div>
      )}

      {users.length > 0 && (
        <div className={styles.summaryBar}>
          <span>
            Showing <strong>{users.length}</strong> user
            {users.length !== 1 ? "s" : ""}
          </span>
          <span>
            Active: <strong>{allCounts.ACTIVE ?? 0}</strong> • Suspended:{" "}
            <strong>{allCounts.SUSPENDED ?? 0}</strong> • Terminated:{" "}
            <strong>{allCounts.TERMINATED ?? 0}</strong>
          </span>
        </div>
      )}

      {suspendingUser && (
        <SuspendPrompt
          userName={`${suspendingUser.firstName} ${suspendingUser.lastName}`}
          onCancel={() => setSuspendingUser(null)}
          onConfirm={handleSuspend}
          submitting={pendingId === suspendingUser.id}
        />
      )}
    </div>
  );
};

export default UserList;