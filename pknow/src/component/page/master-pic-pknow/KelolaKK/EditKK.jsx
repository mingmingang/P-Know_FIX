import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../../util/Constants";
import { validateInput } from "../../../util/ValidateForm";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button copy";
import DropDown from "../../../part/Dropdown";
import Select2Dropdown from "../../../part/Select2Dropdown";
import Input from "../../../part/Input";
import Loading from "../../../part/Loading";
import Alert from "../../../part/Alert";
import SweetAlert from "../../../util/SweetAlert";
import Konfirmasi from "../../../part/Konfirmasi";
import BackPage from "../../../../assets/backPage.png";


export default function KKEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoadingProdi, setIsLoadingProdi] = useState(true);
  const [isLoadingKaryawan, setIsLoadingKaryawan] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [listProdi, setListProdi] = useState([]);
  const [listKaryawan, setListKaryawan] = useState([]);
  const [isBackAction, setIsBackAction] = useState(false);  

  const handleGoBack = () => {
    setIsBackAction(true);  
    setShowConfirmation(true);  
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false); 
    onChangePage("index");
  };


  const handleConfirmNo = () => {
    setShowConfirmation(false);  
  };

  const formDataRef = useRef({
    key: "",
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    status: "",
  });

  const userSchema = object({
    key: string(),
    nama: string().max(25, "maksimum 25 karakter").required("harus diisi"),
    programStudi: string().required("harus dipilih"),
    personInCharge: string(),
    deskripsi: string()
      .max(150, "maksimum 150 karakter")
      .required("harus diisi"),
    gambar: string(),
  });


  const [filePreview, setFilePreview] = useState(false); // state to store file preview

  const handleFileChange = (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file ? file.name : "";
    const fileSize = file ? file.size : 0;
    const fileExt = fileName.split(".").pop().toLowerCase();
    const validationError = validateInput(name, value, userSchema);
    let error = "";

    if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
    else if (!extAllowed.split(",").includes(fileExt))
      error = "format berkas tidak valid";

    if (error) ref.current.value = "";
    else {
      // Show preview if the file is an image
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result); // Set the preview
        };
        reader.readAsDataURL(file);
      }
    }

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
    if (name === "programStudi") {
      console.log(value);
      fetchDataKaryawan(value);
    }
  };

  const getListProdi = async () => {
    try {
      while (true) {
        let data = await UseFetch(API_LINK + "KK/GetListProdi", {});

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListProdi(data);
          break;
        }
      }
    } catch (e) {
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  const getListKaryawan = async () => {
    try {
      while (true) {
        let data = await UseFetch(API_LINK + "KK/GetListKaryawan", {
          idProdi: formDataRef.current.programStudi,
        });

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil daftar karyawan."
          );
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListKaryawan(data);
          if (withID.pic.key) {
            setListKaryawan((prevList) => [
              ...prevList,
              { Text: withID.pic.nama, Value: withID.pic.key },
            ]);
          }
          break;
        }
      }
    } catch (e) {
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  useEffect(() => {
    formDataRef.current = {
      key: withID.id,
      nama: withID.title,
      programStudi: withID.prodi.key,
      personInCharge: withID.pic.key ? withID.pic.key : "",
      deskripsi: withID.desc,
      status: withID.status,
    };
  }, []);

  useEffect(() => {
    getListProdi();
  }, []);

  useEffect(() => {
    if (formDataRef.current.programStudi) {
      getListKaryawan();
    }
  }, [formDataRef.current.programStudi]);


  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateInput(
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

      const dataToSend = { ...formDataRef.current };
      if (!dataToSend.personInCharge) {
        dataToSend.personInCharge = "";
      } else if (
        dataToSend.status === "Menunggu" &&
        dataToSend.personInCharge
      ) {
        dataToSend.status = "Aktif";
      }

      UseFetch(API_LINK + "KK/EditKK", dataToSend)
        .then((data) => {
          if (data === "ERROR") {
            setIsError((prevError) => {
              return {
                ...prevError,
                error: true,
                message:
                  "Terjadi kesalahan: Gagal mengubah data kelompok keahlian.",
              };
            });
          } else {
            SweetAlert(
              "Sukses",
              "Data kelompok keahlian berhasil diubah",
              "success"
            );
            onChangePage("index");
          }
        })
        .then(() => setIsLoading(false));
    }
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
        <>
        <div className="" style={{display:"flex", justifyContent:"space-between", marginTop:"100px", marginLeft:"70px", marginRight:"70px"}}>
        <div className="back-and-title" style={{display:"flex"}}>
          <button style={{backgroundColor:"transparent", border:"none"}} onClick={handleGoBack}><img src={BackPage} alt="" /></button>
            <h4 style={{ color:"#0A5EA8", fontWeight:"bold", fontSize:"30px", marginTop:"10px", marginLeft:"20px"}}>Edit Kelompok Keahlian</h4>
          </div>
          </div>
    <div className="" style={{ margin: "30px 70px" }}>
        <form onSubmit={handleAdd}>
          <div className="card">
            <div className="card-body p-4">
              <div className="row">
              <div className="col-lg-4" style={{ display: "flex" }}>
                    <div className="preview-img">
                      {filePreview ? (
                        <div
                          style={{
                            marginTop: "10px",
                            marginRight: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{
                              width: "200px",
                              height: "auto",
                              borderRadius: "20px",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            marginTop: "10px",
                            marginRight: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <img
                            src={NoImage} // Use fallback image if no preview available
                            alt="No Preview Available"
                            style={{
                              width: "200px",
                              height: "auto",
                              borderRadius: "20px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="file-upload">
                      <FileUpload
                        forInput="gambarAlatMesin"
                        label="Gambar Kelompok Keahlian (.png)"
                        formatFile=".png"
                        ref={fileGambarRef}
                        onChange={() => handleFileChange(fileGambarRef, "png")}
                        errorMessage={errors.gambar}
                        isRequired={true}
                      />
                    </div>
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
                    value={formDataRef.current.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Deskripsi"
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
                    value={formDataRef.current.personInCharge || ""}
                    onChange={handleInputChange}
                    errorMessage={errors.personInCharge}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="float-end my-4 mx-1">
            <Button
              classType="secondary me-2 px-4 py-2"
              label="Batal"
              onClick={() => onChangePage("index")}
            />
            <Button
              classType="primary ms-2 px-4 py-2"
              type="submit"
              label="Simpan"
            />
          </div>
        </form>
        </div>
        </>
      )}
    </>
  );
}
