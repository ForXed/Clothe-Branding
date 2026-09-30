import React, { useState, useMemo } from "react";
import styles from "./Order.module.css";
import { Brief, OrderStatus, ProductionOrder } from "../../data/mockTransform";
import { useNavigate } from "react-router-dom";

// interface OrderItem {
//   name: string;
//   variant: string;
//   qty: number;
//   price: number;
// }

// interface OrderType {
//   id: string;
//   customer: string;
//   email: string;
//   total: string;
//   status: string;
//   date: string;
//   address: string;
//   tracking: string;
//   items: OrderItem[];
// }

const mockBriefs: Brief[] = [
  {
    id: "brf_001",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "450GSM Heavyweight Hoodie",
    quantity: 50,
    budgetNgn: 3500000,
    deadline: "2026-12-15",
    description:
      "Boxy fit, drop shoulder, puff print branding on the back. Need tech pack review.",
    referenceImages: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    ],
    status: "ACCEPTED",
    createdAt: "2026-08-18T10:00:00Z",
    expiresAt: "2026-08-25T10:00:00Z",
  },

  {
    id: "brf_002",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Custom Adire Shirt",
    quantity: 30,
    budgetNgn: 1200000,
    deadline: "2026-10-01",
    description:
      "Hand-dyed adire pattern, relaxed fit, mother-of-pearl buttons.",
    referenceImages: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    ],
    status: "ACCEPTED",
    createdAt: "2026-08-15T14:30:00Z",
    expiresAt: "2026-08-22T14:30:00Z",
  },

  {
    id: "brf_003",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Oversized Graphic T-Shirt",
    quantity: 100,
    budgetNgn: 1800000,
    deadline: "2026-11-20",
    description:
      "240GSM cotton oversized tee with screen-printed front and back graphics.",
    referenceImages: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    ],
    status: "ACCEPTED",
    createdAt: "2026-08-20T09:30:00Z",
    expiresAt: "2026-08-27T09:30:00Z",
  },

  {
    id: "brf_004",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Cargo Trousers",
    quantity: 40,
    budgetNgn: 1600000,
    deadline: "2026-09-30",
    description:
      "Ripstop cargo trousers with articulated knees, utility pockets and adjustable hems.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-08-21T11:00:00Z",
    expiresAt: "2026-08-28T11:00:00Z",
  },

  {
    id: "brf_005",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Technical Windbreaker",
    quantity: 25,
    budgetNgn: 2250000,
    deadline: "2026-12-05",
    description:
      "Lightweight water-resistant windbreaker with concealed hood and branded zip pulls.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-08-22T15:00:00Z",
    expiresAt: "2026-08-29T15:00:00Z",
  },

  // CANCELLED ORDER
  {
    id: "brf_006",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Embroidered Varsity Jacket",
    quantity: 20,
    budgetNgn: 1400000,
    deadline: "2026-10-30",
    description:
      "Heavy wool varsity jacket with embroidered chest logo and chenille back artwork.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-08-25T10:00:00Z",
    expiresAt: "2026-09-01T10:00:00Z",
  },

  // CANCELLED ORDER
  {
    id: "brf_007",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Linen Resort Set",
    quantity: 35,
    budgetNgn: 1750000,
    deadline: "2026-11-10",
    description:
      "Relaxed-fit linen shirt and trousers set with custom woven labels.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-08-27T12:00:00Z",
    expiresAt: "2026-09-03T12:00:00Z",
  },

  // DISPUTED ORDER
  {
    id: "brf_008",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Premium Denim Jacket",
    quantity: 30,
    budgetNgn: 2100000,
    deadline: "2026-10-20",
    description:
      "Heavyweight denim jacket with custom wash, metal buttons and embroidered branding.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-08-29T09:00:00Z",
    expiresAt: "2026-09-05T09:00:00Z",
  },

  // DISPUTED ORDER
  {
    id: "brf_009",
    clientId: "usr_123",
    clientName: "John Doe",
    garmentType: "Technical Cargo Vest",
    quantity: 25,
    budgetNgn: 1875000,
    deadline: "2026-11-05",
    description:
      "Multi-pocket technical vest with adjustable straps and waterproof fabric.",
    referenceImages: [],
    status: "ACCEPTED",
    createdAt: "2026-09-01T14:00:00Z",
    expiresAt: "2026-09-08T14:00:00Z",
  },
];

const mockOrders: ProductionOrder[] = [
  // ============================================
  // AWAITING PAYMENT
  // ============================================
  {
    id: "ord_005",
    quoteId: "quo_006",
    briefId: "brf_005",
    makerName: "Abuja Studio",
    garmentType: "Technical Windbreaker",
    quantity: 25,
    totalAmountNgn: 2100000,
    status: "AWAITING_PAYMENT",
    escrow: {
      id: "esc_005",
      orderId: "ord_005",
      status: "AWAITING",
      amountNgn: 2100000,
      platformFeeNgn: 210000,
      makerPayoutNgn: 1890000,
    },
    expectedDelivery: "2026-12-05",
    createdAt: "2026-09-01T13:00:00Z",
  },

  // ============================================
  // IN ESCROW
  // ============================================
  {
    id: "ord_001",
    quoteId: "quo_002",
    briefId: "brf_002",
    makerName: "Lagos Atelier",
    garmentType: "Custom Adire Shirt",
    quantity: 30,
    totalAmountNgn: 1100000,
    status: "IN_ESCROW",
    escrow: {
      id: "esc_001",
      orderId: "ord_001",
      status: "HELD",
      amountNgn: 1100000,
      platformFeeNgn: 110000,
      makerPayoutNgn: 990000,
      heldAt: "2026-08-19T12:00:00Z",
      autoReleaseAt: "2026-08-26T12:00:00Z",
    },
    expectedDelivery: "2026-10-01",
    createdAt: "2026-08-19T12:00:00Z",
  },

  // ============================================
  // IN PRODUCTION
  // ============================================
  {
    id: "ord_002",
    quoteId: "quo_003",
    briefId: "brf_001",
    makerName: "Aura Studio",
    garmentType: "450GSM Heavyweight Hoodie",
    quantity: 50,
    totalAmountNgn: 3200000,
    status: "IN_PRODUCTION",
    escrow: {
      id: "esc_002",
      orderId: "ord_002",
      status: "HELD",
      amountNgn: 3200000,
      platformFeeNgn: 320000,
      makerPayoutNgn: 2880000,
      heldAt: "2026-08-22T10:00:00Z",
      autoReleaseAt: "2026-08-29T10:00:00Z",
    },
    expectedDelivery: "2026-12-15",
    createdAt: "2026-08-22T10:00:00Z",
  },

  // ============================================
  // DELIVERED
  // ============================================
  {
    id: "ord_003",
    quoteId: "quo_004",
    briefId: "brf_003",
    makerName: "Aura Studio",
    garmentType: "Oversized Graphic T-Shirt",
    quantity: 100,
    totalAmountNgn: 1650000,
    status: "DELIVERED",
    escrow: {
      id: "esc_003",
      orderId: "ord_003",
      status: "HELD",
      amountNgn: 1650000,
      platformFeeNgn: 165000,
      makerPayoutNgn: 1485000,
      heldAt: "2026-08-30T09:00:00Z",
      autoReleaseAt: "2026-09-06T09:00:00Z",
    },
    expectedDelivery: "2026-09-20",
    createdAt: "2026-08-30T09:00:00Z",
  },

  // ============================================
  // COMPLETED
  // ============================================
  {
    id: "ord_004",
    quoteId: "quo_005",
    briefId: "brf_004",
    makerName: "Abuja Studio",
    garmentType: "Cargo Trousers",
    quantity: 40,
    totalAmountNgn: 1480000,
    status: "COMPLETED",
    escrow: {
      id: "esc_004",
      orderId: "ord_004",
      status: "RELEASED",
      amountNgn: 1480000,
      platformFeeNgn: 148000,
      makerPayoutNgn: 1332000,
      heldAt: "2026-08-12T10:00:00Z",
      autoReleaseAt: "2026-08-19T10:00:00Z",
      releasedAt: "2026-08-18T16:30:00Z",
    },
    expectedDelivery: "2026-09-30",
    createdAt: "2026-08-12T10:00:00Z",
  },

  // ============================================
  // CANCELLED — BEFORE PRODUCTION
  // ============================================
  {
    id: "ord_006",
    quoteId: "quo_007",
    briefId: "brf_006",
    makerName: "Aura Studio",
    garmentType: "Embroidered Varsity Jacket",
    quantity: 20,
    totalAmountNgn: 1350000,
    status: "CANCELLED",
    escrow: {
      id: "esc_006",
      orderId: "ord_006",
      status: "REFUNDED",
      amountNgn: 1350000,
      platformFeeNgn: 135000,
      makerPayoutNgn: 1215000,
      heldAt: "2026-09-02T10:00:00Z",
      refundedAt: "2026-09-03T14:00:00Z",
    },
    expectedDelivery: "2026-10-30",
    createdAt: "2026-09-02T10:00:00Z",
  },

  // ============================================
  // CANCELLED — AFTER ESCROW
  // ============================================
  {
    id: "ord_007",
    quoteId: "quo_008",
    briefId: "brf_007",
    makerName: "Lagos Atelier",
    garmentType: "Linen Resort Set",
    quantity: 35,
    totalAmountNgn: 1680000,
    status: "CANCELLED",
    escrow: {
      id: "esc_007",
      orderId: "ord_007",
      status: "REFUNDED",
      amountNgn: 1680000,
      platformFeeNgn: 168000,
      makerPayoutNgn: 1512000,
      heldAt: "2026-09-04T11:00:00Z",
      refundedAt: "2026-09-05T16:00:00Z",
    },
    expectedDelivery: "2026-11-10",
    createdAt: "2026-09-04T11:00:00Z",
  },

  // ============================================
  // DISPUTED — DELIVERY QUALITY
  // ============================================
  {
    id: "ord_008",
    quoteId: "quo_009",
    briefId: "brf_008",
    makerName: "Aura Studio",
    garmentType: "Premium Denim Jacket",
    quantity: 30,
    totalAmountNgn: 1950000,
    status: "DISPUTED",
    escrow: {
      id: "esc_008",
      orderId: "ord_008",
      status: "HELD",
      amountNgn: 1950000,
      platformFeeNgn: 195000,
      makerPayoutNgn: 1755000,
      heldAt: "2026-09-10T10:00:00Z",
      autoReleaseAt: "2026-09-17T10:00:00Z",
    },
    expectedDelivery: "2026-10-20",
    createdAt: "2026-09-10T10:00:00Z",
  },

  // ============================================
  // DISPUTED — PRODUCTION / SPECIFICATION ISSUE
  // ============================================
  {
    id: "ord_009",
    quoteId: "quo_010",
    briefId: "brf_009",
    makerName: "Abuja Studio",
    garmentType: "Technical Cargo Vest",
    quantity: 25,
    totalAmountNgn: 1800000,
    status: "DISPUTED",
    escrow: {
      id: "esc_009",
      orderId: "ord_009",
      status: "HELD",
      amountNgn: 1800000,
      platformFeeNgn: 180000,
      makerPayoutNgn: 1620000,
      heldAt: "2026-09-12T09:30:00Z",
      autoReleaseAt: "2026-09-19T09:30:00Z",
    },
    expectedDelivery: "2026-11-05",
    createdAt: "2026-09-12T09:30:00Z",
  },
];

const Order: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFullView, setShowFullView] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(
    null,
  );
  const [trackingInput, setTrackingInput] = useState<ProductionOrder | null>(
    null,
  );

  const [orders, setOrders] = useState<ProductionOrder[]>(mockOrders);
  const navigate = useNavigate();

  const statuses = [
    "AWAITING_PAYMENT",
    "IN_ESCROW",
    "IN_PRODUCTION",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "DISPUTED",
  ];

  const getOrderBrief = (briefId: string) => {
    return mockBriefs.find((brief) => brief.id === briefId);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = filter === "all" || order.status === filter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        getOrderBrief(order.briefId)?.id.toLowerCase().includes(searchLower) ||
        getOrderBrief(order.briefId)
          ?.clientName.toLowerCase()
          .includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "AWAITING_PAYMENT":
        return "#f59e0b";
      case "IN_ESCROW":
        return "#3b82f6";
      case "IN_PRODUCTION":
        return "#8b5cf6";
      case "DELIVERED":
        return "#14b8a6";
      case "COMPLETED":
        return "#10b981";
      case "CANCELLED":
        return "#6b7280";
      case "DISPUTED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleSaveTracking = () => {
    if (selectedOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, tracking: trackingInput } : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, tracking: trackingInput } : null,
      );
      alert("Tracking number saved!");
    }
  };

  const baseStatuses: OrderStatus[] = [
    "AWAITING_PAYMENT",
    "IN_ESCROW",
    "IN_PRODUCTION",
    "DELIVERED",
    "COMPLETED",
  ];

  const getVisibleStatuses = (status: OrderStatus): OrderStatus[] => {
    if (status === "CANCELLED") {
      return ["AWAITING_PAYMENT", "IN_ESCROW", "CANCELLED"];
    }

    if (status === "DISPUTED") {
      return ["IN_ESCROW", "IN_PRODUCTION", "DELIVERED", "DISPUTED"];
    }

    return baseStatuses;
  };

  const _statuses = selectedOrder && getVisibleStatuses(selectedOrder.status);
  const currentIndex =
    selectedOrder && _statuses && _statuses.indexOf(selectedOrder.status);

  const calculateProgressWidth = (status: string) => {
    const index = _statuses && _statuses.indexOf(status as OrderStatus);
    if (index == 0) return 0.5;
    if (index === -1) return 0;
    if (_statuses && index) return (index / (_statuses.length - 1)) * 100;
  };

  const handlePrint = () => window.print();
  // const totalUnits = (items: OrderItem[]) =>
  //   items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Infrastructure Ledger</h2>
          <button
            type="button"
            className={styles.printBtn}
            onClick={handlePrint}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print</span>
          </button>
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.searchBox}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search ID, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterWrapper}>
            {["all", ...statuses, "cancelled"].map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.scrollArea}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                {/* <th>ACTIONS</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.bold}>{order.id}</td>
                    <td>
                      <div className={styles.customerBox}>
                        <span className={styles.name}>
                          {getOrderBrief(order.briefId)?.clientName ||
                            "Unknown"}
                        </span>
                        <span className={styles.email}>
                          {getOrderBrief(order.briefId)?.clientId || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.itemsPreview}>
                        <span className={styles.qtyBadge}>
                          {getOrderBrief(order.briefId)?.quantity || 0}
                        </span>
                        <span className={styles.itemsText}>
                          {/* {(getOrderBrief(order.briefId)?.quantity ?? 0) > 1
                            ? `${getOrderBrief(order.briefId)?.garmentType} +${(getOrderBrief(order.briefId)?.quantity ?? 0) - 1} more`
                            : getOrderBrief(order.briefId)?.garmentType ||
                              "Unknown"} */}
                          {getOrderBrief(order.briefId)?.garmentType}
                        </span>
                      </div>
                    </td>
                    <td className={styles.bold}>
                      ${order.totalAmountNgn.toLocaleString("en-NG")}
                    </td>
                    <td>
                      <span
                        style={{
                          backgroundColor: getOrderStatusColor(order.status),
                        }}
                        className={`${styles.statusBadge}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => {
                          navigate(`/studio/orders/${order.id}`);
                          // setSelectedOrder(order);
                          // setTrackingInput(order || "");
                          // setShowFullView(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No orders found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFullView && selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowFullView(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h2>{selectedOrder.id}</h2>
                <p>Placed: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.printBtnSmall}
                  onClick={handlePrint}
                  title="Print Packing Slip"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setShowFullView(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.timelineBox}>
                <div className={styles.lineTrack}>
                  <div
                    className={styles.lineFill}
                    style={{
                      width: `${calculateProgressWidth(selectedOrder.status)}%`,
                    }}
                  />
                </div>

                <div className={styles.steps}>
                  {_statuses &&
                    currentIndex !== null &&
                    _statuses.map((status, idx) => {
                      const isActive = idx <= currentIndex;
                      const isException =
                        status === "CANCELLED" || status === "DISPUTED";

                      return (
                        <div
                          key={status}
                          className={`${styles.step}
                          ${isActive ? styles.activeStep : ""}
                          ${isException ? styles.exceptionStep : ""}
                        `}
                        >
                          <div
                            className={
                              status === "CANCELLED" || status === "DISPUTED"
                                ? styles.dot_fail
                                : styles.dot
                            }
                          />
                          <span className={styles.stepLabel}>
                            {status.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Identity Meta</label>
                  <p>
                    <strong>Name:</strong>{" "}
                    {getOrderBrief(selectedOrder.briefId)?.clientName ||
                      "Unknown"}
                  </p>
                  <p></p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {getOrderBrief(selectedOrder.briefId)?.clientId ||
                      "Unknown"}
                  </p>
                  <p>
                    <strong>Node:</strong> {selectedOrder.briefId}
                  </p>
                </div>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Loop Load</label>
                  <p>
                    {/* <strong>Units:</strong> {totalUnits(selectedOrder.quantity)}{" "} */}
                    <strong>Units:</strong> {selectedOrder.quantity} Garments
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    <span className={styles.greenText}>
                      ${selectedOrder.totalAmountNgn.toLocaleString("en-NG")}
                    </span>
                  </p>
                  {selectedOrder && (
                    <p>
                      <strong>Tracking:</strong>{" "}
                      <span className={styles.trackingText}>
                        {selectedOrder.briefId}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.itemsListSection}>
                <label className={styles.capsLabel}>Order Contents</label>
                <div className={styles.itemsList}>
                  {
                    <div className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>
                          {getOrderBrief(selectedOrder.briefId)?.garmentType}
                        </span>
                      </div>
                      <div className={styles.itemMeta}>
                        <span>x{selectedOrder.quantity}</span>
                        <span>
                          $
                          {selectedOrder.totalAmountNgn.toLocaleString("en-NG")}
                        </span>
                      </div>
                    </div>
                  }
                  {/* {getOrderBrief(selectedOrder.briefId)?.garmentType.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemVariant}>
                          {item.variant}
                        </span>
                      </div>
                      <div className={styles.itemMeta}>
                        <span>x{item.qty}</span>
                        <span>${item.price * item.qty}</span>
                      </div>
                    </div>
                  ))} */}
                </div>
              </div>
              <div className={styles.updateArea}>
                <div className={styles.updateRow}>
                  <label className={styles.capsLabel}>
                    Update Infrastructure Status
                  </label>
                  <div className={styles.statusGrid}>
                    <button
                      disabled={selectedOrder.status !== "IN_PRODUCTION"}
                      type="button"
                      className={`${styles.statusOption}`}
                      // onClick={() => handleStatusChange(selectedOrder.id, s)}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                </div>
                {/* {selectedOrder.status === "shipped" && (
                  <div className={styles.trackingRow}>
                    <label className={styles.capsLabel}>Tracking Number</label>
                    <div className={styles.trackingInputWrapper}>
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter carrier tracking ID"
                      />
                      <button
                        type="button"
                        className={styles.saveTrackBtn}
                        onClick={handleSaveTracking}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
