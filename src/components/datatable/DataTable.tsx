export interface Edukasi {
  id: number;
  judul: string;
  konten: string;
  jenis: string;
  kategori: string;
  kategori_id:string;
  thumbnail: File | string | null;

}
