export type EscrowStatus =
  | "AWAITING"
  | "HELD"
  | "RELEASED"
  | "REFUNDED"
  | "DISPUTED";

export interface Escrow {
  id: string;
  productionOrderId: string;
  amountNgn: number; // Total held from buyer
  platformFeePercent: number; // Brutige commission (fee transparency)
  feeAmountNgn: number; // Amount of fee charged
  makerPayoutNgn: number; // What the maker actually receives
  status: EscrowStatus;
  paidAt?: string | null;
  releasedAt?: string | null;
}
