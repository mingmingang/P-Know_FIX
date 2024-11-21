import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import "../../../../style/Beranda.css";
import Button2 from "../../../part/Button copy";
import "../../../../../src/index.css";
import ButtonPro from "../../../part/Button copy";
import CardKK from "../../../part/CardKelompokKeahlian";
import Alert from "../../../part/Alert";
import Paging from "../../../part/Paging";
import Input from "../../../part/Input";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import "../../../../style/Search.css";

const dataFilterSort = [
  { Value: "[Nama Kelompok Keahlian] asc", Text: "Nama Kelompok Keahlian [↑]" },
  {
    Value: "[Nama Kelompok Keahlian] desc",
    Text: "Nama Kelompok Keahlian  [↓]",
  },
];

const dataFilterStatus = [
  { Value: "", Text: "Semua" },
  { Value: "Menunggu", Text: "Menunggu PIC Prodi" },
  { Value: "Draft", Text: "Draft" },
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Kelompok Keahlian": null,
    PIC: null,
    Deskripsi: null,
    Status: null,
    "Kode Prodi": null,
    Prodi: null,
    Gambar: null,
    Count: 0,
    config: { footer: null },
    data: {
      id: null,
      title: null,
      prodi: "",
      pic: "",
      desc: "0",
      status: null,
      members: null,
      memberCount: 0,
      gambar: 0,
    },
  },
];

export default function KelolaKK({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isEmpty, setIsEmpty] = useState(false);
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
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      status: searchFilterStatus.current.value,
    }));
  }

  const getListKK = async () => {
    setIsEmpty(true);
    setIsError(false);
    try {
      let data = await UseFetch(API_LINK + "KK/GetDataKK", currentFilter);
      if (data === "ERROR") {
        throw new Error(
          "Terjadi kesalahan: Gagal mengambil daftar Kelompok Keahlian."
        );
      } else if (data.length === 0) {
        setCurrentData(data);
      } else {
        setIsEmpty(false);
        const formattedData = data.map((value) => {
          return {
            ...value,
            config: { footer: value.Status },
            data: {
              id: value.Key,
              title: value["Nama Kelompok Keahlian"],
              prodi: { key: value["Kode Prodi"] || "N/A", nama: value.Prodi },
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

  function handleSetStatus(data, status) {
    setIsError(false);
    let message;
    if (data.status === "Draft" && !data.pic.key)
      message = "Apakah anda yakin ingin mengirimkan data ini ke Prodi?";
    else if (data.status === "Draft")
      message = "Apakah anda yakin ingin mempublikasikan data ini?";
    else if (data.status === "Aktif")
      message =
        "Apakah anda yakin ingin menonaktifkan data ini? Semua anggota keahlian akan dikeluarkan secara otomatis< jika data ini dinonaktifkan";
    else if (data.status === "Tidak Aktif")
      message = "Apakah anda yakin ingin mengaktifkan data ini?";

    SweetAlert("Konfirmasi", message, "info", "Ya").then((confirm) => {
      if (confirm) {
        UseFetch(API_LINK + "KK/SetStatusKK", {
          idKK: data.id,
          status: status,
        }).then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            let messageResponse;
            if (data[0].Status === "Menunggu") {
              messageResponse =
                "Sukses! Data sudah dikirimkan ke Prodi. Menunggu Prodi menentukan PIC Kelompok Keahlian..";
            } else if (data[0].Status === "Aktif") {
              messageResponse =
                "Sukses! Data berhasil dipublikasi. PIC Kelompok Keahlian dapat menentukan kerangka Program Belajar..";
            }
            SweetAlert("Sukses", messageResponse, "success");
            onChangePage("index");
          }
        });
      }
    });
  }

  useEffect(() => {
    getListKK();
  }, [currentFilter]);

  async function handleDelete(id) {
    setIsError(false);
    const confirm = await SweetAlert(
      "Konfirmasi Hapus",
      "Anda yakin ingin menghapus permanen data ini?",
      "warning",
      "Hapus"
    );
    if (confirm) {
      const data = await UseFetch(API_LINK + "KK/DeleteKK", { idKK: id });
      if (!data || data === "ERROR" || data.length === 0) {
        setIsError(true);
      } else {
        SweetAlert("Sukses", "Data berhasil dihapus.", "success");
        handleSetCurrentPage(currentFilter.page);
      }
    }
  }
  

  return (
    <div className="app-container">
      <main>
        <div className="backSearch">
          <h1>Kelola Kelompok Keahlian</h1>
          <p>
            ASTRAtech memiliki banyak program studi, di dalam program studi
            terdapat kelompok keahlian yang biasa disebut dengan Kelompok
            Keahlian
          </p>
          <div className="input-wrapper">
            <div
              className=""
              style={{
                width: "700px",
                display: "flex",
                backgroundColor: "white",
                borderRadius: "20px",
                height: "40px",
              }}
            >
              <Input
                ref={searchQuery}
                forInput="pencarianKK"
                placeholder="Cari"
                style={{
                  border: "none",
                  width: "680px",
                  height: "40px",
                  borderRadius: "20px",
                }}
              />
              <Button2
                iconName="search"
                classType="primary px-4"
                title="Cari"
                onClick={handleSearch}
                style={{ backgroundColor: "transparent", color: "#08549F" }}
              />
            </div>
          </div>
        </div>

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
                  <tr>
                    <td>
                      <i className="fas fa-circle" style={{ color: "red" }}></i>
                    </td>
                    <td>
                      <p>Tidak Aktif</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tes" style={{ display: "flex" }}>
              <div className="">
                <Filter handleSearch={handleSearch}>
                  <DropDown
                    ref={searchFilterSort}
                    forInput="ddUrut"
                    label="Urut Berdasarkan"
                    type="none"
                    arrData={dataFilterSort}
                    defaultValue="[Nama Kelompok Keahlian] asc"
                  />
                  <DropDown
                    ref={searchFilterStatus}
                    forInput="ddStatus"
                    label="Status"
                    type="none"
                    arrData={dataFilterStatus}
                    defaultValue="Aktif"
                  />
                </Filter>
              </div>
              <div className="">
                <ButtonPro
                  style={{ marginLeft: "20px" }}
                  iconName="add"
                  classType="success"
                  label="Tambah"
                  onClick={() => onChangePage("add")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {isEmpty ? (
            <Alert
              type="warning mt-3"
              message="Tidak ada data! Silahkan klik tombol tambah kelompok keahlian diatas.."
            />
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
                      key={value.data.id}
                      title="Data Scientist"
                      colorCircle="#61A2DC"
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
                      key={value.data.id}
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
                      key={value.data.id}
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
                totalData={currentData[0]?.Count || 0}
                navigation={handleSetCurrentPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
