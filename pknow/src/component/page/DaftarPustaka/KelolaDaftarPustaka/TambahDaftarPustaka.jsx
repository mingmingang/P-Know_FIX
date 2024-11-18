import Header from "../../../backbone/Header";
import Footer from "../../../backbone/Footer";
import Form from "../../../part/Form";

export default function TambahDaftarPustaka({onChangePage}) {

  const title = "Tambah Daftar Pustaka";

  const backPage = "/daftar-pustaka";

  const fields = [
    [
      {
        name: "image",
        label: "Gambar",
        accept: "image",
        type: "file",
        required: true,
        width: "48%",
      },
      {
        name: "image",
        label: "File  Pustaka (.pdf, .docx, .xlsx, .pptx, .mp4)",
        accept: ".pdf, .docx, .xlsx, .pptx, .mp4",
        type: "document",
        required: true,
        width: "48%",
      },
    ],
    [
      {
        name: "name",
        label: "Judul",
        type: "text",
        placeholder: "Masukan Judul",
        required: true,
        width: "100%",
        height: "40px",
      },
    ],
    [
      {
        name: "description",
        label: "Sinopsis / Ringkasan Pustaka",
        type: "textarea",
        placeholder: "Masukan sinopsis atau ringkasan",
        required: true,
        width: "100%",
        height: "100px",
      },
    ],
    [
      {
        name: "prodi",
        label: "Kelompok Keahlian",
        type: "select",
        required: true,
        options: [
          { value: "", label: "Pilih Kelompok Keahlian", disabled: false },
          {
            value: "Pembuatan Peralatan dan Perkakas Produksi",
            label: "Pembuatan Peralatan dan Perkakas Produksi",
          },
          {
            value: "Teknik Produksi dan Proses Manufaktur",
            label: "Teknik Produksi dan Proses Manufaktur",
          },
          { value: "Manajemen Informatika", label: "Manajemen Informatika" },
          { value: "Mesin Otomotif", label: "Mesin Otomotif" },
          { value: "Mekatronika", label: "Mekatronika" },
          {
            value: "Teknologi Konstruksi Bangunan Gedung",
            label: "Teknologi Konstruksi Bangunan Gedung",
          },
          {
            value: "Teknologi Rekayasa Pemeliharaan Alat Berat",
            label: "Teknologi Rekayasa Pemeliharaan Alat Berat",
          },
          {
            value: "Teknologi Rekayasa Logistik",
            label: "Teknologi Rekayasa Logistik",
          },
          {
            value: "Teknologi Rekayasa Perangkat Lunak",
            label: "Teknologi Rekayasa Perangkat Lunak",
          },
        ],
        width: "48%",
        marginRight: "10px",
      },
      {
        name: "name",
        label: "Kata Kunci",
        type: "text",
        placeholder: "Masukan Kata Kunci",
        required: true,
        width: "48%",
        height: "40px",
      },
    ],
  ];

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="">
        <main>
          <Form
            title={title}
            fields={fields}
            backPage={backPage}
            onSubmit={handleFormSubmit}
            konfirmasi="Konfirmasi"
            pesanKonfirmasi="Apakah Anda yakin ingin menyimpan data ini?"
            onChangePage={onChangePage}
            pesanKembali="Apakah anda ingin kembali?"
          />
        </main>
      </div>
    </>
  );
}
