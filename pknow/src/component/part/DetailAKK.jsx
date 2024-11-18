import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faUser, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"; // Import dropdown icons
import Button from "./Button";
import "../../style/DetailAKK.css";
import developerImage from "../../assets/developer.png";
import budi from "../../assets/fotobudi.png";
import Konfirmasi from "./Konfirmasi"; // Import Konfirmasi component

export default function DetailAKK({
  title,
  prodi,
  deskripsi,
  pic,
  showFormAnggota = true, 
  showFormTambahAnggota = true, // Default visibility of the tambah anggota form
  anggotaList = [], // List of existing anggota
  calonAnggotaList = [], // List of calon anggota to be added
  kategoriList = [], // List of categories for Kelompok Keahlian
  showKategori = true, // New prop to control visibility of the Kategori section
  onAddAnggota, // Function called when adding anggota
  onRemoveAnggota, // Function called when removing anggota
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState("");
  const [pesanKonfirmasi, setPesanKonfirmasi] = useState("");
  const [actionType, setActionType] = useState(null);
  const [selectedAnggota, setSelectedAnggota] = useState(null);

  const [expandedKategori, setExpandedKategori] = useState({}); // State to track expanded categories
  const [expandedDescription, setExpandedDescription] = useState({}); // State for toggling descriptions for each kategori

  const placeholder = "Cari Anggota";
  const buttons = [
    {
      label: "Urutkan",
      className: "add-button",
      icon: "fas fa-sort",
    },
  ];

  const handleAddClick = (anggota) => {
    setActionType("add");
    setSelectedAnggota(anggota);
    setKonfirmasi("Konfirmasi Tambah");
    setPesanKonfirmasi(
      `Apakah anda yakin ingin menambah anggota ${anggota.name} ke keahlian?`
    );
    setShowConfirmation(true);
  };

  const handleTrashClick = (anggota) => {
    setActionType("trash");
    setSelectedAnggota(anggota);
    setKonfirmasi("Konfirmasi Hapus");
    setPesanKonfirmasi(
      `Apakah anda yakin ingin menghapus anggota ${anggota.name} dari keahlian?`
    );
    setShowConfirmation(true);
  };

  const handleConfirmYes = () => {
    if (actionType === "add" && selectedAnggota && onAddAnggota) {
      onAddAnggota(selectedAnggota);
    } else if (actionType === "trash" && selectedAnggota && onRemoveAnggota) {
      onRemoveAnggota(selectedAnggota);
    }
    setShowConfirmation(false); // Close the confirmation modal
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false); // Close the confirmation modal without doing anything
  };

  const toggleKategoriVisibility = (index) => {
    setExpandedKategori((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility of the clicked kategori
    }));
  };

  const toggleDescriptionVisibility = (index) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility of the description
    }));
  };

  const truncatedDescription =
    deskripsi.length > 50 ? deskripsi.slice(0, 150) + "..." : deskripsi;

  return (
    <>
      <div className="content-container">
        <div className="information-kelompok-keahlian">
          <div className="informasi-kk">
            <h1 className="title">{title}</h1>
            <div className="prodi">
              <FontAwesomeIcon
                icon={faGraduationCap}
                style={{ fontSize: "1.5rem", marginRight: "-5px" }}
              />
              <p className="text-gray-700" style={{ fontFamily: "Poppins" }}>
                {prodi}
              </p>
            </div>
            <p className="about">Tentang Kelompok Keahlian</p>
            <p className="deskripsi">{deskripsi}</p>
            <div className="userProdi">
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: "1.5rem", marginRight: "5px" }}
              />
              <p className="text-gray-700" style={{ fontFamily: "Poppins" }}>
                PIC: {pic}
              </p>
            </div>
          </div>
          <div className="cover-kk-show">
            <img src={developerImage} alt="" />
          </div>
        </div>

        <div className="detail-anggota-add">
          {showFormAnggota && (
            <div className="form-anggota">
              <div className="form-data-anggota">
                <div className="form-daftar-anggota">
                  <h1>Daftar Anggota</h1>
                  <div className="input-search">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      className="search"
                      placeholder={placeholder}
                    />
                  </div>
                  {anggotaList.length > 0 ? (
                    anggotaList.map((anggota, index) => (
                      <div className="list-anggota" key={index}>
                        <div className="nama-prodi">
                          <img src={budi} alt="" className="profile-anggota" />
                          <div className="identitas-anggota">
                            <h3>{anggota.name}</h3>
                            <p>{anggota.prodi}</p>
                          </div>
                        </div>
                        <div
                          className="delete-trash"
                          onClick={() => handleTrashClick(anggota)}
                        >
                          <i className="fas fa-trash"></i>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Tidak ada anggota yang terdaftar.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            className={`form-anggota full-width ${showFormTambahAnggota ? "" : "expand"}`}
          >
            <div className="form-daftar-anggota">
              <h1>Daftar Anggota</h1>
              <div className="input-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search"
                  placeholder={placeholder}
                />
              </div>
              {anggotaList.length > 0 ? (
                anggotaList.map((anggota, index) => (
                  <div className="list-anggota" key={index}>
                    <div className="nama-prodi">
                      <img src={budi} alt="" className="profile-anggota" />
                      <div className="identitas-anggota">
                        <h3>{anggota.name}</h3>
                        <p>{anggota.prodi}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Tidak ada anggota yang terdaftar.</p>
              )}
            </div>
          </div>

          {showKategori && (
            <div className="kategori-kelompok-keahlian">
              <h1>Program Kelompok Keahlian</h1>
              {kategoriList.length > 0 ? (
                kategoriList.map((kategori, index) => (
                  <div className="kategori-item" key={index}>
                    <h3>{kategori.name}</h3>
                    <p>
                      {expandedDescription[index]
                        ? kategori.deskripsi
                        : truncatedDescription}
                    </p>
                    <div className="detail-program-button">
                    {kategori.deskripsi.length > 50 && (
                      <button
                        className="see-more-button"
                        onClick={() => toggleDescriptionVisibility(index)}
                      >
                        {expandedDescription[index]
                          ? "Lihat Lebih Sedikit"
                          : "Lihat Selengkapnya"}
                      </button>
                    )}
                    <div
                      className="more-kategori"
                      onClick={() => toggleKategoriVisibility(index)}
                    >
                      <FontAwesomeIcon
                        icon={expandedKategori[index] ? faCaretUp : faCaretDown} // Change icon based on state
                      />
                    </div>
                    </div>
                    {expandedKategori[index] && (
                      <ul>
                        {kategori.programs.map((program, idx) => (
                         <li key={idx} style={{listStyle:'none', marginLeft:'-30px'}}>
                         <h4 style={{ fontSize: '16px', color:'#0A5EA8'}}>{program.name}</h4>
                         <p>
                           {program.deskripsi.length > 150
                             ? expandedDescription[index]
                               ? program.deskripsi
                               : program.deskripsi.slice(0, 150) + "..."
                             : program.deskripsi}
                         </p>
                         {program.deskripsi.length > 150 && (
                           <button
                             className="see-more-button"
                             onClick={() => toggleDescriptionVisibility(index)}
                           >
                             {expandedDescription[index]
                               ? "Lihat Lebih Sedikit"
                               : "Lihat Selengkapnya"}
                           </button>
                         )}
                       </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p>Tidak ada kategori yang tersedia.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {showConfirmation && (
        <Konfirmasi
          isOpen={showConfirmation}
          onClose={handleConfirmNo}
          onConfirm={handleConfirmYes}
          konfirmasi={konfirmasi}
          pesan={pesanKonfirmasi}
        />
      )}
    </>
  );
}
