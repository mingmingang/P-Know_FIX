import { useState, useEffect } from "react";
import { object, string } from "yup";
import { validateAllInputs, validateInput } from "../../../../util/ValidateForm";
import SweetAlert from "../../../../util/SweetAlert";
import Button from "../../../../part/Button copy";
import Input from "../../../../part/Input";
import Loading from "../../../../part/Loading";
import Alert from "../../../../part/Alert";
import UseFetch from "../../../../util/UseFetch";
import { API_LINK } from "../../../../util/Constants";
import AppContext_master from "../MasterContext";
import AppContext_test from "../../master-test/TestContext";
import { Editor } from '@tinymce/tinymce-react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import BackPage from "../../../../../assets/backPage.png";

const steps = ["Pengenalan", "Materi", "Forum"];


function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'pengenalanAdd';
    case 1:
      return 'materiAdd';
    case 2:
      return 'forumAdd';
    // case 3:
    //   return 'forumAdd';
    // case 4:
    //   return 'posttestAdd';
    default:
      return 'Unknown stepIndex';
  }
}


function CustomStepper({ activeStep, steps, onChangePage, getStepContent }) {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step
            key={label}
            onClick={() => onChangePage(getStepContent(index))} // Tambahkan onClick di sini
            sx={{
              cursor: "pointer", // Menambahkan pointer untuk memberikan indikasi klik
              "& .MuiStepIcon-root": {
                fontSize: "2rem",
                color: index <= activeStep ? "primary.main" : "grey.300",
                "&.Mui-active": {
                  color: "primary.main",
                },
                "& .MuiStepIcon-text": {
                  fill: "#fff",
                  fontSize: "1rem",
                },
              },
            }}
          >
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  typography: "body1",
                  color: index <= activeStep ? "primary.main" : "grey.500",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}


const userSchema = object({
  forumJudul: string().max(100, "maksimum 100 karakter").required("harus diisi"),
  forumIsi: string().required("harus diisi"),
});

export default function MasterForumAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isBackAction, setIsBackAction] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSectionAction, setIsSectionAction] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationSection, setShowConfirmationSection] = useState(false);

  const [formData, setFormData] = useState({
    materiId: AppContext_master.dataIDMateri,
    karyawanId: AppContext_test.activeUser,
    forumJudul: AppContext_test.ForumForm?.forumJudul || "",
    forumIsi: AppContext_test.ForumForm?.forumIsi || "",
    forumStatus: "Aktif",
  });

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


  const handleSection = () => {
    setIsSectionAction(true);  
    setShowConfirmationSection(true);  
  };

  const handleConfirmYesSection = () => {
    setShowConfirmationSection(false); 
    onChangePage("sharingAdd", AppContext_master.MateriForm = formData);
  };


  const handleConfirmNoSection = () => {
    setShowConfirmationSection(false);  
    onChangePage("index");
  };



  const [resetStepper, setResetStepper] = useState(0);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const resetForm = () => {
    setFormData({
      materiId: AppContext_test.dataIDMateri,
      karyawanId: AppContext_test.activeUser,
      forumJudul: "",
      forumIsi: "",
      forumStatus: "Aktif",
    });
    setErrors({});
    setIsError({ error: false, message: "" });
  };
  useEffect(() => {
    setResetStepper((prev) => !prev + 1);
  });
  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(formData, userSchema, setErrors);
    const isEmptyData = Object.values(formData).some(value => value === "");

    if (isEmptyData) {
      setIsError({
        error: true,
        message: "Data tidak boleh kosong",
      });
      return;
    }

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});
    }

    try {
      console.log("Data yang dikirim ke backend:", formData);
      const response = await UseFetch(API_LINK + "Forum/SaveDataForum", formData);
      console.log("Hasil response", response);
      if (response === "ERROR") {
        setIsError({ error: true, message: "Terjadi kesalahan: Gagal menyimpan data Sharing." });
      } else {
        SweetAlert("Sukses", "Data Forum berhasil disimpan", "success");
        setIsFormDisabled(true);
        setResetStepper((prev) => !prev + 1);
        AppContext_test.formSavedForum = true;
        setResetStepper((prev) => !prev + 1);
        handleSection();
      }
    } catch (error) {
      setIsError({
        error: true,
        message: "Failed to save forum data: " + error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (AppContext_test.ForumForm && AppContext_test.ForumForm.current && Object.keys(AppContext_test.ForumForm.current).length > 0) {
      formData.current = { ...formData.current, ...AppContext_test.ForumForm.current };
    }

    if (AppContext_test.formSavedForum === false) {
      setIsFormDisabled(false);
    }
  }, [AppContext_test.ForumForm, AppContext_test.formSavedForum]);

  const [activeStep, setActiveStep] = useState(3);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePageChange = (content) => {
    onChangePage(content);
  };

  // if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
        <div className="" style={{display:"flex", justifyContent:"space-between", marginTop:"100px", marginLeft:"70px", marginRight:"70px"}}>
            <div className="back-and-title" style={{display:"flex"}}>
              <button style={{backgroundColor:"transparent", border:"none"}} onClick={handleGoBack}><img src={BackPage} alt="" /></button>
                <h4 style={{ color:"#0A5EA8", fontWeight:"bold", fontSize:"30px", marginTop:"10px", marginLeft:"20px"}}>Tambah Materi Baru</h4>
              </div>
                <div className="ket-draft">
                <span className="badge text-bg-dark " style={{fontSize:"16px"}}>Draft</span>
                </div>
              </div>
              
      <form onSubmit={handleAdd} style={{margin:"20px 100px"}}>
        <div className="mb-4">
        <CustomStepper
      activeStep={2}
      steps={steps}
      onChangePage={handlePageChange}
      getStepContent={getStepContent}
    />
          <div>
            {/* {activeStep === steps.length ? (
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
            )} */}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="forumJudul"
                  label="Judul Forum"
                  value={formData.forumJudul}
                  onChange={handleInputChange}
                  errorMessage={errors.forumJudul}
                  isRequired
                  disabled={isFormDisabled } 
                />
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="forumIsi" className="form-label fw-bold">
                    Isi Forum <span style={{ color: 'Red' }}> *</span>
                  </label>
                  <Editor
                    id="forumIsi"
                    value={formData.forumIsi}
                    onEditorChange={(content) => handleInputChange({ target: { name: 'forumIsi', value: content } })}
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
                    disabled={isFormDisabled} 
                  />
                  {errors.forumIsi && (
                    <div className="invalid-feedback">{errors.forumIsi}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between my-4 mx-1 mt-0">
          <div className="ml-4">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Sebelumnya"
            onClick={() => onChangePage("materiAdd", AppContext_test.ForumForm = formData)}
          />
          </div>
          <div className="d-flex mr-4" >
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
            style={{marginRight:"10px"}}
          />
          {/* <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("posttestAdd", AppContext_test.ForumForm = formData)}
          /> */}
          </div>
        </div>
        </div>
       
      </form>
      {showConfirmation && (
        <Konfirmasi
          title={isBackAction ? "Konfirmasi Kembali" : "Konfirmasi Simpan"}
          pesan={isBackAction ? "Apakah anda ingin kembali?" : "Anda yakin ingin simpan data?"}
          onYes={handleConfirmYes}
          onNo={handleConfirmNo}
        />
        )}
        {showConfirmationSection && (
        <Konfirmasi
          title={isSectionAction ? "Tambah Section" : "Tambah Section"}
          pesan={isSectionAction ? "Apakah anda ingin kembali?" : "Anda yakin ingin simpan data?"}
          onYes={handleConfirmYesSection}
          onNo={handleConfirmNoSection}
        />
        )}
    </>
  );
}
