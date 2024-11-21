// import Header from "../../../backbone/Header";
// import budi from "../../../../assets/fotobudi.png";
// import Footer from "../../../backbone/Footer";
// import DetailKK from "../../../part/DetailAKK";
// import { useState } from "react";

// export default function LihatKK() {

//   // Adjusted the state to better reflect Kategori Kelompok Keahlian
//   const [kategoriList, setKategoriList] = useState([
//     {
//       name: "SQL Server Management System",
//       deskripsi: "SQL Server adalah sistem manajemen basis data relasional (RDBMS) yang dikembangkan oleh Microsoft. Ini adalah platform yang kuat dan fleksibel untuk mengelola dan menimpan data, serta menyediakan berbagai fitur untuk mendukung pengembangan aplikasi dan analisis data.",
//       programs: [
//         { name: "1-1. Advance SQL Server", deskripsi: "Advance SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." },
//         { name: "1-2. Basic SQL Server", deskripsi: "Basic SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." },
//         { name: "1-3. Intermediate SQL Server", deskripsi: "Intermediate SQL Server mencakup berbagai fitur dan teknin yang lebih kompleks dibandingkan dengan operasi dasar." }
//       ]
//     },
//     {
//       name: "Database Management System",
//       deskripsi: "SQL Server adalah sistem manajemen basis data relasional (RDBMS) yang dikembangkan oleh Microsoft. Ini adalah platform yang kuat dan fleksibel untuk mengelola dan menimpan data, serta menyediakan berbagai fitur untuk mendukung pengembangan aplikasi dan analisis data.",
//       programs: [
//         { name: "Program 1A", deskripsi: "Deskripsi Program 1A" },
//         { name: "Program 1B", deskripsi: "Deskripsi Program 1B" },
//         { name: "Program 1C", deskripsi: "Deskripsi Program 1C" }
//       ]
//     }
//   ]);

//   const [anggotaList, setAnggotaList] = useState([
//     { name: "Budi", prodi: "Manajemen Informatika" },
//     { name: "Siti", prodi: "Manajemen Informatika" },
//   ]);


//   return (
//     <>
//       <div className="">
//         <main>
//           <DetailKK 
//             title="Android Developer" 
//             prodi="Manajemen Informatika" 
//             deskripsi="Pengembang Android adalah profesional yang membuat aplikasi yang dapat digunakan pada smartphone atau tablet, baik dalam bentuk permainan maupun aplikasi lain yang memiliki berbagai fungsi. Mereka menggunakan bahasa pemrograman seperti Java atau Kotlin serta lingkungan pengembangan Android Studio untuk membangun aplikasi yang kompatibel dengan perangkat Android.
//             Selain itu, pengembang Android bertanggung jawab untuk memastikan aplikasi yang mereka buat berjalan dengan lancar, aman, dan sesuai dengan kebutuhan pengguna. Mereka juga sering melakukan pemeliharaan dan pembaruan aplikasi untuk meningkatkan fungsionalitas serta memperbaiki bug yang ditemukan setelah aplikasi dirilis."
//             pic="John Doe" 
//             showFormAnggota={false} 
//             showFormTambahAnggota={false} 
//             kategoriList={kategoriList}
//             anggotaList={anggotaList}
//           />
//         </main>
//       </div>
//     </>
//   );
// }



import { useState, useEffect } from "react";
import Button from "../../../part/Button copy";
import Input from "../../../part/Input";
import Loading from "../../../part/Loading";
import Alert from "../../../part/Alert";

export default function KKDetailDraft({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    key: "",
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    status: "",
  });

  useEffect(() => {
    if (withID) {
      setFormData({
        key: withID.id,
        nama: withID.title,
        programStudi: withID.prodi.nama,
        personInCharge: withID.pic.nama,
        deskripsi: withID.desc,
        status: withID.status,
      });
    }
  }, [withID]);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Lihat Kelompok Keahlian{" "}
            <span className="badge text-bg-dark">Draft</span>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="nama"
                  label="Nama Kelompok Keahlian"
                  value={formData.nama}
                  readOnly
                />
              </div>
              <div className="col-lg-12">
                <label style={{ paddingBottom: "5px", fontWeight: "bold" }}>
                  Deskripsi/Ringkasan Mengenai Kelompok Keahlian
                </label>
                <textarea
                  className="form-control mb-3"
                  style={{ height: "200px" }}
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  readOnly
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="programStudi"
                  label="Program Studi"
                  value={formData.programStudi}
                  readOnly
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="personInCharge"
                  label="PIC Kelompok Keahlian"
                  value={formData.personInCharge || "-"}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="Batal"
            onClick={() => onChangePage("index")}
          />
        </div>
      </form>
    </>
  );
}
