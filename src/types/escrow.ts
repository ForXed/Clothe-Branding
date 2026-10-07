export type EscrowStatus =
  | "AWAITING"
  | "HELD"
  | "RELEASED"
  | "REFUNDED"
  | "DISPUTED";

export interface Escrow {
  id: string;
  orderId: string;
  status: EscrowStatus;
  amountNgn: number; // Total held from buyer
  platformFeeNgn: number; // Brutige commission (fee transparency)
  makerPayoutNgn: number; // What the maker actually receives
  heldAt?: string;
  autoReleaseAt?: string; // 7-day auto-release window
  releasedAt?: string;
  refundedAt?: string;
}
