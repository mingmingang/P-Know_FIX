import Search from "../../../part/Search";
import PersetujuanKK from "../../../part/PersetujuanKK";

export default function DetailPersetujuan({onChangePage}) {

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
          <PersetujuanKK onChangePage={onChangePage} ></PersetujuanKK>
        </main>
      </div>
    </>
  );
}
