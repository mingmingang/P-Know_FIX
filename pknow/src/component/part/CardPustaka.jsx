import "../../style/KelompokKeahlian.css";
import { API_LINK } from "../util/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Icon from "../part/Icon";
import Input from "./Input";

function CardPustaka({
  pustakas,
  uploader,
  onStatus,
  onDelete,
  onEdit = () => {},
  onDetail = () => {},
  MAX_DESCRIPTION_LENGTH = 100,
}) {
  const [expandDeskripsi, setExpandDeskripsi] = useState({});
  const handleExpandDescription = (bookId) => {
    setExpandDeskripsi((prevState) => ({
      prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  const handleDeleteClick = (book) => {
      onDelete(book.Key);
  };


  const handleStatusChange = (book, status) => {
    console.log(`Status buku ${book} diubah`);
    onStatus(book, status);
  };


  return (
    <>
      {pustakas.map((book) => {
        if (book.Key == null) {
          return null;
        }
        return (
          <div className="col-md-4 mb-4" key={book.Key} >
            <div
              className="bg-white-kk"
            >
              <div className="">
                <div className="card-body d-flex align-items-start position-relative">
                  {/* Gambar */}
                  <img
                    src={`${API_LINK}Upload/GetFile/${book.Gambar}`}
                    alt="gambar"
                    className="cover-daftar-kk"
                    height="200"
                    onClick={() => onDetail("detail", book)}
                  />
              </div>

        <div className="row">
            <div className="d-flex justify-content-between align-items-center mt-4">
              <h3 className="text-xl font-bold text-blue-600" style={{ fontSize: "20px", width:"100%" }}>
                {book.Judul}
              </h3>
            </div>
        </div>
                  <div style={{ paddingLeft: "20px" }}>
                    <div
                      className="mb-1"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      <div className="kk" style={{fontSize:"18px", fontWeight:"bold"}}>
                      <span>Kelompok Keahlian : {book["Kelompok Keahlian"]}</span>
                      </div>
                    </div>
                    <div className="mb-1 mt-2">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          marginRight: "10px",
                          color: "black",
                          fontSize: "20px",
                        }}
                      />
                      <span style={{ fontSize: "16px", fontWeight:"600" }}>
                        {book.Uploader} • {new Date(book.Creadate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                      </span>
                    </div>
                    <div>
                      <p
                        className="deskripsi d-flex"
                        style={{ fontSize: "14px", marginLeft:'0px', marginTop:"15px" }}
                      >
                        {book.Keterangan.length > MAX_DESCRIPTION_LENGTH &&
                        !expandDeskripsi[book.Key] ? (
                          <>
                            {book.Keterangan.slice(0, MAX_DESCRIPTION_LENGTH) +
                              " ..."}
                          </>
                        ) : (
                          <>{book.Keterangan}</>
                        )}
                      </p>
                      {book.Keterangan.length > MAX_DESCRIPTION_LENGTH && (
                        <a
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => handleExpandDescription(book.Key)}
                          style={{ fontSize: "12px" }}
                        >
                          {expandDeskripsi[book.Key] ? (
                            <>
                            <div className="" style={{marginTop:"-10px"}}>
                              Tutup <Icon name={"caret-up"} />
                              </div>
                            </>
                          ) : (
                            <>
                            <div className="" style={{marginTop:"-20px"}}>
                              Baca Selengkapnya <Icon name={"caret-down"} />
                              </div>
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex ">

                <p className="mb-0 text-secondary" style={{marginRight:"110px"}}><i
                  className="fas fa-circle"
                  icon="circle"
                  style={{
                    color:book.Status === "Tidak Aktif"
                    ? "red"
                    : uploader === book.Uploader
                    ? "#198754"
                    : "#67ACE9",
                cursor: "pointer",
                    marginRight: "20px",
                    width: "10px",
                  }}
                />{book.Status === "Tidak Aktif" 
                  ? "Tidak Aktif" 
                  : uploader === book.Uploader 
                  ? "Pusaka Saya" 
                  : "Aktif / Publik"
                }</p>

              {uploader === book.Uploader && (
                <div className="card-footer p-1 d-flex align-items-center justify-content-end">
                  <Icon
                    name="edit"
                    type="Bold"
                    cssClass="btn px-2 py-0 text-primary"
                    title="Ubah pustaka"
                    onClick={() => onEdit("edit", book)}
                  />
                  <Icon
                    name="delete"
                    type="Bold"
                    style={{color:"red"}}
                    title="Hapus pustaka"
                    onClick={() => handleDeleteClick(book)}
                  />
                  <div
                    className="form-check form-switch py-0 ms-2"
                    style={{ width: "fit-content" }}
                  >
                    <Input
                      type="checkbox"
                      title="Aktif / Nonaktif"
                      className="form-check-input"
                      checked={book.Status === "Aktif"}
                      onChange={() => handleStatusChange(book.Key, "Tidak Aktif")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    ></label>
                  </div>
                </div>
              )}

            {uploader !== book.Uploader && (
                <div className="card-footer p-1 d-flex align-items-center justify-content-end">
                  <button
                    onClick={() => onDetail("detail", book)}
                    style={{width:"100px", border:"none", padding:"10px 20px", color:"white", background:"#0E6EFE", borderRadius:"10px", fontWeight:"bold"}}
                  >
                    Buka
                  </button>
                </div>
              )}
              </div>
              </div>
            </div>
        );
      })}
    </>
  );
}

export default CardPustaka;