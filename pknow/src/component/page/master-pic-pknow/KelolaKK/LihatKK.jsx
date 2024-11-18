import Header from "../../../backbone/Header";
import budi from "../../../../assets/fotobudi.png";
import Footer from "../../../backbone/Footer";
import DetailKK from "../../../part/DetailAKK";
import { useState } from "react";

export default function LihatKK() {

  // Adjusted the state to better reflect Kategori Kelompok Keahlian
  const [kategoriList, setKategoriList] = useState([
    {
      name: "SQL Server Management System",
      deskripsi: "SQL Server adalah sistem manajemen basis data relasional (RDBMS) yang dikembangkan oleh Microsoft. Ini adalah platform yang kuat dan fleksibel untuk mengelola dan menimpan data, serta menyediakan berbagai fitur untuk mendukung pengembangan aplikasi dan analisis data.",
      programs: [
        { name: "1-1. Advance SQL Server", deskripsi: "Advance SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." },
        { name: "1-2. Basic SQL Server", deskripsi: "Basic SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." },
        { name: "1-3. Intermediate SQL Server", deskripsi: "Intermediate SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." }
      ]
    },
    {
      name: "Database Management System",
      deskripsi: "SQL Server adalah sistem manajemen basis data relasional (RDBMS) yang dikembangkan oleh Microsoft. Ini adalah platform yang kuat dan fleksibel untuk mengelola dan menimpan data, serta menyediakan berbagai fitur untuk mendukung pengembangan aplikasi dan analisis data.",
      programs: [
        { name: "Program 1A", deskripsi: "Deskripsi Program 1A" },
        { name: "Program 1B", deskripsi: "Deskripsi Program 1B" },
        { name: "Program 1C", deskripsi: "Deskripsi Program 1C" }
      ]
    }
  ]);

  const [anggotaList, setAnggotaList] = useState([
    { name: "Budi", prodi: "Manajemen Informatika" },
    { name: "Siti", prodi: "Manajemen Informatika" },
  ]);


  return (
    <>
      <div className="">
        <main>
          <DetailKK 
            title="Android Developer" 
            prodi="Manajemen Informatika" 
            deskripsi="Pengembang Android adalah profesional yang membuat aplikasi yang dapat digunakan pada smartphone atau tablet, baik dalam bentuk permainan maupun aplikasi lain yang memiliki berbagai fungsi. Mereka menggunakan bahasa pemrograman seperti Java atau Kotlin serta lingkungan pengembangan Android Studio untuk membangun aplikasi yang kompatibel dengan perangkat Android.
            Selain itu, pengembang Android bertanggung jawab untuk memastikan aplikasi yang mereka buat berjalan dengan lancar, aman, dan sesuai dengan kebutuhan pengguna. Mereka juga sering melakukan pemeliharaan dan pembaruan aplikasi untuk meningkatkan fungsionalitas serta memperbaiki bug yang ditemukan setelah aplikasi dirilis."
            pic="John Doe" 
            showFormAnggota={false} 
            showFormTambahAnggota={false} 
            kategoriList={kategoriList}
            anggotaList={anggotaList}
          />
        </main>
      </div>
    </>
  );
}
