import Search from "../../../part/Search";
import { useState, useEffect } from "react";
import PersetujuanKK from "../../../part/PersetujuanKK";
import UseFetch from "../../../util/UseFetch";
import { API_LINK } from "../../../util/Constants";
import Button from "../../../part/Button copy";
import DropDown from "../../../part/Dropdown";
import Input from "../../../part/Input";
import Loading from "../../../part/Loading";
import Alert from "../../../part/Alert";
import Filter from "../../../part/Filter";
import Icon from "../../../part/Icon";
import Label from "../../../part/Label";
import SweetAlert from "../../../util/SweetAlert";

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

export default function DetailPersetujuan({onChangePage, withID}) {

  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [karyawan, setKaryawan] = useState([]);
  const [listAnggota, setListAnggota] = useState([]);
  const [listNamaFile, setListNamaFile] = useState([]);
  const [detail, setDetail] = useState(inisialisasiData);

  useEffect(() => {
    if (withID) {
      setFormData(withID);
    }
  }, [withID]);

  const getListAnggota = async (idKK) => {
    try {
      while (true) {
        let data = await UseFetch(API_LINK + "AnggotaKK/GetAnggotaKK", {
          page: 1,
          query: "",
          sort: "[Nama Anggota] ASC",
          status: "",
          kke_id: idKK,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar anggota.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListAnggota(data);
          break;
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  useEffect(() => {
    if (formData.Key) {
      getListAnggota(formData.Key);
    }
  }, [formData]);

  const getListLampiran = async (idAKK) => {
    setIsError((prevError) => ({ ...prevError, error: false }));

    try {
      let data = await UseFetch(API_LINK + "PengajuanKK/GetDetailLampiran", {
        p1: 1,
        p2: "[ID Lampiran] ASC",
        p3: idAKK,
      });

      if (data === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil Detail Lampiran.");
      } else {
        setListNamaFile(data);
        const formattedData = data.map((item) => ({
          ...item,
        }));
        // console.log("for: " + JSON.stringify(formattedData));
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

  function handleDetailLampiran(data) {
    getListLampiran(data.Key);
    setKaryawan(data);
  }

  function handleBatalkan() {
    setKaryawan({});
    setDetail([]);
  }

  // MENGUBAH STATUS
  function handleSetStatus(data, status) {
    setIsError(false);

    let message;

    if (status === "Aktif") message = "Apakah anda yakin ingin menyetujui?";
    else if (status === "Ditolak") message = "Apakah anda yakin ingin menolak?";

    SweetAlert("Konfirmasi", message, "info", "Ya").then((confirm) => {
      if (confirm) {
        setIsLoading(true);
        UseFetch(API_LINK + "AnggotaKK/SetStatusAnggotaKK", {
          idKK: data.Key,
          status: status,
        })
          .then((data) => {
            if (data === "ERROR" || data.length === 0) setIsError(true);
            else {
              let message;
              if (data === "Aktif") {
                message =
                  "Sukses! Karyawan berhasil menjadi anggota keahlian..";
              } else if (data === "Ditolak") {
                message = "Berhasil. Karyawan telah ditolak..";
              }
              SweetAlert("Sukses", message, "success");
              onChangePage("index");
            }
          })
          .then(() => setIsLoading(false));
      }
    });
  }

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="appcontainer">
        <main>
          <Search
            title="Manajemen Informatika Persetujuan Anggota Keahlian"
            description="Program Studi dapat menyetujui persetujuan pengajuan anggota keahlian yang diajukan oleh Tenaga Pendidik untuk menjadi anggota dalam Kelompok Keahlian. Program Studi dapat melihat lampiran pengajuan dari Tenaga Pendidik untuk menjadi bahan pertimbangan"
            placeholder="Cari Kelompok Keahlian"
            showInput={false}
          />
          

          <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="card mb-3">
            <div className="card-header bg-primary fw-medium text-white">
              Detail Kelompok Keahlian
            </div>
            <div className="card-body">
              <div className="row pt-2">
                <div className="col-lg-7 px-4">
                  <h3 className="mb-3 fw-semibold">
                    {formData["Nama Kelompok Keahlian"]}
                  </h3>
                  <h6 className="fw-semibold">
                    <span
                      className="bg-primary me-2"
                      style={{ padding: "2px" }}
                    ></span>
                    {formData.Prodi}
                  </h6>
                  <div className="pt-2 ps-2">
                    <Icon
                      name="user"
                      cssClass="p-0 ps-1 text-dark"
                      title="PIC Kelompok Keahlian"
                    />{" "}
                    <span>PIC : {formData.PIC}</span>
                  </div>
                  <hr className="mb-0" style={{ opacity: "0.2" }} />
                  <p className="py-3" style={{
                    textAlign: "justify"
                  }}>{formData.Deskripsi}</p>
                </div>
                <div className="col-lg-5">
                  {/* <p>3 orang baru saja bergabung!</p> */}
                  {listAnggota
                    ?.filter((value) => {
                      return value.Status === "Aktif";
                    })
                    .map((pr) => (
                      <div className="card-profile mb-2 d-flex shadow-sm">
                        <div
                          className="bg-primary"
                          style={{ width: "1.5%" }}
                        ></div>
                        <div className="p-1 ps-2 d-flex">
                          <img
                            src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                            alt={pr["Nama Anggota"]}
                            className="img-fluid rounded-circle"
                            width="45"
                          />
                          <div className="ps-3">
                            <p className="mb-0">{pr["Nama Anggota"]}</p>
                            <p className="mb-0" style={{ fontSize: "13px" }}>
                              {pr.Prodi}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* <div className="text-end">
                <Button
                  classType="light btn-sm text-primary text-decoration-underline px-3 mt-2"
                  type="submit"
                  label="Lihat Semua"
                  data-bs-toggle="modal"
                  data-bs-target="#modalAnggota"
                />
              </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header bg-primary fw-medium text-white">
              Menunggu Persetujuan
            </div>
            <div className="card-body">
              <div className="row pt-2">
                <div className="col-lg-6">
                  <h6 className="mb-3 fw-semibold">
                    {
                      listAnggota?.filter((value) => {
                        return value.Status === "Menunggu Acc";
                      }).length
                    }{" "}
                    Tenaga Pendidik menunggu persetujuan untuk menjadi Anggota
                  </h6>
                  {listAnggota
                    ?.filter((value) => {
                      return value.Status === "Menunggu Acc";
                    })
                    .map((value) => (
                      <div key={value.Key}>
                        <h6 className="fw-semibold mb-3">{value.Text}</h6>
                        <div className="card-profile mb-3 d-flex justify-content-between shadow-sm">
                          <div className="d-flex w-100">
                            <div
                              className="bg-primary"
                              style={{ width: "1.5%" }}
                            ></div>
                            <div className="p-1 ps-2 d-flex">
                              <img
                                src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                                alt={value["Nama Anggota"]}
                                className="img-fluid rounded-circle"
                                width="45"
                              />
                              <div className="ps-3">
                                <p className="mb-0 fw-semibold">
                                  {value["Nama Anggota"]}
                                </p>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  {value.Prodi}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Button
                              classType="primary btn-sm px-3 mx-1"
                              iconName="list"
                              title="Lihat Detail Pengajuan"
                              onClick={() => handleDetailLampiran(value)}
                            />
                            <Button
                              classType="light btn-sm text-primary px-3 mx-1"
                              iconName="check"
                              title="Konfirmasi"
                              onClick={() => handleSetStatus(value, "Aktif")}
                            />
                            <Button
                              classType="light btn-sm text-danger px-3 mx-1"
                              iconName="x"
                              title="Tolak"
                              onClick={() => handleSetStatus(value, "Ditolak")}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="col-lg-6 border-start">
                  <h6 className="mb-3 fw-semibold">
                    Detail pengajuan dan lampiran pendukung
                  </h6>
                  <div className="px-3">
                    <div className="row">
                      <div className="col-6">
                        <Label
                          title="Nama"
                          data={karyawan?.["Nama Anggota"] || "-"}
                        />
                      </div>
                      <div className="col-6">
                        <Label
                          title="Program Studi"
                          data={karyawan?.["Prodi"] || "-"}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      {karyawan.Key ? (
                        detail?.map((item, index) => (
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
                                  {/* {listNamaFile[index].Lampiran} */}
                                  Lampiran {index + 1} {withID["Nama Kelompok Keahlian"]}
                                </a>
                              ) : (
                                "-"
                              )
                            }
                          />
                        ))
                      ) : (
                        <Label title="Lampiran Pendukung" data="-" />
                      )}
                    </div>
                    {karyawan?.Key && (
                      <div className="d-flex justify-content-between mt-5 mb-2">
                        <Button
                          classType="secondary btn-sm px-3 mx-1"
                          label="Batalkan"
                          onClick={handleBatalkan}
                        />
                        <div className="text-end">
                          <Button
                            classType="primary btn-sm px-3 mx-1"
                            iconName="check"
                            label="Konfirmasi"
                            onClick={() => handleSetStatus(karyawan, "Aktif")}
                          />
                          <Button
                            classType="danger btn-sm px-3 mx-1"
                            iconName="x"
                            label="Tolak"
                            onClick={() => handleSetStatus(karyawan, "Ditolak")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="float-end my-4 mx-1">
            <Button
              classType="secondary me-2 px-4 py-2"
              label="Kembali"
              onClick={() => onChangePage("index")}
            />
          </div>
        </div>
      )}

      {/* <div
        class="modal fade"
        id="modalAnggota"
        tabindex="-1"
        aria-labelledby="Anggota Kelompok Keahlian"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalAnggotaKK">
                Anggota Kelompok Keahlian
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="input-group mb-4">
                <Input
                  //   ref={searchQuery}
                  forInput="pencarianProduk"
                  placeholder="Cari"
                />
                <Button
                  iconName="search"
                  classType="primary px-4"
                  title="Cari"
                  //   onClick={handleSearch}
                />
                <Filter>
                  <DropDown
                    // ref={searchFilterSort}
                    forInput="ddUrut"
                    label="Urut Berdasarkan"
                    type="none"
                    // arrData={dataFilterSort}
                    defaultValue="[Kode Produk] asc"
                  />
                  <DropDown
                    // ref={searchFilterJenis}
                    forInput="ddJenis"
                    label="Jenis Produk"
                    type="semua"
                    // arrData={dataFilterJenis}
                    defaultValue=""
                  />
                  <DropDown
                    // ref={searchFilterStatus}
                    forInput="ddStatus"
                    label="Status"
                    type="none"
                    // arrData={dataFilterStatus}
                    defaultValue="Aktif"
                  />
                </Filter>
              </div>
              {formData.members?.map((pr, index) => (
                <div className="card-profile mb-3 d-flex shadow-sm">
                  <p className="mb-0 px-1 py-2 mt-2 me-2 fw-bold text-primary">
                    {index + 1}
                  </p>
                  <div className="bg-primary" style={{ width: "1.5%" }}></div>
                  <div className="p-1 ps-2 d-flex">
                    <img
                      src={pr.imgSource}
                      alt={pr.name}
                      className="img-fluid rounded-circle"
                      width="45"
                    />
                    <div className="ps-3">
                      <p className="mb-0">{pr.name}</p>
                      <p className="mb-0" style={{ fontSize: "13px" }}>
                        UPT Manajemen Informatika
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <Button
                classType="secondary btn-sm px-3 mt-2"
                type="submit"
                label="Kelola"
              />
            </div>
          </div>
        </div>
      </div> */}
    </>

        </main>
      </div>
    </>
  );
}
