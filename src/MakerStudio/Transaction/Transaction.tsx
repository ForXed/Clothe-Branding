import React, { useEffect, useMemo, useState } from 'react';
import styles from './Transaction.module.css';
import { orderService } from '../../services/orderService';
import type { ApiOrder } from '../../types/order';
import type { Escrow } from '../../types/escrow';

/**
 * Escrow ledger for the signed-in maker.
 *
 * There is no /transactions endpoint: the money in v1 *is* the escrow, one per
 * order, so this screen reads the maker's orders (`GET /orders`) and each
 * order's escrow (`GET /orders/{id}/escrow`). Amounts are naira, fees are the
 * real 10% split the API computed, and every figure is a sum of those rows —
 * nothing here is mocked.
 */
const formatNaira = (amount: number): string => `₦${Math.round(amount).toLocaleString('en-NG')}`;

const ESCROW_LABEL: Record<string, string> = {
  AWAITING: 'Not funded',
  HELD: 'Held in escrow',
  RELEASED: 'Released to you',
  REFUNDED: 'Refunded to buyer',
  DISPUTED: 'Disputed',
};

interface Row {
  order: ApiOrder;
  escrow: Escrow | null;
}

const Transaction: React.FC = () => {
  /** Rows the ledger loads per view — bounded because each row costs one escrow request. */
const LEDGER_WINDOW = 12;

const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        // v1 has no batch escrow endpoint, so this is one request per row. Keep the
        // window small (and say so in the note under the table) instead of firing
        // dozens of requests on a page a maker may not even look at.
        const orders = await orderService.getOrders({ page: 0, size: LEDGER_WINDOW });
        const withEscrow = await Promise.all(
          orders.map(async (order) => {
            try {
              const escrow = await orderService.getOrderEscrow(order.id);
              return { order, escrow } as Row;
            } catch {
              return { order, escrow: null } as Row;
            }
          }),
        );
        if (!cancelled) {
          setRows(withEscrow);
          setError(null);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not load your escrow ledger.';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    const sum = (status: string) =>
      rows
        .filter((row) => row.escrow?.status === status)
        .reduce((total, row) => total + (row.escrow?.makerPayoutNgn ?? 0), 0);

    return {
      released: sum('RELEASED'),
      held: sum('HELD'),
      refunded: rows
        .filter((row) => row.escrow?.status === 'REFUNDED')
        .reduce((total, row) => total + (row.escrow?.feeAmountNgn ?? 0), 0),
    };
  }, [rows]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading your escrow ledger…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Released to you</span>
          <span className={styles.value}>{formatNaira(totals.released)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Still held in escrow</span>
          <span className={styles.value}>{formatNaira(totals.held)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Brutige fees refunded</span>
          <span className={`${styles.value} ${styles.negative}`}>{formatNaira(totals.refunded)}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h3>Escrow by order</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Paid</th>
              <th>Amount</th>
              <th>Brutige fee</th>
              <th>Your payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>No escrow yet. An order appears here once a buyer accepts a quote and pays.</td>
              </tr>
            ) : (
              rows.map(({ order, escrow }) => (
                <tr key={order.id}>
                  <td className={styles.txnId}>#{order.id.slice(0, 8)}</td>
                  <td>{escrow?.paidAt ? new Date(escrow.paidAt).toLocaleDateString('en-NG') : '—'}</td>
                  <td>{escrow ? formatNaira(escrow.amountNgn) : '—'}</td>
                  <td>{escrow ? formatNaira(escrow.feeAmountNgn) : '—'}</td>
                  <td className={styles.positive}>{escrow ? formatNaira(escrow.makerPayoutNgn) : '—'}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        escrow?.status === 'RELEASED' ? styles.completed : styles.pending
                      }`}
                    >
                      {escrow ? (ESCROW_LABEL[escrow.status] ?? escrow.status) : 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <p className={styles.note}>
          Showing {rows.length} of up to {LEDGER_WINDOW} recent orders. Each row costs one
          escrow request, because v1 has no batch escrow endpoint yet.
        </p>
      </div>
    </div>
  );
};

export default Transaction;
