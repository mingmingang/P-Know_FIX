import KelompokKeahlian from "../../../part/KelompokKeahlian";
import developerImage from "../../../../assets/developer.png";
import Search from "../../../part/Search";
import Button from "../../../part/Button";
import "../../../../index.css"

export default function PengajuanKelompokKeahlian({onChangePage}){
      const buttons = [
        {
          label: "Filter",
          className: "filter-button",
          icon: "fas fa-filter",
        },
        
      ];
    
      const filterOptions = [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
        { value: "popularity", label: "Popularity" },
      ];
    
      const filterFields = [
        {
          id: "sortSelect",
          label: "Sort By",
          options: filterOptions,
        },
        {
          id: "categorySelect",
          label: "Category",
          options: [
            { value: "tech", label: "Technology" },
            { value: "health", label: "Health" },
            { value: "education", label: "Education" },
          ],
        },
        {
          id: "regionSelect",
          label: "Region",
          options: [
            { value: "asia", label: "Asia" },
            { value: "europe", label: "Europe" },
          ],
        },
      ];

   
    return(
        <>
        <div className="app-container">
        <main>
        <Search
          title="Pengajuan Anggota Keahlian"
          description="ASTRAtech memiliki banyak program studi, di dalam program studi terdapat kelompok keahlian yang biasa disebut dengan Kelompok Keahlian"
          placeholder="Cari Kelompok Keahlian"
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
                                style={{ color: "yellow" }}
                            ></i>
                            </td>
                            <td>
                            <p>Menunggu Persetujuan Prodi</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <i
                                className="fas fa-circle"
                                style={{ color: "grey" }}
                            ></i>
                            </td>
                            <td>
                            <p>Tidak Terdaftar</p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                <div className="buttonadd_filter">
                <Button
                buttons={buttons}
                filterOptions={filterOptions}
                filterFields={filterFields}
            />
        </div>

          </div>
        </div>
        <div className="kelompok-keahlian-container">
        <div className="kelompok-keahlian-item">
            <KelompokKeahlian
              image={developerImage}
              title="Android Developer"
              program="Informatics Management"
              pic="Kevin Trikusuma Dewa"
              description="Android developers create applications that can be used on smartphones or tablets, whether in the form of games or other forms of applications."
              statusText="Tidak Terdaftar"
              ketButton="Gabung"
              iconClass="fas fa-add"
              colorCircle="grey"
              onClick={()=>onChangePage("gabung")}
            />
          </div>
          </div>
        </main>
        </div>
        </>
    )
}