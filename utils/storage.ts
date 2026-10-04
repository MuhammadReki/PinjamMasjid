import { supabase } from "./supabase";

// ===================== BARANG =====================

// ===== AMBIL SEMUA BARANG =====
export const getItems = async () => {
  try {
    const { data, error } = await supabase
      .from("barang")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting items:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error getting items:", error);
    return [];
  }
};

// ===== SIMPAN BARANG BARU =====
export const saveItem = async (item: any) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("barang")
      .insert({
        ...item,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving item:", error);
    throw error;
  }
};

// ===== HAPUS BARANG =====
export const deleteItem = async (id: string) => {
  try {
    const { error } = await supabase.from("barang").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// ===================== ACARA =====================

// ===== AMBIL SEMUA ACARA =====
export const getEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("acara")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting events:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};

// ===== SIMPAN ACARA BARU =====
export const saveEvent = async (event: any) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("acara")
      .insert({
        ...event,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
};

// ===== HAPUS ACARA =====
export const deleteEvent = async (id: string) => {
  try {
    const { error } = await supabase.from("acara").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// ===================== PROFIL =====================

// ===== AMBIL PROFIL USER =====
export const getProfil = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profil")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error getting profil:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error getting profil:", error);
    return null;
  }
};

// ===== SIMPAN / UPDATE PROFIL =====
export const saveProfil = async (profil: any) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    const { data, error } = await supabase
      .from("profil")
      .upsert({
        id: user.id,
        ...profil,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving profil:", error);
    throw error;
  }
};