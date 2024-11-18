import { useState } from "react";
import PDF_Viewer from "./PDF_Viewer";
import imgDapus from "../../assets/DaftarPustaka/sistemAbsensiMenggunakanFace.png";
import "../../style/DaftarPustaka.css";
import backPage from "../../assets/backPage.png";
import Konfirmasi from "./Konfirmasi";


export default function DetailDaftarPustaka({ onChangePage }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBackAction, setIsBackAction] = useState(false);  
  const [konfirmasi, setKonfirmasi] = useState("Konfirmasi"); 
  const [pesanKonfirmasi, setPesanKonfirmasi] = useState("Apakah Anda ingin meninggalkan halaman ini?"); 

  const handleGoBack = () => {
    setIsBackAction(true);  
    setShowConfirmation(true);  
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false); 
    onChangePage("index");
  };


  const handleConfirmNo = () => {
    setShowConfirmation(false);  
  };

  return (
    <div className="dapus-container">
      <div className="back-title-daftar-pustaka">
        <button
         onClick={handleGoBack}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <img src={backPage} alt="Back" className="back" />
        </button>
        <h1 className="title">Daftar Pustaka</h1>
      </div>
      <div className="daftar-pustaka-content">
        <div className="daftar-pustaka-title-layout">
          <img src={imgDapus} alt="Daftar Pustaka" />
          <div className="detail-daftar-pustaka">
            <div className="detail-informasi-daftar-pustaka">
              <h3>Judul</h3>
              <p>Menghitung Peluang Statis</p>
            </div>
            <div className="detail-informasi-daftar-pustaka">
              <h3>Deskripsi</h3>
              <p>
                Data science merupakan ilmu yang menggabungkan sebuah kemahiran
                di bidang ilmu tertentu dengan keahlian pemrograman matematika
                dan statistik.
              </p>
            </div>
            <div className="detail-informasi-daftar-pustaka">
              <h3>Kata Kunci</h3>
              <p>Big Data, Machine Learning</p>
            </div>
          </div>
        </div>

        <div className="pdf-file-daftar-pustaka">
          <PDF_Viewer pdfFileName="prg5.pdf" />
        </div>
      </div>
      {showConfirmation && (
        <Konfirmasi
          title={isBackAction ? "Konfirmasi Kembali" : konfirmasi}
          pesan={isBackAction ? "Apakah anda ingin kembali?" : pesanKonfirmasi}
          onYes={handleConfirmYes}
          onNo={handleConfirmNo}
        />
      )}
    </div>
  );
}
