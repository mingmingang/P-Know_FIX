import Search from "../../../part/Search";
import Table from "../../../part/TableRiwayat";

export default function RiwayatPengajuan() {
    // Table headers and data
    const tableHead = ["No.", "Tanggal Pengajuan", "Kelompok Keahlian", "Lampiran", "Status Pengajuan", "Aksi"];
    const tableData = [
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
      ["12 November 2024", "Teknologi Informasi", { url: "file1.pdf", name: "Lampiran" }, "Diterima", "Aksi"],
      ["13 November 2024", "Sistem Informasi", { url: "file2.xlsx", name: "Lampiran" }, "Ditolak", "Aksi"],
    ];
    

    return (
        <div className="app-container">
            {/* Render Header */}
            <main>
                <Search
                    title="Riwayat Pengajuan"
                    description="Riwayat Pengajuan akan menampilkan pengajuan anggota keahlia yang anda ajukan, hanya terdapat satu kelompok keahlian yang pengajuannya akan diterima oleh Program Studi."
                    placeholder="Cari Riwayat Pengajuan"
                />
                <Table tableHead={tableHead} tableData={tableData} />
            </main>

            {/* Render Footer */}
        </div>
    );
}
