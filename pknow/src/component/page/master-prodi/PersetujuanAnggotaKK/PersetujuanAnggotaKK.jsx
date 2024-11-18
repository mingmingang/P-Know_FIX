import Search from "../../../part/Search";
import KelompokKeahlian from "../../../part/KelompokKeahlian";
import developerImage from "../../../../assets/developer.png";
import "../../../../index.css";

export default function PersetujuanAnggotaKK({onChangePage}) {

  return (
    <>
      <div className="app-container">
        <main>
          <Search
            title="Manajemen Informatika Persetujuan Anggota Keahlian"
            description="Program Studi dapat menyetujui persetujuan pengajuan anggota keahlian yang diajukan oleh Tenaga Pendidik untuk menjadi anggota dalam Kelompok Keahlian. Program Studi dapat melihat lampiran pengajuan dari Tenaga Pendidik untuk menjadi bahan pertimbangan"
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
                          style={{ color: "#FFC619" }}
                        ></i>
                      </td>
                      <td>
                        <p>Menunggu Persetujuan</p>
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
              ketButton="Lihat Semua"
              iconClass="fas fa-user-friends"
              showProdi={false}
              showUserProdi={false}
              showStatusText={false}
              anggota="1 Anggota Aktif"
              statusPersetujuan="0 Menunggu Persetujuan"
              onClick={() => onChangePage("detail")}
            />
          </div>
        </main>
      </div>
    </>
  );
}
