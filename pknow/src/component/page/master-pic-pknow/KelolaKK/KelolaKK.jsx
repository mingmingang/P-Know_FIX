import React, { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import "../../../../style/Beranda.css";
import Search from "../../../part/Search";
import Button from "../../../part/Button";
import "../../../../../src/index.css";
import ButtonPro from "../../../part/Button copy"; 
import CardKK from "../../../part/CardKelompokKeahlian";
import Alert from "../../../part/Alert";
import Loading from "../../../part/Loading";
import Paging from "../../../part/Paging";

const dataFilterSort = [
  { Value: "[Nama Kelompok Keahlian] asc", Text: "Nama Kelompok Keahlian [↑]" },
  {
    Value: "[Nama Kelompok Keahlian] desc",
    Text: "Nama Kelompok Keahlian  [↓]",
  },
];

const dataFilterStatus = [
  { Value: "", Text: "Semua" },
  { Value: "1", Text: "Menunggu PIC Prodi" },
  { Value: "Draft", Text: "Draft" },
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

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

export default function KelolaKK({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Kelompok Keahlian] asc",
    status: "",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      status: searchFilterStatus.current.value,
    }));
  }


  const getListKK = async () => {
    setIsError(false);

    try {
      let data = await UseFetch(API_LINK + "KK/GetDataKK", currentFilter);
      if (data === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil daftar Kelompok Keahlian.");
      } else if (data === "data kosong") {
        setCurrentData(data);
      } else {
        const formattedData = data.map((value) => {
          return {
            ...value,
            config: { footer: value.Status },
            data: {
              id: value.Key,
              title: value["Nama Kelompok Keahlian"],
              prodi: { key: value["Kode Prodi"], nama: value.Prodi },
              pic: { key: value["Kode Karyawan"], nama: value.PIC },
              desc: value.Deskripsi,
              status: value.Status,
              members: value.Members || [],
              memberCount: value.Count || 0,
              gambar: value.Gambar,
            },
          };
        });
        setCurrentData(formattedData);
      }
    } catch (e) {
      setIsError(true);
      console.log(e.message);
    }
  };
  
  
  useEffect(() => {
    getListKK();
  }, [currentFilter]);

  function handleDelete(id) {
    setIsError(false);

    SweetAlert("Konfirmasi Hapus", "Anda yakin ingin <b>menghapus permanen</b> data ini?", "warning", "Hapus").then((confirm) => {
      if (confirm) {
        UseFetch(API_LINK + "KK/DeleteKK", { idKK: id }).then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            SweetAlert("Sukses", "Data berhasil dihapus.", "success");
            handleSetCurrentPage(currentFilter.page);
          }
        });
      }
    });
  }

  function handleSetStatus(data, status) {
    setIsError(false);
    let message;
    if (data.status === "Draft" && !data.pic.key)
      message = "Apakah anda yakin ingin mengirimkan data ini ke Prodi?";
    else if (data.status === "Draft")
      message = "Apakah anda yakin ingin mempublikasikan data ini?";
    else if (data.status === "Aktif")
      message =
        "Apakah anda yakin ingin <b>menonaktifkan</b> data ini? <b>Semua anggota keahlian akan dikeluarkan secara otomatis</b> jika data ini dinonaktifkan";
    else if (data.status === "Tidak Aktif")
      message = "Apakah anda yakin ingin mengaktifkan data ini?";

    SweetAlert("Konfirmasi", message, "info", "Ya").then((confirm) => {
      if (confirm) {
        UseFetch(API_LINK + "KK/SetStatusKK", { idKK: data.id, status: status }).then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            let messageResponse;
            if (data[0].Status === "Menunggu") {
              messageResponse = "Sukses! Data sudah dikirimkan ke Prodi. Menunggu Prodi menentukan PIC Kelompok Keahlian..";
            } else if (data[0].Status === "Aktif") {
              messageResponse = "Sukses! Data berhasil dipublikasi. PIC Kelompok Keahlian dapat menentukan kerangka Program Belajar..";
            }
            SweetAlert("Sukses", messageResponse, "success");
            handleSetCurrentPage(currentFilter.page);
          }
        });
      }
    });
  }

  

  return (
    <div className="app-container">
      <main>
        <Search
          title="Kelola Kelompok Keahlian"
          description="ASTRAtech memiliki banyak program studi, di dalam program studi terdapat kelompok keahlian yang biasa disebut dengan Kelompok Keahlian"
          placeholder="Cari Kelompok Keahlian"
          ref={searchQuery} forInput="pencarianProduk"
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
           <div className="buttonadd_filter">
           <Button
        buttons={buttons}
        filterOptions={filterOptions}
        filterFields={filterFields}
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

      <div className="container">
        {currentData[0]?.Message ? (
          <Alert type="warning mt-3" message="Tidak ada data! Silahkan klik tombol tambah kelompok keahlian diatas.." />
        ) : (
          <div className="row mt-0 gx-4">
          {currentData
            .filter(
              (value) =>
                value.config.footer !== "Draft" &&
                value.config.footer !== "Menunggu"
            )
            .map((value) => (
              <div className="col-md-4 mb-4" key={value.data.id}>
                <CardKK
                  title="Data Scientist"
                  colorCircle="#61A2DC"
                  ketButton="Buka"
                  config={value.config}
                  data={value.data}
                  onChangePage={onChangePage}
                  onChangeStatus={handleSetStatus}
                />
              </div>
            ))}
          {currentData
            .filter((value) => value.config.footer === "Menunggu")
            .map((value) => (
              <div className="col-md-4 mb-4" key={value.data.id}>
                <CardKK
                  config={value.config}
                  data={value.data}
                  onChangePage={onChangePage}
                />
              </div>
            ))}
          {currentData
            .filter((value) => value.config.footer === "Draft")
            .map((value) => (
              <div className="col-md-4 mb-4" key={value.data.id}>
                <CardKK
                  config={value.config}
                  data={value.data}
                  onChangePage={onChangePage}
                  onDelete={handleDelete}
                  onChangeStatus={handleSetStatus}
                />
              </div>
              ))}
          </div>
        )}

        <div className="col-md-4 mb-4">
            <div className="d-flex flex-column">
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData="20"
                navigation={handleSetCurrentPage}
              />
            </div>
        </div>
      </div>
      </main>
    </div>
  );
}