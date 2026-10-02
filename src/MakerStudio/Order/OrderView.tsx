import { useParams } from "react-router-dom";
import styles from "./OrderView.module.css";
import { EscrowStatus, OrderStatus } from "../../types/order";
import { useEffect, useRef, useState } from "react";
import { ProductionOrder } from "../../data/mockTransform";

const dummOrder: ProductionOrder = {
  id: "ord_005",
  quoteId: "quo_006",
  briefId: "brf_005",
  makerName: "Abuja Studio",
  garmentType: "Technical Windbreaker",
  quantity: 25,
  totalAmountNgn: 2100000,
  status: "IN_ESCROW",
  escrow: {
    id: "esc_005",
    orderId: "ord_005",
    status: "HELD",
    amountNgn: 2100000,
    platformFeeNgn: 210000,
    makerPayoutNgn: 1890000,
  },
  expectedDelivery: "2026-12-05",
  createdAt: "2026-09-01T13:00:00Z",
};

const MAX_FILES = 6;
const MAX_SIZE_MB = 5;

const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

/* ------------------------------------------------------------------ */
/* Delivery proof modal                                                */
/* ------------------------------------------------------------------ */

type PreviewImage = { id: string; file: File; preview: string };

const DeliveryProofModal = ({
  orderId,
  onClose,
  onSuccess,
}: {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [tracking, setTracking] = useState("");
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // latest images in a ref so object URLs are freed on unmount
  const imagesRef = useRef<PreviewImage[]>(images);
  imagesRef.current = images;
  useEffect(() => {
    return () =>
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // allows re-picking the same file later
    let message = "";

    const current = imagesRef.current;
    const accepted: PreviewImage[] = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        message = `"${file.name}" is not an image.`;
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        message = `"${file.name}" is larger than ${MAX_SIZE_MB}MB.`;
        continue;
      }
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      const duplicate =
        current.some((i) => i.id === id) || accepted.some((i) => i.id === id);
      if (duplicate) continue;

      if (current.length + accepted.length >= MAX_FILES) {
        message = `You can upload a maximum of ${MAX_FILES} images.`;
        break;
      }
      accepted.push({ id, file, preview: URL.createObjectURL(file) });
    }

    setError(message);
    if (accepted.length) setImages([...current, ...accepted]);
  };

  const removeImage = (id: string) => {
    const target = images.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tracking.trim()) return setError("Tracking number is required.");
    if (images.length === 0) return setError("Add at least one image.");

    const formData = new FormData();
    formData.append("tracking", tracking.trim());
    images.forEach((img) => formData.append("images", img.file));

    try {
      setSubmitting(true);
      // Don't set Content-Type manually; the browser adds the multipart boundary
      const res = await fetch(`/api/orders/${orderId}/delivery-proof`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed. Please try again.");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <section className={styles.header}>
          <p>Upload Delivery Proof</p>
          <button type="button" onClick={onClose}>
            X
          </button>
        </section>

        <div>
          <label htmlFor="tracking">Waybill / Tracking Number</label>
          <input
            id="tracking"
            name="tracking"
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="imageProof">
            Attach Image Proof ({images.length}/{MAX_FILES})
          </label>
          <label htmlFor="imageProof" className={styles.dropzone}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-image-plus preview-icon"
            >
              <path d="M16 5h6" />
              <path d="M19 2v6" />
              <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              <circle cx="9" cy="9" r="2" />
            </svg>
          </label>
          <input
            id="imageProof"
            name="imageProof"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFiles}
          />
        </div>

        {images.length > 0 && (
          <ul className={styles.previewGrid}>
            {images.map((img) => (
              <li key={img.id}>
                <img src={img.preview} alt={img.file.name} />
                <button
                  type="button"
                  aria-label={`Remove ${img.file.name}`}
                  onClick={() => removeImage(img.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <section className={styles.actions}>
          <button type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload Proof"}
          </button>
        </section>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Order view                                                          */
/* ------------------------------------------------------------------ */

const OrderView = () => {
  const param = useParams();
  const orderID = param.orderId; // use this to fetch the real order
  void orderID;

  const [selected, setSelected] = useState<"specs" | "finance">("specs");
  const [selectedOrder, setSelectedOrder] =
    useState<ProductionOrder>(dummOrder);
  const [modalOpen, setModalOpen] = useState(false);

  const statuses = [
    "AWAITING_PAYMENT",
    "IN_ESCROW",
    "IN_PRODUCTION",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "DISPUTED",
  ];

  const setStatus = (status: OrderStatus) =>
    setSelectedOrder((prev) => ({ ...prev, status }));

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

  const getEscrowStatusColor = (status: EscrowStatus): string => {
    switch (status) {
      case "AWAITING":
        return "#6b7280";
      case "HELD":
        return "#3b82f6";
      case "RELEASED":
        return "#10b981";
      case "REFUNDED":
        return "#f97316";
      case "DISPUTED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusActions = () => {
    if (selectedOrder.status == "AWAITING_PAYMENT")
      return (
        <button
          style={{ background: "var(--brut-danger)" }}
          onClick={() => setStatus("CANCELLED")}
        >
          Cancel Order
        </button>
      );

    if (selectedOrder.status == "IN_ESCROW")
      return (
        <>
          <button
            style={{ background: "var(--brut-bg)" }}
            onClick={() => setStatus("IN_PRODUCTION")}
          >
            Start Production
          </button>
          <button
            style={{ background: "var(--brut-danger)" }}
            onClick={() => setStatus("DISPUTED")}
          >
            Raise Dispute
          </button>
        </>
      );

    if (selectedOrder.status == "IN_PRODUCTION")
      return (
        <button
          style={{ background: "var(--brut-bg)" }}
          onClick={() => setModalOpen(true)}
        >
          Mark as Delivered
        </button>
      );

    return null;
  };

  const getStatusActionText = () => {
    switch (selectedOrder.status) {
      case "AWAITING_PAYMENT":
        return `Quote accepted. Buyer must pay ${formatCurrency(selectedOrder.totalAmountNgn)} into Brutige Escrow to lock specs.`;
      case "IN_ESCROW":
        return "Funds locked in Escrow. Mark production as started.";
      case "IN_PRODUCTION":
        return "Garments are being produced. Upload courier tracking and image proof when complete.";
      case "DELIVERED":
        return "Batch delivered! Buyer has 7 days to inspect quality or dispute before auto-release.";
      case "COMPLETED":
        return `Order fully completed. ${formatCurrency(selectedOrder.escrow.makerPayoutNgn)} net payout disbursed to ${selectedOrder.makerName}.`;
      case "CANCELLED":
        return "Order cancelled. Escrow refunded or non-existent.";
      case "DISPUTED":
        return "Dispute active. Funds locked in escrow until Brutige Arbitrator resolves.";
      default:
        return "";
    }
  };

  return (
    <div className={styles.main}>
      {modalOpen && (
        <DeliveryProofModal
          orderId={selectedOrder.id}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setStatus("DELIVERED");
            setModalOpen(false);
          }}
        />
      )}

      <div className={styles.container + " " + styles.prod}>
        <div className={styles.content}>
          <div>
            <div className={styles.header}>
              <p>ORDER ID: {selectedOrder.id}</p>
              <div
                className={styles.orderStatus}
                style={{
                  background: getOrderStatusColor(
                    selectedOrder.status as OrderStatus,
                  ),
                }}
              >
                <p>{selectedOrder.status}</p>
              </div>
              <p>
                Brief: <span>{selectedOrder.briefId}</span>
              </p>
              <p>
                Quote: <span>{selectedOrder.quoteId}</span>
              </p>
            </div>
            <h2 className={styles.prodName}>{selectedOrder.garmentType}</h2>
            <p className={styles.ordDetails}>
              Ordered by <span>{selectedOrder.briefId}</span> for production by{" "}
              <span>{selectedOrder.makerName}</span>
            </p>
          </div>

          <div className={styles.orderDetail}>
            <div>
              <div className={styles.header}>
                <p>CONTRACT TOTAL</p>
              </div>
              <h3 className={styles.orderPrice}>
                {formatCurrency(selectedOrder.totalAmountNgn)}
              </h3>
            </div>

            <div>
              <div className={styles.header}>
                <p>TARGET DELIVERY</p>
              </div>
              <p className={styles.orderExpDelivery}>
                {selectedOrder.expectedDelivery}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <p>ORDER LIFECYCLE</p>
        <div className={styles.lifeCycle}>
          {statuses.map((status) => (
            <StatusCard
              key={status}
              selectedOrder={selectedOrder}
              status={status}
            />
          ))}
        </div>

        <div className={styles.statusAction}>
          <div className={styles.stack}>
            <p className={styles.head}>STATUS ACTION</p>
            <p>{getStatusActionText()}</p>
          </div>
          <div className={styles.actionButtons}>{getStatusActions()}</div>
        </div>
      </div>

      <div className={styles.container + " " + styles.escrow}>
        <div className={styles.header}>
          <div className={styles.stack}>
            <h3>Brutige Escrow Vault</h3>
            <p>
              Funds locked in Escrow. {selectedOrder.makerName} is ready to
              begin fabric cutting.
            </p>
          </div>

          <div className={styles.escrowStatus}>
            <p>ESCROW STATUS</p>
            <p
              style={{
                background: getEscrowStatusColor(
                  selectedOrder.escrow.status as EscrowStatus,
                ),
              }}
              className={styles.status}
            >
              {selectedOrder.escrow.status}
            </p>
          </div>
        </div>

        <div className={styles.escrowDetails}>
          <div>
            <p className={styles.head}>TOTAL HELD FROM BUYER</p>
            <h3>{formatCurrency(selectedOrder.escrow.amountNgn)}</h3>
          </div>
          <div>
            <p className={styles.head}>BRUTIGE FEES (10%)</p>
            <h3>{formatCurrency(selectedOrder.escrow.platformFeeNgn)}</h3>
          </div>
          <div>
            <p className={styles.head}>MAKER PAYOUT</p>
            <h3 style={{ color: "var(--brut-success)" }}>
              {formatCurrency(selectedOrder.escrow.makerPayoutNgn)}
            </h3>
          </div>
        </div>
      </div>

      <div className={styles.container + " " + styles.garmentDesc}>
        <div className={styles.header}>
          <a
            onClick={() => setSelected("specs")}
            className={selected == "specs" ? styles.active : ""}
          >
            GARMENT SPECIFICATIONS
          </a>
          <a
            onClick={() => setSelected("finance")}
            className={selected == "finance" ? styles.active : ""}
          >
            FINANCIAL BREAKDOWN
          </a>
        </div>

        {selected == "specs" ? (
          <div className={styles.specs}>
            <div className={styles.prodImage}>
              <img
                src="https://i.animepahe.pw/uploads/posters/f3e/f3e7edb725783cd2f4bcc0deabc82c757214f3f0aa529c78f8a337a809316da1.th.webp"
                alt={selectedOrder.garmentType}
              />
            </div>
            <div className={styles.prodDetails}>
              <div>
                <p className={styles.head}>ITEM NAME</p>
                <p>{selectedOrder.garmentType}</p>
              </div>
              <div>
                <p className={styles.head}>ORDER QUANTITY</p>
                <p>{selectedOrder.quantity} Units</p>
              </div>
              <div>
                <p className={styles.head}>DESCRIPTION</p>
                <p className={styles.prodDesc}>
                  Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.financeBreak}>
            <div className={styles.content}>
              <div>
                <p>Gross Contract Amount</p>
                <p style={{ color: "var(--brut-text)" }}>
                  {formatCurrency(selectedOrder.escrow.amountNgn)}
                </p>
              </div>
              <div>
                <p>Brutige Commission (10%)</p>
                <p style={{ color: "var(--brut-warning)" }}>
                  -{formatCurrency(selectedOrder.escrow.platformFeeNgn)}
                </p>
              </div>
              <div>
                <p style={{ color: "var(--brut-text)" }}>Net Maker Payment</p>
                <p style={{ color: "var(--brut-success)" }}>
                  {formatCurrency(selectedOrder.escrow.makerPayoutNgn)}
                </p>
              </div>
            </div>

            <p style={{ color: "var(--brut-warning)" }}>
              * Funds are released automatically after 7 days from marked
              delivery, or immediately upon buyer manual confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCard = ({
  status,
  selectedOrder,
}: {
  status: string;
  selectedOrder: ProductionOrder;
}) => {
  const isActive = status == selectedOrder.status;
  return (
    <div className={styles.statusCard + (isActive ? " " + styles.active : "")}>
      <p className={styles.head}>{status}</p>
      <p>Buyer Payment</p>
    </div>
  );
};

export default OrderView;
