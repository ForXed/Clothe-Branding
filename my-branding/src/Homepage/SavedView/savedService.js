// SavedService.js - Mock Backend Service
// Replace these functions with real fetch/axios calls when backend is ready

const DELAY = 600; // Simulate network latency

export const savedAPI = {
  // Simulate creating a new collection
  createCollection: async (name) => {
    await new Promise(r => setTimeout(r, DELAY));
    if (!name || name.trim() === "") throw new Error("Collection name cannot be empty");
    return { id: Date.now(), name: name.trim(), createdAt: new Date().toISOString() };
  },

  // Simulate moving an item to a collection
  moveItemToCollection: async (itemId, collectionName) => {
    await new Promise(r => setTimeout(r, DELAY));
    // In real backend: PATCH /api/items/{itemId} { collection: collectionName }
    return { success: true, itemId, collectionName };
  },

  // Simulate deleting an item
  deleteItem: async (itemId) => {
    await new Promise(r => setTimeout(r, DELAY));
    return { success: true, itemId };
  }
};