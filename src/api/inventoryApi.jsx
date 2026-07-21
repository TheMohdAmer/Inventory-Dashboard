
const STORAGE_KEY = 'inventory';

// helper to load from LocalStorage
export const fetchInventory = async () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return data;
};


// helper to save to LocalStorage
const saveInventory = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// add new item
export const addItem = async (item) => {
  const items = await fetchInventory();
  const newItem = {
    id: Date.now(),
    lastUpdated: new Date().toLocaleString(),
    ...item,
  };
  const updated = [newItem, ...items];
  saveInventory(updated);
  return newItem;
};



// update existing item
export const updateItem = async (updatedItem) => {
  const items = await fetchInventory();
  let newList = [];

  // create the new item with a refreshed timestamp
  const updated = {
    ...updatedItem,
    lastUpdated: new Date().toLocaleString(),
  };

  newList = items.map(i => (i.id === updatedItem.id ? updated : i));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

  // return the full updated object (not the old one)
  return updated;
};



// delete item 
export const deleteItem = async (id) => {
  const items = await fetchInventory();
  const updated = items.filter(i => i.id !== id);
  saveInventory(updated);
  return id;
};
