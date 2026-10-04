import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pinjammasjid_barang";
const EVENT_KEY = "pinjammasjid_acara";

// ===================== BARANG =====================

// ===== AMBIL SEMUA BARANG =====
export const getItems = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting items:", error);
    return [];
  }
};

// ===== SIMPAN BARANG BARU =====
export const saveItem = async (item: any) => {
  try {
    const existingItems = await getItems();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedItems = [...existingItems, newItem];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return newItem;
  } catch (error) {
    console.error("Error saving item:", error);
    throw error;
  }
};

// ===== HAPUS BARANG =====
export const deleteItem = async (id: string) => {
  try {
    const items = await getItems();
    const filtered = items.filter((item: any) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// ===================== ACARA =====================

// ===== AMBIL SEMUA ACARA =====
export const getEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(EVENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};

// ===== SIMPAN ACARA BARU =====
export const saveEvent = async (event: any) => {
  try {
    const existingEvents = await getEvents();
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedEvents = [...existingEvents, newEvent];
    await AsyncStorage.setItem(EVENT_KEY, JSON.stringify(updatedEvents));
    return newEvent;
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
};

// ===== HAPUS ACARA =====
export const deleteEvent = async (id: string) => {
  try {
    const events = await getEvents();
    const filtered = events.filter((event: any) => event.id !== id);
    await AsyncStorage.setItem(EVENT_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};