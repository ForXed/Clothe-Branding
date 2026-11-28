/**
 * SavedService - Mock Backend Service for Saved Items & Collections
 * 
 * 📋 PURPOSE:
 * This file defines the API contract for saved items functionality.
 * Currently uses mock data with simulated latency.
 * 
 * 🔄 BACKEND INTEGRATION:
 * When backend is ready, replace the mock implementations with real
 * fetch/axios calls to your API endpoints.
 * 
 * 📡 EXPECTED ENDPOINTS:
 * - POST   /api/collections          → createCollection
 * - PATCH  /api/saved-items/:id      → moveItemToCollection
 * - DELETE /api/saved-items/:id      → deleteItem
 * - GET    /api/saved-items          → (future) getAllSavedItems
 * - GET    /api/collections          → (future) getCollections
 * 
 * ⚠️  NOTE:
 * SavedView currently uses prop functions from BrutigePlatform.
 * When backend is ready, SavedView should be refactored to use
 * this service directly instead of props.
 */

const DELAY = 600; // Simulate network latency

interface Collection {
  id: number;
  name: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const savedAPI = {
  /**
   * Create a new collection
   * Backend: POST /api/collections
   */
  createCollection: async (name: string): Promise<Collection> => {
    await new Promise((r) => setTimeout(r, DELAY));
    
    if (!name || name.trim() === '') {
      throw new Error('Collection name cannot be empty');
    }
    
    // TODO: Replace with real API call
    // const response = await fetch('/api/collections', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: name.trim() })
    // });
    // if (!response.ok) throw new Error('Failed to create collection');
    // return response.json();
    
    return {
      id: Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Move a saved item to a different collection
   * Backend: PATCH /api/saved-items/:itemId
   */
  moveItemToCollection: async (
    itemId: string | number, 
    collectionName: string
  ): Promise<ApiResponse<null>> => {
    await new Promise((r) => setTimeout(r, DELAY));
    
    // TODO: Replace with real API call
    // const response = await fetch(`/api/saved-items/${itemId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ collection: collectionName })
    // });
    // if (!response.ok) throw new Error('Failed to move item');
    // return response.json();
    
    return { success: true };
  },

  /**
   * Delete a saved item from the archive
   * Backend: DELETE /api/saved-items/:itemId
   */
  deleteItem: async (itemId: string | number): Promise<ApiResponse<null>> => {
    await new Promise((r) => setTimeout(r, DELAY));
    
    // TODO: Replace with real API call
    // const response = await fetch(`/api/saved-items/${itemId}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete item');
    // return response.json();
    
    return { success: true };
  },

  /**
   * Get all saved items for the current user
   * Backend: GET /api/saved-items
   * 
   * TODO: Implement when backend is ready
   */
  // getAllSavedItems: async (): Promise<SavedItem[]> => {
  //   const response = await fetch('/api/saved-items');
  //   if (!response.ok) throw new Error('Failed to fetch saved items');
  //   return response.json();
  // },

  /**
   * Get all collections for the current user
   * Backend: GET /api/collections
   * 
   * TODO: Implement when backend is ready
   */
  // getCollections: async (): Promise<Collection[]> => {
  //   const response = await fetch('/api/collections');
  //   if (!response.ok) throw new Error('Failed to fetch collections');
  //   return response.json();
  // },
};