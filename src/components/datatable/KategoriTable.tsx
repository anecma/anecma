// types/index.ts (or any appropriate file where you manage types)
export interface Edukasi {
    id: number;
    created_by: number;
    judul: string;
    konten: string;
    thumbnail: string;
    thumbnail_public_id: string;
    jenis: string;
    kategori: string;
    kategori_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Kategori {
    id: number;
    nama_kategori: string;
    deskripsi: string;
    parent_id: number | null;
    gender: string;
    created_at: string;
    updated_at: string;
    kategori_child: Kategori[]; // Child categories, if any
    edukasi: Edukasi[]; // Edukasi items under this category
  }
  