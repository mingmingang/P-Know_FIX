import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../../../util/Constants";
import {
  validateAllInputs,
  validateInput,
} from "../../../../util/ValidateForm";
import SweetAlert from "../../../../util/SweetAlert";
import UseFetch from "../../../../util/UseFetch";
import Button from "../../../../part/Button copy";
import FileUpload from "../../../../part/FileUpload";
import Loading from "../../../../part/Loading";
import Alert from "../../../../part/Alert";
import AppContext_test from "../MasterContext";
import uploadFile from "../../../../util/UploadFile";
import AppContext_master from "../MasterContext";
import axios from "axios";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import Konfirmasi from "../../../../part/Konfirmasi";
import BackPage from "../../../../../assets/backPage.png";
import CustomStepper from "../../../../part/Stepp";

const steps = ["Sharing Expert", "Pretest", "Post Test"];

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "sharingAdd";
    case 1:
      return "pretestAdd";
    case 2:
      return "posttestAdd";
    default:
      return "Unknown stepIndex";
  }
}

export default function MasterSharingAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [resetStepper, setResetStepper] = useState(0);
  const [isBackAction, setIsBackAction] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef(null);
  const vidioInputRef = useRef(null);
  const [isSectionAction, setIsSectionAction] = useState(false);
  const [showConfirmationSection, setShowConfirmationSection] = useState(false);

  const [dataSection, setDataSection] = useState({
    materiId: AppContext_master.dataIDMateri,
    secJudul: "Section Materi " + AppContext_master.dataIDMateri,
    createdby: AppContext_master?.dataSection?.createdby || "",
    secType: "",
  });

  useEffect(() => {
    if (AppContext_master?.dataSection) {
      setDataSection({
        materiId: AppContext_master?.dataIDMateri || "",
        secJudul: "Section Materi " + (AppContext_master?.dataIDMateri || ""),
        createdby: AppContext_master?.dataSection?.createdby || "",
        secType: "Pre-Test",
      });
    }
  }, [AppContext_master?.dataSection]);

  const storedSteps = sessionStorage.getItem("steps");
  const steps = storedSteps ? JSON.parse(storedSteps) : initialSteps;

  // console.log("langkah sharing", steps);

  const sharingExpertIndex = steps.findIndex(
    (step) => step === "Sharing Expert"
  );

  const handleSection = () => {
    setIsSectionAction(true);
    setShowConfirmationSection(true);
  };

  const handleConfirmYesSection = () => {
    setShowConfirmationSection(false);
  };

  const handleConfirmNoSection = () => {
    setShowConfirmationSection(false);
    window.location.reload();
  };

  useEffect(() => {
    formDataRef.current.sec_id = AppContext_master.dataIdSection;
    formDataRef.current.mat_id = AppContext_test.dataIDMateri;
  }, [AppContext_master.dataIdSection, AppContext_test.dataIDMateri]);

  const formDataRef = useRef({
    sec_id: AppContext_master.dataIdSection,
    mat_id: AppContext_test.dataIDMateri,
    mat_sharing_expert_pdf: "",
    mat_sharing_expert_video: "",
    dataSection: "",
    secType: "Sharing Expert",
  });

  const handleGoBack = () => {
    console.log(AppContext_master.dataIdSection);
    setIsBackAction(true);
    setShowConfirmation(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false);
    window.location.reload();
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
  };

  const userSchema = object({
    sec_id: string(),
    mat_id: string().required("ID Materi tidak boleh kosong"),
    mat_sharing_expert_pdf: string(),
    mat_sharing_expert_video: string(),
    dataSection: string(),
    secType: string(),
  });

  const previewFile = async (namaFile) => {
    try {
      namaFile = namaFile.trim();
      console.log(namaFile);
      const response = await axios.get(
        `${API_LINK}Upload/GetFile/${namaFile}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handlePdfChange = () => handleFileChange(fileInputRef, "pdf,docx,xlsx,pptx", 10);
  const handleVideoChange = () =>
    handleFileChange(vidioInputRef, "mp4,mov", 250);
  const handleFileChange = async (ref, extAllowed, maxFileSize) => {
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop();
    let error = "";

    if (fileSize / 1024 / 1024 > maxFileSize) {
      error = `Berkas terlalu besar, maksimal ${maxFileSize}MB`;
      SweetAlert("Error", error, "error");
    } else if (!extAllowed.split(",").includes(fileExt)) {
      error = "Format berkas tidak valid";
      SweetAlert("Error", error, "error");
    }

    if (error) ref.current.value = "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [ref.current.name]: error,
    }));
  };


  const handleAdd = async (e) => {
    e.preventDefault();
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    const isPdfEmpty = !fileInputRef.current.files.length;
    const isVideoEmpty = !vidioInputRef.current.files.length;

    if (isPdfEmpty && isVideoEmpty) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mat_sharing_expert_pdf: "Pilih salah satu antara PDF atau Video",
        mat_sharing_expert_video: "Pilih salah satu antara PDF atau Video",
      }));
      return;
    }

    if (
      Object.values(validationErrors).every((error) => !error) &&
      (!isPdfEmpty || !isVideoEmpty)
    ) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});

      const uploadPromises = [];

      if (fileInputRef.current && fileInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(fileInputRef.current).then((data) => {
            formDataRef.current.mat_sharing_expert_pdf = data.Hasil;
            AppContext_test.sharingExpertPDF = data.Hasil;
          })
        );
      }

      if (vidioInputRef.current && vidioInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(vidioInputRef.current).then((data) => {
            formDataRef.current.mat_sharing_expert_video = data.Hasil;
            AppContext_test.sharingExpertVideo = data.Hasil;
          })
        );
      }

      Promise.all(uploadPromises).then(() => {
        UseFetch(
          API_LINK + "SharingExpert/SaveDataSharing",
          formDataRef.current
        )
          .then((data) => {
            console.log("id section", AppContext_master.dataIdSection);
            console.log("kirim sharing", formDataRef.current);
            console.log("step count",stepCount.length);
            if (data === "ERROR") {
              setIsError({
                error: true,
                message: "Terjadi kesalahan: Gagal menyimpan data Sharing.",
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data Sharing Expert berhasil disimpan",
                "success"
              );
              // onChangePage("index", kategori);
              if (steps.length == 4) {
                window.location.reload();
              } else {
                if (sharingExpertIndex == 3 && steps.length > 4) {
                    try {
                      axios
                        .post(API_LINK + "Section/CreateSection", dataSection)
                        .then((response) => {
                          const data = response.data;
                          console.log("data section", dataSection);
                          if (data[0].hasil === "OK") {
                            AppContext_master.dataIdSection = data[0].newID;
                            console.log(
                              "id section",
                              AppContext_master.dataIdSection
                            );
                            SweetAlert(
                              "Sukses",
                              "Data Section berhasil ditambahkan",
                              "success"
                            );
                            // setIsFormDisabled(true);
                            AppContext_master.formSavedMateri = true;
                            SweetAlert(
                              "Sukses",
                              "Data section berhasil disimpan",
                              "success"
                            );
                            onChangePage(
                              steps[4],
                              (AppContext_master.MateriForm = formDataRef),
                              (AppContext_master.count += 1),
                              AppContext_master.dataIdSection
                            );
                          } else {
                            setIsError((prevError) => ({
                              ...prevError,
                              error: true,
                              message:
                                "Terjadi kesalahan: Gagal menyimpan data Materi.",
                            }));
                          }
                        })
                        .catch((error) => {
                          console.error("Terjadi kesalahan:", error);
                          setIsError((prevError) => ({
                            ...prevError,
                            error: true,
                            message: "Terjadi kesalahan: " + error.message,
                          }));
                        })
                        .finally(() => setIsLoading(false));
                    } catch (error) {
                      setIsError({
                        error: true,
                        message: "Failed to save forum data: " + error.message,
                      });
                      setIsLoading(false);
                    }
                } else if (sharingExpertIndex == 4 && steps.length > 5) {
                  try {
                    axios
                      .post(API_LINK + "Section/CreateSection", dataSection)
                      .then((response) => {
                        const data = response.data;
                        console.log("data section", dataSection);
                        if (data[0].hasil === "OK") {
                          AppContext_master.dataIdSection = data[0].newID;
                          console.log(
                            "id section",
                            AppContext_master.dataIdSection
                          );
                          SweetAlert(
                            "Sukses",
                            "Data Section berhasil ditambahkan",
                            "success"
                          );
                          // setIsFormDisabled(true);
                          AppContext_master.formSavedMateri = true;
                          SweetAlert(
                            "Sukses",
                            "Data section berhasil disimpan",
                            "success"
                          );
                          onChangePage(
                            steps[5],
                            (AppContext_master.MateriForm = formDataRef),
                            (AppContext_master.count += 1),
                            AppContext_master.dataIdSection
                          );
                        } else {
                          setIsError((prevError) => ({
                            ...prevError,
                            error: true,
                            message:
                              "Terjadi kesalahan: Gagal menyimpan data Materi.",
                          }));
                        }
                      })
                      .catch((error) => {
                        console.error("Terjadi kesalahan:", error);
                        setIsError((prevError) => ({
                          ...prevError,
                          error: true,
                          message: "Terjadi kesalahan: " + error.message,
                        }));
                      })
                      .finally(() => setIsLoading(false));
                  } catch (error) {
                    setIsError({
                      error: true,
                      message: "Failed to save forum data: " + error.message,
                    });
                    setIsLoading(false);
                  }
                } else if (sharingExpertIndex == 5) {
                  window.location.reload();
                } else {
                  window.location.reload();
                }
              }
            }
            //handleSection();
          })
          .catch((err) => {
            setIsError({
              error: true,
              message: "Terjadi kesalahan: " + err.message,
            });
          })
          .finally(() => setIsLoading(false));
      });
    }
  };

  const [activeStep, setActiveStep] = useState(2);

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

  const initialSteps = ["Pengenalan", "Materi", "Forum"];
  const additionalSteps = ["Sharing Expert", "Pre-Test", "Post-Test"];

  const handleStepChanges = (index) => {
    console.log("Step aktif:", index);
  };

  const handleStepAdded = (stepName) => {
    console.log("Step ditambahkan:", stepName);
  };

  const handleStepRemoved = (stepName) => {
    console.log("Step dihapus:", stepName);
  };

  const handleStepChange = (stepContent) => {
    onChangePage(stepContent);
  };

  const [stepCount, setStepCount] = useState(0);

  const handleStepCountChange = (count) => {
    setStepCount(count);
    //console.log("step",count);
  };

  const [stepPage, setStepPage] = useState([]);
  const handleAllStepContents = (allSteps) => {
    setStepPage(allSteps);
    //console.log("Semua Step Contents:", allSteps);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "100px",
          marginLeft: "70px",
          marginRight: "70px",
        }}
      >
        <div className="back-and-title" style={{ display: "flex" }}>
          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={handleGoBack}
          >
            <img src={BackPage} alt="" />
          </button>
          <h4
            style={{
              color: "#0A5EA8",
              fontWeight: "bold",
              fontSize: "30px",
              marginTop: "10px",
              marginLeft: "20px",
            }}
          >
            Tambah Sharing Expert
          </h4>
        </div>
        <div className="ket-draft">
          <span className="badge text-bg-dark " style={{ fontSize: "16px" }}>
            Draft
          </span>
        </div>
      </div>
      <form onSubmit={handleAdd}>
        <div style={{ margin: "20px 100px" }}>
          <CustomStepper
            initialSteps={initialSteps}
            additionalSteps={additionalSteps}
            onChangeStep={sharingExpertIndex}
            onStepAdded={handleStepAdded}
            onStepRemoved={handleStepRemoved}
            onChangePage={handleStepChange}
            onStepCountChanged={handleStepCountChange}
            onAllStepContents={handleAllStepContents}
          />
        </div>
        <div className="card mt-4" style={{ margin: "100px" }}>
          <div className="card-body p-4">
            <div className="row">
              <div className="">
                <FileUpload
                  ref={fileInputRef}
                  forInput="mat_sharing_expert_pdf"
                  label="File Sharing Expert (.pdf,.docx,.xlsx,.pptx,.mp4)"
                  formatFile=".pdf,.docx,.xlsx,.pptx,.mp4"
                  onChange={() => handlePdfChange(fileInputRef, "pdf,docx,xlsx,pptx")}
                  errorMessage={errors.mat_sharing_expert_pdf}
                  style={{ width: "195%" }}
                />
                {AppContext_test.sharingExpertPDF && (
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      previewFile(AppContext_test.sharingExpertPDF);
                    }}
                  >
                    Lihat berkas yang telah diunggah
                  </a>
                )}
              </div>
              <div className="">
                <FileUpload
                  ref={vidioInputRef}
                  forInput="mat_sharing_expert_video"
                  label="Video Sharing Expert (.mp4, .mov)"
                  formatFile=".mp4,.mov"
                  maxFileSize={250}
                  onChange={() => handleVideoChange(vidioInputRef, "mp4,mov")}
                  errorMessage={errors.mat_sharing_expert_video}
                  style={{ width: "195%" }}
                />
                {AppContext_test.sharingExpertVideo && (
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      previewFile(AppContext_test.sharingExpertVideo);
                    }}
                  >
                    Lihat berkas yang telah diunggah
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between my-4 mx-1 mt-0">
            <div className="ml-4">
              {/* <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Sebelumnya"
            onClick={() => onChangePage("materiAdd", AppContext_test.ForumForm = formData)}
          /> */}
            </div>
            <div className="d-flex mr-4">
              <Button
                classType="primary ms-2 px-4 py-2"
                type="submit"
                label="Simpan"
                style={{ marginRight: "10px" }}
              />
              {/* <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("pretestAdd", AppContext_test.MateriForm = formDataRef)}
          /> */}
            </div>
          </div>
        </div>
      </form>
      {showConfirmation && (
        <Konfirmasi
          title={isBackAction ? "Konfirmasi Kembali" : "Konfirmasi Simpan"}
          pesan={
            isBackAction
              ? "Apakah anda ingin kembali?"
              : "Anda yakin ingin simpan data?"
          }
          onYes={handleConfirmYes}
          onNo={handleConfirmNo}
        />
      )}
    </>
  );
}
