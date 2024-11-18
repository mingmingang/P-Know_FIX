import { useState } from "react";
import Header from "../../../backbone/Header";
import budi from "../../../../assets/fotobudi.png";
import Footer from "../../../backbone/Footer";
import "../../../../style/Beranda.css";
import BerandaUtama from "../../../backbone/BerandaUtama";
import Search from "../../../part/Search";
import Button from "../../../part/Button";
import "../../../../../src/index.css";
import aktif from "../../../../assets/aktif.png";
import KelompokKeahlian from "../../../part/KelompokKeahlian";
import developerImage from "../../../../assets/developer.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function KelolaAKK({ onChangePage }) {
 
  const ketButton = "Kelola Anggota";

  return (
    <div className="app-container">
      <main>
        <Search
          title="Kelola Anggota"
          description="P-KNOW System dapat mengatur hak akses anggota yang terdaftar di sistem KMS ASTRAtech."
          placeholder="Cari Anggota"
        />
        <div className="navigasi-layout-page">
          <p className="title-kk">Kelompok Keahlian</p>
          <div className="left-feature">
            <div className="status">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <i
                        className="fas fa-circle"
                        style={{ color: "#4a90e2" }}
                      ></i>
                    </td>
                    <td>
                      <p>Aktif/Sudah Publikasi</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="fas fa-circle"
                        style={{ color: "#b0b0b0" }}
                      ></i>
                    </td>
                    <td>
                      <p>Menunggu PIC dari Prodi</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bootstrap Row and Columns for KelompokKeahlian */}

        <div className="kelompok-keahlian-container">
          <div className="kelompok-keahlian-item">
            <KelompokKeahlian
              image={developerImage}
              title="Android Developer"
              program="Informatics Management"
              pic="Kevin Trikusuma Dewa"
              description="Android developers create applications that can be used on smartphones or tablets, whether in the form of games or other forms of applications."
              statusImage={aktif}
              statusText="Aktif/Sudah Publikasi"
              ketButton={ketButton}
              iconClass="fas fa-user"
              onClick={() => onChangePage("add")}
              showDropdown={false} 
            />
          </div>
          <div className="kelompok-keahlian-item">
            <KelompokKeahlian
              image={developerImage}
              title="Web Developer"
              program="Computer Science"
              pic="John Doe"
              description="Web developers build and maintain websites, ensuring they are functional and user-friendly."
              statusImage={aktif}
              statusText="Aktif/Sudah Publikasi"
              ketButton={ketButton}
              iconClass="fas fa-user"
              onClick={() => onChangePage("add")}
              showDropdown={false} // Hide dropdown for other items
            />
          </div>
          <div className="kelompok-keahlian-item">
            <KelompokKeahlian
              image={developerImage}
              title="Data Scientist"
              program="Data Science"
              pic="Jane Smith"
              description="Data scientists analyze and interpret complex data to help organizations make better decisions."
              statusImage={aktif}
              statusText="Aktif/Sudah Publikasi"
              ketButton={ketButton}
              iconClass="fas fa-user"
              onClick={() => onChangePage("add")}
              showDropdown={false} // Hide dropdown for other items
            />
          </div>
        </div>

      </main>
    </div>
  );
}
