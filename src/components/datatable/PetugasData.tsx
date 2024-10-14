interface PuskesmasData {
  id: number;
  nama_puskesmas: string;
  alamat: string;
}

interface PetugasData {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  puskesmas_id: number;
  puskesmas: PuskesmasData[]; 
}
