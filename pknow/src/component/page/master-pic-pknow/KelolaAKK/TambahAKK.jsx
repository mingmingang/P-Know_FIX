import Header from "../../../backbone/Header";
import budi from "../../../../assets/fotobudi.png";
import DetailKK from "../../../part/DetailAKK";
import Footer from "../../../backbone/Footer";
import { useState } from "react";

export default function LihatAKK() {

  const [anggotaList, setAnggotaList] = useState([
    { name: "Budi", prodi: "Manajemen Informatika" },
    { name: "Siti", prodi: "Manajemen Informatika" },
  ]);

  const [calonAnggotaList, setCalonAnggotaList] = useState([
    { name: "Andi", prodi: "Sistem Informasi" },
    { name: "Dewi", prodi: "Desain Komunikasi Visual" },
  ]);

  const handleAddAnggota = (newAnggota) => {
    setAnggotaList([...anggotaList, newAnggota]);
    setCalonAnggotaList(calonAnggotaList.filter(anggota => anggota.name !== newAnggota.name));
  };

  const handleRemoveAnggota = (anggotaToRemove) => {
    setAnggotaList(anggotaList.filter(anggota => anggota.name !== anggotaToRemove.name));
  };

  return (
    <div className="">
      <main>
        <DetailKK
          title="Andorid Developer"
          deskripsi="Pengembang Android adalah profesional yang membuat aplikasi yang dapat digunakan pada smartphone atau tablet, baik dalam bentuk permainan maupun aplikasi lain yang memiliki berbagai fungsi. Mereka menggunakan bahasa pemrograman seperti Java atau Kotlin serta lingkungan pengembangan Android Studio untuk membangun aplikasi yang kompatibel dengan perangkat Android.
                    Selain itu, pengembang Android bertanggung jawab untuk memastikan aplikasi yang mereka buat berjalan dengan lancar, aman, dan sesuai dengan kebutuhan pengguna. Mereka juga sering melakukan pemeliharaan dan pembaruan aplikasi untuk meningkatkan fungsionalitas serta memperbaiki bug yang ditemukan setelah aplikasi dirilis."
          prodi="Manajemen Informatika"
          pic="Arie Kusumawati"
          anggotaList={anggotaList}
          calonAnggotaList={calonAnggotaList} 
          onAddAnggota={handleAddAnggota} 
          onRemoveAnggota={handleRemoveAnggota} 
        />
      </main>
    </div>
  );
}
