import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../../util/Constants";
import { validateAllInputs, validateInput } from "../../../util/ValidateForm";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import Loading from "../../../part/Loading";
import Select2Dropdown from "../../../part/Select2Dropdown";
import Input from "../../../part/Input";
import Alert from "../../../part/Alert";
import FileUpload from "../../../part/FileUpload";
import UploadFile from "../../../util/UploadFile";

export default function TambahKK({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProdi, setListProdi] = useState([]);
  const [listKaryawan, setListKaryawan] = useState([]);

  const fileGambarRef = useRef(null);

  const formDataRef = useRef({
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    gambar: "",
  });

  const userSchema = object({
    nama: string().max(100, "maksimum 100 karakter").required("harus diisi"),
    programStudi: string().required("harus dipilih"),
    personInCharge: string(),
    deskripsi: string(),
    gambar: string(),
  });

  const handleFileChange = (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop().toLowerCase();
    const validationError = validateInput(name, value, userSchema);
    let error = "";

    if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
    else if (!extAllowed.split(",").includes(fileExt))
      error = "format berkas tidak valid";

    if (error) ref.current.value = "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: error,
    }));
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    try {
      if (name === "personInCharge" && value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        await userSchema.validateAt(name, { [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }

    formDataRef.current[name] = value;
  };

  const getListProdi = async () => {
    setIsLoading(true);

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "KK/GetListProdi", {});
        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListProdi(data);
          setIsLoading(false);
          break;
        }
      }
    } catch (e) {
      setIsLoading(true);
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  const getListKaryawan = async () => {
    setIsLoading(true);
    try {
      let data = await UseFetch(API_LINK + "KK/GetListKaryawan", {
        idProdi: formDataRef.current.programStudi,
      });

      console.log("karyawan", data);
      if (data === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil daftar karyawan.");
      } else {
        setListKaryawan(data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(true);
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  useEffect(() => {
    getListProdi();
  }, []);

  useEffect(() => {
    getListKaryawan();
  }, [formDataRef.current.programStudi]);

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => {
        return { ...prevError, error: false };
      });
      setErrors({});

      const uploadPromises = [];

      if (fileGambarRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileGambarRef.current).then(
            (data) => (formDataRef.current["gambar"] = data.Hasil)
          )
        );
      }

      const dataToSend = { ...formDataRef.current };
      if (!dataToSend.personInCharge) {
        dataToSend.personInCharge = "";
      }

      try {
        await Promise.all(uploadPromises);
        UseFetch(API_LINK + "KK/CreateKK", dataToSend)
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data program.",
                };
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data kelompok keahlian berhasil disimpan",
                "success"
              );
              onChangePage("index");
            }
          })
          .then(() => setIsLoading(false));
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    } else window.scrollTo(0, 0);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="" style={{ margin: "10px 20px" }}>
          <form onSubmit={handleAdd} style={{ marginTop: "100px" }}>
            <div className="card">
              <div className="card-header bg-primary fw-medium text-white">
                Tambah Kelompok Keahlian{" "}
                <span className="badge text-bg-dark">Draft</span>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-4">
                    <FileUpload
                      forInput="gambarAlatMesin"
                      label="Gambar Kelompok Keahlian (.png)"
                      formatFile=".png"
                      ref={fileGambarRef}
                      onChange={() =>
                        handleFileChange(fileGambarRef, "png")
                      }
                      errorMessage={errors.gambar}
                      isRequired={true}
                    />
                  </div>
                  <div className="col-lg-12">
                    <Input
                      type="text"
                      forInput="nama"
                      label="Nama Kelompok Keahlian"
                      isRequired
                      placeholder="Nama Kelompok Keahlian"
                      value={formDataRef.current.nama}
                      onChange={handleInputChange}
                      errorMessage={errors.nama}
                    />
                  </div>
                  <div className="col-lg-12">
                    <label style={{ paddingBottom: "5px", fontWeight: "bold" }}>
                      Deskripsi/Ringkasan Mengenai Kelompok Keahlian{" "}
                      <span style={{ color: "red" }}> *</span>
                    </label>
                    <textarea
                      className="form-control mb-3"
                      style={{
                        height: "200px",
                      }}
                      id="deskripsi"
                      name="deskripsi"
                      forInput="deskripsi"
                      value={formDataRef.current.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Deskripsi/Ringkasan Mengenai Kelompok Keahlian"
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <Select2Dropdown
                      forInput="programStudi"
                      label="Program Studi"
                      arrData={listProdi}
                      isRequired
                      value={formDataRef.current.programStudi}
                      onChange={handleInputChange}
                      errorMessage={errors.programStudi}
                    />
                  </div>
                  <div className="col-lg-6">
                    <Select2Dropdown
                      forInput="personInCharge"
                      label="PIC Kelompok Keahlian"
                      arrData={listKaryawan}
                      value={formDataRef.current.personInCharge}
                      onChange={handleInputChange}
                      errorMessage={errors.personInCharge}
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={() => onChangePage("index")}
                >
                  Kembali
                </button>
                <button className="btn btn-primary btn-sm" type="submit">
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
