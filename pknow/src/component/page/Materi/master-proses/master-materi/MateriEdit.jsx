import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { API_LINK } from "../../../util/Constants";
import { validateAllInputs, validateInput } from "../../../util/ValidateForm";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import Input from "../../../part/Input";
import FileUpload from "../../../part/FileUpload";
import Loading from "../../../part/Loading";
import Alert from "../../../part/Alert";
import uploadFile from "../../../util/UploadFile";
import AppContext_master from "../MasterContext";
import { Editor } from '@tinymce/tinymce-react';
import AppContext_test from "../../master-test/TestContext";
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Materi', 'Pretest', 'Sharing Expert', 'Forum', 'Post Test'];

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'materiAdd';
    case 1:
      return 'pretestAdd';
    case 2:
      return 'sharingAdd';
    case 3:
      return 'forumAdd';
    case 4:
      return 'posttestAdd';
    default:
      return 'Unknown stepIndex';
  }
}
export default function MasterCourseEdit({onChangePage}) {
  // console.log("ID: " + JSON.stringify(Materi));
  // console.log("onChangePage prop:", onChangePage);

  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listKategori, setListKategori] = useState([]);

  const fileInputRef = useRef(null);
  const gambarInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const kategori = AppContext_test.KategoriIdByKK;
  const Materi = AppContext_test.DetailMateriEdit;
  console.log('dsdssd', Materi.Key)
  // console.log('deyail mat',Materi)

  // console.log("kategori di materi: " + AppContext_test.KategoriIdByKK);
  const formDataRef = useRef({
    mat_id:Materi.Key,
    kat_id: AppContext_test.KategoriIdByKK, 
    mat_judul: Materi.Judul, 
    mat_file_pdf: Materi.File_pdf,
    mat_file_video: Materi.File_video,
    mat_pengenalan: Materi.Pengenalan,
    mat_keterangan: Materi.Keterangan,
    kry_id: AppContext_test.activeUser,
    mat_kata_kunci:Materi["Kata Kunci"],
    mat_gambar: "",
  });

  // console.log(formDataRef)

  // const formUpdateRef = useRef({
  //   mat_id:Materi.Key,
  //   kat_id:"",
  //   mat_judul: Materi.Judul, 
  //   mat_file_pdf: Materi.File_P,
  //   mat_file_video: Materi.File_video,
  //   mat_pengenalan: Materi.Pengenalan,
  //   mat_keterangan: Materi.Keterangan,
  //   kry_id: "1",
  //   mat_kata_kunci:Materi["Kata Kunci"],
  //   mat_gambar: "FILE_1717049166708.jpg",
  // });

  
  const userSchema = object({
    mat_id: string(),
    kat_id: string(),
    mat_judul: string().required('Judul materi harus diisi'),
    mat_file_pdf: string(),
    mat_file_video: string(),
    mat_pengenalan: string().required('Pengenalan materi harus diisi'),
    mat_keterangan: string().required('Keterangan materi harus diisi'),
    kry_id: string(),
    mat_kata_kunci: string().required('Kata kunci materi harus diisi'),
    mat_gambar: string(),
    createBy: string(),
  });

  console.log(userSchema);
  const handleInputChange = async (e) => {
    // console.log("DADA: " + formDataRef.current.kat_id + formDataRef.current.mat_kat);
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
        ...prevErrors,
        [validationError.name]: validationError.error,
    }));
};

  const handleFileChange = async (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop();
    const validationError = await validateInput(name, value, userSchema);
    let error = "";

    if (fileSize / 1024 / 1024 > 100) error = "berkas terlalu besar"; // Mengubah batas ukuran file menjadi 100MB
    else if (!extAllowed.split(",").includes(fileExt))
      error = "format berkas tidak valid";

    if (error) ref.current.value = "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: error,
    }));
};


useEffect(() => {
  const fetchDataKategori = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const data = await UseFetch(API_LINK + "Program/GetKategoriKKById", { kategori });
        const mappedData = data.map(item => ({
          value: item.Key,
          label: item["Nama Kategori"],
          idKK: item.idKK,
          namaKK: item.namaKK
        }));

        // console.log("Mapped data: ", mappedData);
        setListKategori(mappedData);
        return;
      } catch (error) {
        console.error("Error fetching kategori data:", error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListKategori([]);
        }
      }
    }
  };

  setIsError((prevError) => ({ ...prevError, error: false }));
  fetchDataKategori();
}, [kategori]);



  const handleAdd = async (e) => {
    e.preventDefault();
    // Validasi data form
    const validationErrors = await validateAllInputs(formDataRef.current, userSchema, setErrors);
    console.log('ds', formDataRef.current)
    console.log('dssss', userSchema)
    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});
      // Promise upload file
      const uploadPromises = [];
      if (fileInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(fileInputRef.current).then((data) => {
            formDataRef.current.mat_file_pdf = data.newFileName;
          })
        );
      }
      if (gambarInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(gambarInputRef.current).then((data) => {
            formDataRef.current.mat_gambar = data.newFileName;
          })
        );
      }
      if (videoInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(videoInputRef.current).then((data) => {
            formDataRef.current.mat_file_video = data.newFileName;
          })
        );
      }
      Promise.all(uploadPromises).then(() => {
      console.log('dada')
        UseFetch(API_LINK + "Materis/EditDataMateri", formDataRef.current)
          .then((data) => {
            if (data === "ERROR") {
              setIsError({ error: true, message: "Terjadi kesalahan: Gagal mengedit data Materi." });
            } else {
              
              SweetAlert("Sukses", "Data Materi berhasil diedit", "success");
              onChangePage("index",AppContext_test.kategoriId);
            }
          })
          .catch((error) => {
            setIsError({ error: true, message: `Terjadi kesalahan: ${error.message}` });
          })
          .finally(() => setIsLoading(false));
      });
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form onSubmit={handleAdd}>
        <div>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => onChangePage(getStepContent(index))}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-outline-primary fw-medium text-white">
          Edit Materi 
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
              <Input
                type="text"
                forInput="namaKK"
                label="Kelompok Keahlian"
                value={listKategori.find((item) => item.value === formDataRef.current.kat_id)?.namaKK || ""}
                disabled
                errorMessage={errors.namaKK}
              />
              </div>
              <div className="col-lg-6">
              <Input
                  type="text"
                  forInput="kat_id"
                  label="Kategori Program"
                  value={listKategori.find((item) => item.value === formDataRef.current.kat_id)?.label || ""}
                  disabled
                  errorMessage={errors.kat_id}
                  
                />
                
              </div>
              <div className="col-lg-6">
              <Input
                  type="text"
                  forInput="mat_judul"
                  label="Judul Materi"
                  placeholder="Judul Materi"
                  value={formDataRef.current.mat_judul}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_judul}
                  isRequired
                />
              </div>
              <div className="col-lg-6">
              <Input
                  type="text"
                  forInput="mat_kata_kunci"
                  label="Kata Kunci Materi"
                  placeholder="Kata Kunci Materi"
                  value={formDataRef.current.mat_kata_kunci}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_kata_kunci}
                  isRequired
                />
              </div>
              <div className="col-lg-16">
                {/* <div className="form-group">
                  <label htmlFor="deskripsiMateri" className="form-label fw-bold">
                  Deskripsi Materi <span style={{color:"Red"}}> *</span>
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="mat_keterangan"
                    name="mat_keterangan"
                    forInput="mat_keterangan"
                    value={formDataRef.current.mat_keterangan}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.deskripsiMateri && (
                    <div className="invalid-feedback">{errors.deskripsiMateri}</div>
                  )}
                </div> */}
                <Input
                  type="textarea"
                  forInput="mat_keterangan"
                  label="Keterangan Materi"
                  isRequired
                  value={formDataRef.current.mat_keterangan}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_keterangan}
                />
              </div>
              <div className="col-lg-16">
                <div className="form-group">
                  <label htmlFor="deskripsiMateri" className="form-label fw-bold">
                    Pengenalan Materi <span style={{ color: 'Red' }}> *</span>
                  </label>
                  <Editor
                    id="mat_pengenalan"
                    value={formDataRef.current.mat_pengenalan}
                    onEditorChange={(content) => handleInputChange({ target: { name: 'mat_pengenalan', value: content } })}
                    apiKey='ci4fa00c13rk9erot37prff8jjekb93mdcwji9rtr2envzvi'
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                    }}
                  />
                  {errors.mat_pengenalan && (
                    <div className="invalid-feedback">{errors.mat_pengenalan}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={gambarInputRef}
                  forInput="mat_gambar"
                  label="Gambar Cover (.jpg, .png)"
                  formatFile=".jpg,.png"
                  onChange={() =>
                    handleFileChange(gambarInputRef, "jpg,png")
                  }
                  errorMessage={errors.mat_gambar}
                  isRequired
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={fileInputRef}
                  forInput="mat_file_pdf"
                  label="File Materi (.pdf)"
                  formatFile=".pdf"
                  onChange={() =>
                    handleFileChange(fileInputRef, "pdf")
                  }
                  errorMessage={errors.mat_file_pdf}
                  isRequired
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={videoInputRef}
                  forInput="mat_file_video"
                  label="File Materi (.mp4, .mov)"
                  formatFile=".mp4,.mov"
                  onChange={() =>
                    handleFileChange(videoInputRef, "mp4,mov")
                  }
                  errorMessage={errors.mat_file_video}
                  isRequired
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("pretestEdit")}
          />
        </div>
      </form>
    </>
  );
}
