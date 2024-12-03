import { useState } from "react";
import Icon from "./Icon.jsx";
import Button from "./Button.jsx";
import AppContext_master from "../page/Materi/master-proses/MasterContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import AppContext_test from "../page/Materi/master-test/TestContext.jsx";
import { API_LINK } from "../util/Constants.js";
import "../../style/KelompokKeahlian.css";

function CardMateri({ 
  materis, 
  onStatus,
  onEdit,
  onReviewJawaban,
  onBacaMateri,
  onDetail,
  MAX_DESCRIPTION_LENGTH = 100,
  isNonEdit,
}) {
  const [expandDeskripsi, setExpandDeskripsi] = useState({});

  const handleExpandDescription = (bookId) => {
    setExpandDeskripsi((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId]
    }));
  };

  const handleStatusChange = (book) => {
    console.log(`Status buku ${book.Key} diubah`);
    onStatus(book.Key);
  };

  const handleBacaMateri = (book) => {
    AppContext_test.materiId = book.Key;
    AppContext_master.materiId = book.Key;
    AppContext_test.refreshPage += 1;
    onBacaMateri("pengenalan", true, book.Key, true);
  };

  const handleReviewJawaban = (book) => {
    AppContext_test.materiId = book.Key;
    AppContext_master.materiId = book.Key;
    onReviewJawaban("reviewjawaban", true, book.Key, true);
  };

  // onClick={() => onDetail("materiDetail", AppContext_test.DetailMateri = book, AppContext_master.DetailMateri = book)}

  return (
    <div className="container">
      <div className="row mt-0 gx-4 ml-0 ">
        {materis.map((book, index) => {
          if (book.Key == null) {
            return null;
          }
          return (
            <div className="col-md-4 mb-4"  key={book.Key}>
              <div
                className="bg-white-kk"
                style={{ borderColor: book.Status === "Aktif" ? "blue" : "grey" }}
              >
                <div>
                  <img src={book.Gambar} alt="gambar" />
                  <div>
                    <h3
                      className="text-xl font-bold text-blue-600"
                      style={{ fontSize: "20px", textAlign: "justify" }}
                    >
                      {book.Judul}
                    </h3>
                    <div className="mb-1" style={{ fontSize: "12px", marginLeft: "20px" }}>
                      <span style={{ color: "black", fontSize: "16px", fontWeight: "600" }}>
                        {book.Kategori}
                      </span>
                    </div>
                    <div
                      className="mb-1"
                      style={{ color: "black", fontSize: "16px", fontWeight: "600" }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          marginRight: "10px",
                          marginLeft: "20px",
                          fontWeight: "600",
                          color: "black",
                        }}
                      />
                      <span>{book.Uploader} • {book.Creadate?.slice(0, 10)}</span>
                    </div>
                    <p
                      className="card-text p-0 m-0"
                      style={{
                        fontSize: "12px",
                        maxHeight: "75px",
                        overflow: "hidden",
                        textAlign: 'justify',
                      }}
                    >
                      {book.Keterangan.length > MAX_DESCRIPTION_LENGTH && !expandDeskripsi[book.Key] ? (
                        <>
                          {book.Keterangan.slice(0, MAX_DESCRIPTION_LENGTH) + " ..."}
                          <a
                            className="btn btn-link text-decoration-none p-0"
                            onClick={() => handleExpandDescription(book.Key)}
                            style={{ fontSize: "12px" }}
                          >
                            Baca Selengkapnya <Icon name={"caret-down"} />
                          </a>
                        </>
                      ) : (
                        <>
                          {book.Keterangan}
                          {expandDeskripsi[book.Key] && (
                            <a
                              className="btn btn-link text-decoration-none p-0"
                              onClick={() => handleExpandDescription(book.Key)}
                              style={{ fontSize: "12px" }}
                            >
                              Tutup <Icon name={"caret-up"} />
                            </a>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <hr className="m-0 p-0" style={{ color: "#67ACE9" }} />
                <div className="card-footer d-flex justify-content-end bg-white">
                  {isNonEdit === false ? (
                    <>
                      {book.Status === "Aktif" && (
                        <button
                          className="btn btn-sm text-primary"
                          title="Edit Materi"
                          onClick={() => onEdit("materiEdit", AppContext_test.DetailMateriEdit = book, AppContext_test.DetailMateri = book, AppContext_master.DetailMateri = book)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-circle"
                        onClick={() => handleStatusChange(book)}
                      >
                        {book.Status === "Aktif" ? (
                          <i
                            className="fas fa-toggle-on text-primary"
                            style={{ fontSize: '20px' }}
                          ></i>
                        ) : (
                          <i
                            className="fas fa-toggle-off text-red"
                            style={{ fontSize: '20px' }}
                          ></i>
                        )}
                      </button>
                      <button
                        className="btn btn-sm text-primary"
                        title="Review Jawaban"
                        onClick={() => handleReviewJawaban(book)}
                      >
                        <i className="fas fa-file"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => handleBacaMateri(book)}
                    >
                      Baca Materi
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardMateri;
