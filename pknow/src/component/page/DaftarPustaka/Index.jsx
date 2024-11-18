import { useState } from "react";
import budi from "../../../assets/fotobudi.png";
import Search from "../../part/Search";
import Button from "../../part/Button";
import "../../../../src/index.css";
import aktif from "../../../assets/aktif.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../../backbone/Header";
import Footer from "../../backbone/Footer";
import Daftar from "../../part/DaftarPustaka";
import imgDapus from "../../../assets/DaftarPustaka/sistemAbsensiMenggunakanFace.png";
import ButtonPro from "../../part/Button copy"

export default function DaftarPustaka({ onChangePage }) {
 

  const ketButton = "Buka";

  return (
    <div className="app-container">
      <main>
        <Search
          title="Daftar Pustaka"
          description="Pustaka yang dihasilkan dari kegiatan yang dilakukan oleh seluruh Civitas ASTRAtech dapat diarsipkan pada P-KNOW System"
          placeholder="Cari Daftar Pustaka"
        />
        <div className="navigasi-layout-page">
          <p className="title-kk">Daftar Pustaka</p>
          <div className="left-feature">
            <div className="status">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <i
                        className="fas fa-circle"
                        style={{
                          color: "green",
                          width: "2px",
                          marginRight: "20px",
                        }}
                      ></i>
                    </td>
                    <td>
                      <p>Pustaka Saya</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="fas fa-circle"
                        style={{ color: "#4a90e2", width: "20px" }}
                      ></i>
                    </td>
                    <td>
                      <p>Aktif / Publik</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="fas fa-circle"
                        style={{ color: "#b0b0b0", width: "20px" }}
                      ></i>
                    </td>
                    <td>
                      <p>Tidak Aktif</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttonadd_filter">
              <Button
                buttons={[
                  {
                    path: "/filter",
                    className: "filter-button", // For Filter button
                    icon: "fas fa-filter",
                    label: "Filter",
                  },
                ]}
              />
            </div>
            <div className="tes">
<ButtonPro
              iconName="add"
              classType="success"
              label="Tambah"
              onClick={() => onChangePage("add")}
            />
</div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4" style={{ marginRight: "-40px" }}>
            <Daftar
              image={imgDapus}
              title="Sistem Absensi Face Recognition Java"
              program="Programming"
              pic="Luthfi Alfiah"
              description="DDL adalah bagian dari SQL yang digunakan untuk mendefinisikan dan mengelola struktur database."
              statusImage={aktif}
              statusText="Pustaka Saya"
              ketButton="Buka Materi"
              colorCircle="green"
              onClick={() => onChangePage("detail")}
            />
          </div>

          <div className="col-md-4" style={{ marginRight: "-40px" }}>
            <Daftar
              image={imgDapus}
              title="Sistem Absensi Face Recognition Java"
              program="Programming"
              pic="Luthfi Alfiah"
              description="DDL adalah bagian dari SQL yang digunakan untuk mendefinisikan dan mengelola struktur database."
              statusImage={aktif}
              statusText="Pustaka Saya"
              ketButton="Buka Materi"
              colorCircle="green"
              onClick={() => onChangePage("detail")}
            />
          </div>

          <div className="col-md-4" style={{ marginRight: "-40px" }}>
            <Daftar
              image={imgDapus}
              title="Sistem Absensi Face Recognition Java"
              program="Programming"
              pic="Luthfi Alfiah"
              description="DDL adalah bagian dari SQL yang digunakan untuk mendefinisikan dan mengelola struktur database."
              statusImage={aktif}
              statusText="Pustaka Saya"
              ketButton="Buka Materi"
              colorCircle="green"
              onClick={() => onChangePage("detail")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
