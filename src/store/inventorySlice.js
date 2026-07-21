import { createSlice } from '@reduxjs/toolkit'; 

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { items: [] },
  reducers: {
    setItems(state, action) { state.items = action.payload; },
    addItem(state, action) { state.items.unshift(action.payload); },
    updateItem(state, action) {
      state.items = state.items.map(i => i.id === action.payload.id ? action.payload : i);
    }
  }
});

export const { setItems, addItem, updateItem } = inventorySlice.actions;
export default inventorySlice.reducer;