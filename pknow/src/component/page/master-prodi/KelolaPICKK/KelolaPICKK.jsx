import Search from "../../../part/Search";
import "../../../../index.css"
import KelompokKeahlian from "../../../part/KelompokKeahlian";
import developerImage from "../../../../assets/developer.png";

export default function KelolaPICKK({onChangePage}) {
  return (
    <>
      <div className="app-container">
        <main>
          <Search
            title="Manajemen Informatika PIC Kelompok Keahlian"
            description="PIC Kelompok Keahlian dapat memodifikasi kelompok keahlian yang telah dibuat sebelumnya. Segala aktifitas kegiatan yang dilakukan akan diperiksa oleh PIC Kelompok Keahlian."
            placeholder="Cari Kelompok Keahlian"
            showInput={false}
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
          <div className="col-md-4" style={{ marginRight: "-40px" }}>
            <KelompokKeahlian
              image={developerImage}
              title="Android Developer"
              program="Informatics Management"
              pic="Kevin Trikusuma Dewa"
              description="Android developers create applications that can be used on smartphones or tablets, whether in the form of games or other forms of applications."
              colorCircle="#61A2DC"
              statusText="Aktif/Sudah Publikasi"
              ketButton="Tambah PIC"
              iconClass="fas fa-user-friends"
              anggota="1 Anggota Aktif"
              statusPersetujuan="0 Menunggu Persetujuan"
              onClick={() => onChangePage("add")}
            />
          </div>
        </main>
      </div>
    </>
  );
}
