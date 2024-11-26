import Search from "../../../part/Search";
import TableRiwayat from "../../../part/TableRiwayat";
import React from "react";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button copy";
import Input from "../../../part/Input";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import Alert from "../../../part/Alert";
import Loading from "../../../part/Loading";
import Icon from "../../../part/Icon";
import CardKK from "../../../part/CardKelompokKeahlian";
import { ListKelompokKeahlian } from "../../../util/Dummy";
import { API_LINK } from "../../../util/Constants";
import Cookies from "js-cookie";
import { decryptId } from "../../../util/Encryptor";
import Label from "../../../part/Label";
import CardPengajuanBaru from "../../../part/CardPengajuanBaru";
import { faL } from "@fortawesome/free-solid-svg-icons";

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

  

export default function RiwayatPengajuan({onChangePage}) {
    let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataAktif, setDataAktif] = useState(false);
  const [listKK, setListKK] = useState(inisialisasiKK);
  const [detail, setDetail] = useState(inisialisasiData);

  const [userData, setUserData] = useState({
    Role: "",
    Nama: "",
    kry_id: "",
  });

  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Tanggal] DESC",
    kry_id: "",
  });

  const getUserKryID = async () => {
    setIsLoading(true);
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
          setIsLoading(false);
          break;
        }
      }
    } catch (error) {
      setIsLoading(true);
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

  const getRiwayat = async () => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    setIsLoading(true);

    if (currentFilter.kry_id === "") return;

    try {
      while (true) {
        let data = await UseFetch(
          API_LINK + "PengajuanKK/GetRiwayat",
          currentFilter
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else if (data === "data kosong") {
          setListKK([]);
          setIsLoading(false);
          break;
        } else {
          setListKK(data);
          setIsLoading(false);
          break;
        }
      }
    } catch (error) {
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
      setListKK([]);
    }
  };

  useEffect(() => {
    getRiwayat();
  }, [currentFilter]);

    return (
        <div className="app-container">
            {/* Render Header */}
            <main>
                <Search
                    title="Riwayat Pengajuan"
                    description="Riwayat Pengajuan akan menampilkan pengajuan anggota keahlia yang anda ajukan, hanya terdapat satu kelompok keahlian yang pengajuannya akan diterima oleh Program Studi."
                    placeholder="Cari Riwayat Pengajuan"
                />
                 <>
      <div className="d-flex flex-column">
        <div className="flex-fill">
          <div className="input-group">
            <Input
              // ref={searchQuery}
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
          <div className="container">
            <div className="row mt-3 gx-4">
              {listKK[0]?.Message ? (
                <Alert type="warning" message="Tidak ada riwayat.." />
              ) : (
                listKK?.map((value) => (
                  <CardPengajuanBaru
                    key={value.Key}
                    data={value}
                    onChangePage={onChangePage}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>

            </main>

            {/* Render Footer */}
        </div>
    );
}
