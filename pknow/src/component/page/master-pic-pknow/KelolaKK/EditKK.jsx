import Header from "../../../backbone/Header";
import budi from "../../../../assets/fotobudi.png";
import Form from "../../../part/Form";
import Footer from "../../../backbone/Footer";

export default function EditKK() {
  const title = "Edit Kelompok Keahlian";

  const fields = [
    [
      {
        name: "image",
        label: "Gambar",
        type: "file",
        required: true,
        width: "100%",
      },
    ],
    [
      {
        name: "name",
        label: "Nama Kelompok Keahlian",
        type: "text",
        placeholder: "Masukan nama kelompok keahlian",
        required: true,
        width: "100%",
        height: "40px",
      },
    ],
    [
      {
        name: "description",
        label: "Deskripsi/Ringkasan Mengenai Kelompok Keahlian",
        type: "textarea",
        placeholder: "Masukan deskripsi kelompok keahlian",
        required: true,
        width: "100%",
        height: "100px",
      },
    ],
    [
      {
        name: "prodi",
        label: "Program Studi",
        type: "select",
        required: true,
        options: [
          { value: "", label: "Pilih Program Studi", disabled: true },
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
        name: "pickk",
        label: "PIC Kelompok Keahlian",
        type: "select",
        required: true,
        options: [
          { value: "", label: "Pilih PiC Kelompok Keahlian", disabled: true },
          { value: "Candra Bagus Kristanto", label: "Candra Bagus Kristanto" },
          { value: "Kristina Hutajulu", label: "Kristina Hutajulu" },
          {
            value: "Riesta Pinky Nurul Arifah",
            label: "Riesta Pinky Nurul Arifah",
          },
        ],
        width: "48%",
      },
    ],
  ];

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="">
        <Header
          showMenu={true}
          dropdownContent={dropdownContent}
          userProfile={userProfile}
          menuItems={["beranda", "knowledge-database", "i-learning"]}
        />
        <main>
          <Form title={title} fields={fields} onSubmit={handleFormSubmit} />
        </main>
        <Footer />
      </div>
    </>
  );
}