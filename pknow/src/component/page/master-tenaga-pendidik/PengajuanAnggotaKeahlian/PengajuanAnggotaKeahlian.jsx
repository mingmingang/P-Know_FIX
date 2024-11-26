import React from "react";
import { useEffect, useRef, useState } from "react";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button copy";
import Input from "../../../part/Input";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";
import Cookies from "js-cookie";
import { decryptId } from "../../../util/Encryptor";
import Label from "../../../part/Label";
import CardPengajuanBaru from "../../../part/CardPengajuanBaru";
import Alert from "../../../part/Alert";
import "../../../../index.css";
import Search from "../../../part/Search";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "ID Lampiran": null,
    Lampiran: null,
    Karyawan: null,
    Status: null,
    Count: 0,
  },
];
const inisialisasiKK = [
  {
    Key: null,
    No: null,
    Nama: null,
    PIC: null,
    Deskripsi: null,
    Status: "Aktif",
    Count: 0,
  },
];
const dataFilterSort = [
  { Value: "[Nama Kelompok Keahlian] asc", Text: "Nama Kelompok Keahlian [↑]" },
  {
    Value: "[Nama Kelompok Keahlian] desc",
    Text: "Nama Kelompok Keahlian  [↓]",
  },
];


export default function PengajuanKelompokKeahlian({ onChangePage }){
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  const searchQuery = useRef();
  const searchFilterSort = useRef();

  function handleSearch() {
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
    };
    });
    }

  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataAktif, setDataAktif] = useState(false);
  const [listKK, setListKK] = useState(inisialisasiKK);
  const [detail, setDetail] = useState(inisialisasiData);
  const [listNamaFile, setListNamaFile] = useState([]);

  const [userData, setUserData] = useState({
    Role: "",
    Nama: "",
    kry_id: "",
  });

  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Kelompok Keahlian] ASC",
    kry_id: "",
  });

  const getUserKryID = async () => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    try {
      while (true) {
        let data = await UseFetch(API_LINK + "Utilities/GetUserLogin", {
          param: activeUser,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setUserData(data[0]);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            kry_id: data[0].kry_id,
          }));
          break;
        }
      }
    } catch (error) {
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  };

  useEffect(() => {
    getUserKryID();
  }, []);

  const getDataKKStatusByUser = async () => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    if (currentFilter.kry_id === "") return;

    try {
      while (true) {
        let data = await UseFetch(
          API_LINK + "PengajuanKK/GetAnggotaKK",
          currentFilter
        );
        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          const formattedData = data.map((value) => {
            if (value.Status === "Ditolak" || value.Status === "Dibatalkan") {
              return { ...value, Status: "Kosong" };
            }
            return value;
          });

          const waitingCount = formattedData.filter(
            (value) => value.Status === "Menunggu Acc"
          ).length;

          const finalData = formattedData.map((value) => {
            if (waitingCount === 2 && value.Status !== "Menunggu Acc") {
              return { ...value, Status: "None" };
            }
            return value;
          });
          setListKK(finalData);
          break;
        }
      }
    } catch (error) {
      setListKK([]);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  };

  useEffect(() => {
    getDataKKStatusByUser();
  }, [currentFilter]);

  const getDataAktif = (data) => {
    return data.find((value) => value.Status === "Aktif");
  };

  useEffect(() => {
    setDataAktif(getDataAktif(listKK));
  }, [listKK]);

  useEffect(() => {
    if (dataAktif) {
      const formattedData = listKK.map((value) => {
        if (value.Status === "Kosong") return { ...value, Status: "None" };
        return value;
      });
      setListKK(formattedData);
    }
  }, [dataAktif]);

  const getLampiran = async () => {
    setIsError((prevError) => ({ ...prevError, error: false }));

    if (!dataAktif.Key) return;

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "PengajuanKK/GetDetailLampiran", {
          page: 1,
          sort: "[ID Lampiran] ASC",
          akk_id: dataAktif.Key,
        });

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil Detail Lampiran."
          );
        } else {
          setListNamaFile(data);
          const formattedData = data.map((item) => ({
            ...item,
          }));
          const promises = formattedData.map((value) => {
            const filePromises = [];

            if (value["Lampiran"]) {
              const filePromise = fetch(
                API_LINK +
                  `Utilities/Upload/DownloadFile?namaFile=${encodeURIComponent(
                    value["Lampiran"]
                  )}`
              )
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  value.Lampiran = url;
                  return value;
                })
                .catch((error) => {
                  console.error("Error fetching file:", error);
                  return value;
                });
              filePromises.push(filePromise);
            }

            return Promise.all(filePromises).then((results) => {
              const updatedValue = results.reduce(
                (acc, curr) => ({ ...acc, ...curr }),
                value
              );
              return updatedValue;
            });
          });

          Promise.all(promises)
            .then((updatedData) => {
              console.log("Updated data with blobs:", updatedData);
              setDetail(updatedData);
            })
            .catch((error) => {
              console.error("Error updating currentData:", error);
            });
          break;
        }
      }
    } catch (error) {
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
      setDetail(null);
    }
  };

  useEffect(() => {
    console.log(dataAktif);
    if (dataAktif) getLampiran();
  }, [dataAktif]);

   
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
                {/* <Button
                buttons={buttons}
                filterOptions={filterOptions}
                filterFields={filterFields}
            /> */}
        </div>

          </div>
        </div>
        
        <>
        <div className="d-flex flex-column">
          {dataAktif ? (
            <div className="flex-fill">
              <div className="card">
                <div className="card-header bg-primary text-white fw-medium">
                  Terdaftar sebagai anggota keahlian
                </div>
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-lg-7 pe-4">
                      <h3 className="mb-3 fw-semibold">
                        {dataAktif["Nama Kelompok Keahlian"]}
                      </h3>
                      <h6 className="fw-semibold">
                        <span
                          className="bg-primary me-2"
                          style={{ padding: "2px" }}
                        ></span>
                        {dataAktif?.Prodi}
                      </h6>
                      <p
                        className="pt-3"
                        style={{
                          textAlign: "justify",
                        }}
                      >
                        {dataAktif?.Deskripsi}
                      </p>
                    </div>
                    <div className="col-lg-5 ps-4 border-start">
                      <h5 className="fw-semibold mt-1">Lampiran pendukung</h5>
                      {detail?.map((item, index) => (
                        <Label
                          key={index}
                          title={`Lampiran ${index + 1}`}
                          data={
                            item.Lampiran ? (
                              <a
                                href={item.Lampiran}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {/* {listNamaFile[index]?.Lampiran} */}
                                Lampiran {index + 1}{" "}
                                {dataAktif["Nama Kelompok Keahlian"]}
                              </a>
                            ) : (
                              "Tidak ada lampiran"
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-4">
                <div className="card-header fw-medium">
                  Kelompok Keahlian lainnya
                </div>
                <div className="card-body p-3">
                  <div className="row gx-4">
                    {listKK
                      ?.filter((value) => {
                        return value.Status !== "Aktif";
                      })
                      .map((value, index) => (
                        <CardPengajuanBaru
                          key={index}
                          data={value}
                          onChangePage={onChangePage}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-fill">
              <div className="input-group">
                <Input
                  ref={searchQuery}
                  forInput="pencarianProduk"
                  placeholder="Cari"
                />
                <Button
                  iconName="search"
                  classType="primary px-4"
                  title="Cari"
                  onClick={handleSearch}
                />
                <Filter>
                  <DropDown
                    ref={searchFilterSort}
                    forInput="ddUrut"
                    label="Urut Berdasarkan"
                    type="none"
                    arrData={dataFilterSort}
                    defaultValue="[Nama Kelompok Keahlian] asc"
                  />
                </Filter>
              </div>
              <div className="container">
                {listKK.filter((value) => value.Status === "Menunggu Acc")
                  .length == 2 && (
                  <Alert
                    type="info mt-3"
                    message="Anda hanya bisa mendaftar pada 2 Kelompok Keahlian. Tunggu konfirmasi dari prodi.."
                  />
                )}
                <div className="row mt-3 gx-4">
                  {listKK
                    ?.filter((value) => {
                      return value.Status === "Menunggu Acc";
                    })
                    .map((value, index) => (
                      <CardPengajuanBaru
                        key={index}
                        data={value}
                        onChangePage={onChangePage}
                      />
                    ))}
                  {listKK
                    ?.filter((value) => {
                      return value.Status != "Menunggu Acc";
                    })
                    .map((value, index) => (
                      <CardPengajuanBaru
                        key={index}
                        data={value}
                        onChangePage={onChangePage}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
    </>

        </main>
        </div>
        </>
    )
}