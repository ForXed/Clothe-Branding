import apiClient from './apiClient';
import type { BuyerDashboard, MakerDashboard } from '../types/dashboard';

/** GET /api/v1/dashboard/buyer */
export async function getBuyerDashboard(): Promise<BuyerDashboard> {
  const { data } = await apiClient.get<BuyerDashboard>('/dashboard/buyer');
  return data;
}

/** GET /api/v1/dashboard/maker */
export async function getMakerDashboard(): Promise<MakerDashboard> {
  const { data } = await apiClient.get<MakerDashboard>('/dashboard/maker');
  return data;
}

export const dashboardService = { getBuyerDashboard, getMakerDashboard };
export default dashboardService;
