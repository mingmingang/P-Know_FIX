import { useState, useEffect } from "react";
import PDF_Viewer from "./PDF_Viewer";
import imgDapus from "../../assets/DaftarPustaka/sistemAbsensiMenggunakanFace.png";
import "../../style/DaftarPustaka.css";
import backPage from "../../assets/backPage.png";
import Konfirmasi from "./Konfirmasi";
import { API_LINK } from "../util/Constants";
import Video_Viewer from "../part/VideoPlayer";
import ReactPlayer from 'react-player';

export default function DetailDaftarPustaka({ onChangePage, withID }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBackAction, setIsBackAction] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState("Konfirmasi");
  const [pesanKonfirmasi, setPesanKonfirmasi] = useState(
    "Apakah Anda ingin meninggalkan halaman ini?"
  );
  const [fileExtension, setFileExtension] = useState("");

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

  const [fileData, setFileData] = useState({
    key: "",
    judul: "",
    deskripsi: "",
    gambar: "",
    katakunci: "",
    file: "",
  });

  useEffect(() => {
    if (withID) {
      setFileData({
        key: withID.id,
        judul: withID.Judul,
        deskripsi: withID.Keterangan,
        gambar: withID.Gambar,
        katakunci: withID.kataKunci,
        file: withID.File,
      });
      const ext = withID.File.split(".").pop().toLowerCase();
      setFileExtension(ext);
    }
  }, [withID]);

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
        <div className="pustaka-layout" style={{display:"flex"}}>
        <div className="daftar-pustaka-title-layout">
          <img
            src={`${API_LINK}Upload/GetFile/${fileData.gambar}`}
            alt="Daftar Pustaka"
            style={{borderRadius:"20px", width:"500px", height:"200px", objectFit:"cover"}}
          />
        </div>

        <div className="detail-daftar-pustaka">
          <div className="detail-informasi-daftar-pustaka">
            <h3>Judul</h3>
            <p>{fileData.judul}</p>
          </div>
          <div className="detail-informasi-daftar-pustaka">
            <h3>Deskripsi</h3>
            <p>{fileData.deskripsi}</p>
          </div>
          <div className="detail-informasi-daftar-pustaka">
            <h3>Kata Kunci</h3>
            <p>
              <span>
                {Array.isArray(withID["Kata Kunci"])
                  ? withID["Kata Kunci"].join(", ")
                  : withID["Kata Kunci"]}
              </span>
            </p>
          </div>
        </div>
        </div>

        {/* Menampilkan file berdasarkan ekstensi */}
        <div className="file-preview">
          {fileExtension === "pdf" && (
            <PDF_Viewer pdfFileName={fileData.file} />
          )}
          {fileExtension === "mp4" && (
        //   <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
        //   <iframe
        //     src={`${API_LINK}Upload/GetFile/${fileData.file}`}
        //     style={{
        //       position: "absolute",
        //       top: 0,
        //       left: 0,
        //       width: "100%",
        //       height: "100%",
        //       objectFit: "contain",
        //       borderRadius:"20px"
        //     }}
        //     title="Video Frame"
        //   ></iframe>
        // </div> 
       
            <ReactPlayer 
            url={`${API_LINK}Upload/GetFile/${fileData.file}`}
            playing={true} 
            controls={true}
            width="100%"
            height="100%"
            style={{borderRadius:"80px"}}
          />   
          )}
          {/* Anda bisa menambahkan lebih banyak kondisi untuk file lain seperti .docx atau .xlsx */}
          {fileExtension === "docx" && (
            <p>
              Dokumen Word tidak dapat ditampilkan di sini. Silahkan{" "}
              <a href={`${API_LINK}Upload/GetFile/${fileData.file}`} download>
                unduh
              </a>{" "}
              untuk melihatnya.
            </p>
          )}
          {fileExtension === "xlsx" && (
            <p>
              File Excel tidak dapat ditampilkan di sini. Silahkan{" "}
              <a href={`${API_LINK}Upload/GetFile/${fileData.file}`} download>
                unduh
              </a>{" "}
              untuk melihatnya.
            </p>
          )}
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
