import React, { useRef, useState, useEffect } from "react";
import Button from "../../../../part/Button copy";
import { object, string } from "yup";
import Input from "../../../../part/Input";
import Loading from "../../../../part/Loading";
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import SweetAlert from "../../../../util/SweetAlert";
import * as XLSX from 'xlsx';
import axios from 'axios';
import { validateAllInputs, validateInput } from "../../../../util/ValidateForm";
import { API_LINK } from "../../../../util/Constants";
import FileUpload from "../../../../part/FileUpload";
import uploadFile from "../../../../util/UploadImageQuiz";
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import AppContext_master from "../MasterContext";
import AppContext_test from "../../master-test/TestContext";
import Konfirmasi from "../../../../part/Konfirmasi";
import BackPage from "../../../../../assets/backPage.png";
import UploadFile from "../../../../util/UploadFile";

const steps = ['Sharing Expert', 'Pretest', 'Post Test'];

function getStepContent(stepIndex) {
  switch (stepIndex) {
    // case 0:
    //   return 'materiAdd';
    case 0:
      return 'sharingAdd';
    case 1:
      return 'pretestAdd';
    case 2:
      return 'posttestAdd';
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


export default function MasterPreTestAdd({ onChangePage }) {
  const [formContent, setFormContent] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [timer, setTimer] = useState('');
  const gambarInputRef = useRef(null);
  const [resetStepper, setResetStepper] = useState(0);
  const [isBackAction, setIsBackAction] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSectionAction, setIsSectionAction] = useState(false); 
  const [showConfirmationSection, setShowConfirmationSection] = useState(false);

  const [dataSection, setDataSection] = useState({
    materiId: AppContext_master.dataIDMateri,
    secJudul: "Section Materi " + AppContext_master.dataIDMateri,
    createdby: AppContext_test.activeUser
  });

  const handleConfirmYesSection = () => {
    setShowConfirmationSection(false); 
    try {
      axios.post(API_LINK + "Section/CreateSection", dataSection)
      .then(response => {
        const data = response.data;
        console.log("data section", dataSection);
        if (data[0].hasil === "OK") {
          AppContext_master.dataIdSection = data[0].newID;
          console.log("id section", AppContext_master.dataIdSection);
          SweetAlert("Sukses", "Data Section Pretest berhasil ditambahkan", "success");
          // setIsFormDisabled(true);
          AppContext_master.formSavedMateri = true;
          SweetAlert(
            "Sukses",
            "Data section berhasil disimpan",
            "success"
          );
          onChangePage("posttestAdd", AppContext_master.MateriForm = formData, AppContext_master.count += 1, AppContext_master.dataIdSection);
        } else {
          setIsError(prevError => ({
            ...prevError,
            error: true,
            message: "Terjadi kesalahan: Gagal menyimpan data Materi."
          }));
        }
      })
      .catch(error => {
        console.error('Terjadi kesalahan:', error);
        setIsError(prevError => ({
          ...prevError,
          error: true,
          message: "Terjadi kesalahan: " + error.message
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
  };


  const handleConfirmNoSection = () => {
    setShowConfirmationSection(false);  
    window.location.reload();
  };

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
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

  const [formData, setFormData] = useState({
    materiId: AppContext_master.dataIDMateri,
    sec_id: AppContext_master.dataIdSection,
    quizDeskripsi: '',
    quizTipe: 'Pretest',
    tanggalAwal: '',
    tanggalAkhir: '',
    timer: '',
    status: 'Aktif',
    createdby: AppContext_test.displayName,
  });

  // useEffect(() => {
  //   formData.current.materiId = AppContext_test.dataIDMateri;
  //   formData.current.sec_id = AppContext_master.dataIdSection;
  // }, [AppContext_master.dataIdSection, AppContext_test.dataIDMateri]); 

  const handlePointChange = (e, index) => {
    const { value } = e.target;

    // Update point pada formContent
    const updatedFormContent = [...formContent];
    updatedFormContent[index].point = value;
    setFormContent(updatedFormContent);

    // Update nilaiChoice pada formChoice
    setFormChoice((prevFormChoice) => ({
      ...prevFormChoice,
      nilaiChoice: value,
    }));
  };

  const addQuestion = (questionType) => {
    const newQuestion = {
      type: questionType,
      text: `Pertanyaan ${formContent.length + 1}`,
      options: [],
      point: 0,
      correctAnswer: "", 
    };
    setFormContent([...formContent, newQuestion]);
    setSelectedOptions([...selectedOptions, ""]);
  };
  

  const [formQuestion, setFormQuestion] = useState({
    quizId: '',
    soal: '',
    tipeQuestion: 'Essay',
    gambar: null,
    // questionDeskripsi: '',
    status: 'Aktif',
    quecreatedby: AppContext_test.displayName,
  });

  formData.timer = timer;

  const [formChoice, setFormChoice] = useState({
    urutanChoice: '',
    isiChoice: '',
    questionId: '',
    nilaiChoice: '',
    quecreatedby: AppContext_test.displayName,
  });

   const userSchema = object({
    materiId: string(),
    sec_id:string(),
    quizJudul: string(),
    quizDeskripsi: string().required('Quiz deskripsi harus diisi'),
    quizTipe: string(),
    tanggalAwal: string().required('Tanggal awal harus diisi'),
    tanggalAkhir: string().required('Tanggal akhir harus diisi'),
    timer: string().required('Durasi harus diisi'),
    status: string(),
    createdby: string(),
  });

  const initialFormQuestion = {
    quizId: '',
    soal: '',
    tipeQuestion: 'Essay',
    gambar: null,
    questionDeskripsi: '',
    status: 'Aktif',
    quecreatedby: AppContext_test.displayName,
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedFormContent = [...formContent];
    updatedFormContent[index].type = e.target.value;
    setFormContent(updatedFormContent);
  };

  const handleAddOption = (index) => {
    const updatedFormContent = [...formContent];
    if (updatedFormContent[index].type === "Pilgan") {
      updatedFormContent[index].options.push({ label: "", value: "", point: 0 });
      setFormContent(updatedFormContent);
    }
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isStartDateBeforeEndDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };

  const fileGambarRef = useRef(null);

  const handleFileChangeGambar = (ref, extAllowed) => {
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
          //setFilePreview(reader.result); // Set the preview
        };
        reader.readAsDataURL(file);
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    formData.timer = convertTimeToSeconds(timer);

    const validationErrors = await validateAllInputs(
      formData,
      userSchema,
      setErrors
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: 'Gagal!',
        text: 'Pastikan semua data terisi dengan benar!.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!isStartDateBeforeEndDate(formData.tanggalAwal, formData.tanggalAkhir)) {
      Swal.fire({
        title: 'Error!',
        text: 'Tanggal awal tidak boleh lebih dari tanggal akhir.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    for (let question of formContent) {
      if (question.type === 'Pilgan' && question.options.length < 2) {
          Swal.fire({
            title: 'Gagal!',
            text: 'Opsi pilihan ganda harus lebih dari satu',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
      }
    }
  
    // Hitung total point dari semua pertanyaan dan opsi
    
    const totalQuestionPoint = formContent.reduce((total, question) => {
      if (question.type !== 'Pilgan') {
        total = total + parseInt(question.point)
      }
        return total;
    }, 0);

    const totalOptionPoint = formContent.reduce((total, question) => {
      if (question.type === 'Pilgan') {
        return total + question.options.reduce((optionTotal, option) => optionTotal + parseInt(option.point || 0), 0);
      }
      return total;
    }, 0);

    if (totalQuestionPoint + totalOptionPoint !== 100) {
      
      setResetStepper((prev) => !prev + 1);
      Swal.fire({
        title: 'Gagal!',
        text: 'Total skor harus berjumlah 100',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {

      formData.timer = convertTimeToSeconds(timer);
      const response = await axios.post(API_LINK + 'Quiz/SaveDataQuiz', formData);
      console.log("data quiz", formData);
      if (response.data.length === 0) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Data yang dimasukkan tidak valid atau kurang',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const quizId = response.data[0].hasil;
      for (let i = 0; i < formContent.length; i++) {
        const question = formContent[i];
        const formQuestion = {
          quizId: quizId,
          soal: question.text,
          tipeQuestion: question.type,
          gambar: question.gambar,
          status: 'Aktif',
          quecreatedby: AppContext_test.displayName,
        };
        const uploadPromises = [];
        if (question.type === 'Essay' || question.type === 'Praktikum') {
          if (fileGambarRef.current.files.length >= 0) {
            uploadPromises.push(
              UploadFile(fileGambarRef.current).then(
                (data) => (formQuestion.gambar = data.Hasil)
              )
            );
          }
        //   if (question.selectedFile) {
        //     try {
        //       const uploadResult = await uploadFile(question.selectedFile);
        //       if (uploadResult !== "ERROR" && uploadResult?.newFileName) {
        //         formQuestion.gambar = uploadResult.newFileName;
        //       } else {
        //         formQuestion.gambar = null; // Atur default jika gagal
        //         console.error("Gagal mengunggah file.");
        //       }
        //     } catch (uploadError) {
        //       console.error('Gagal mengunggah gambar:', uploadError);
        //       Swal.fire({
        //       title: 'Gagal!',
        //       text: 'Gagal untuk mengunggah gambar',
        //       icon: 'error',
        //       confirmButtonText: 'OK'
        //     });
        //       return;
        //     }
        //   } else {
        //     // Jika tidak ada file yang dipilih, atur question.gambar menjadi null
        //     formQuestion.gambar = null;
        //   }
        } else if (question.type === 'Pilgan') {
          formQuestion.gambar = '';
        }

        try {
          await Promise.all(uploadPromises);
          const questionResponse = await axios.post(API_LINK + 'Question/SaveDataQuestion', formQuestion);
          console.log("pertanyaan", formQuestion)
          if (questionResponse.data.length === 0) {
            Swal.fire({
              title: 'Gagal!',
              text: 'Data yang dimasukkan tidak valid atau kurang',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            return
          }
  
          const questionId = questionResponse.data[0].hasil;
  
          if (question.type === 'Essay' || question.type === 'Praktikum') {
            const answerData = {
              urutanChoice: '',
              answerText: question.correctAnswer ? question.correctAnswer : "0", 
              questionId: questionId,
              nilaiChoice: question.point,
              quecreatedby: AppContext_test.displayName,
            };

            try {
              const answerResponse = await axios.post(API_LINK + 'Choice/SaveDataChoice', answerData);
              console.log("jawaban",answerData);
            } catch (error) {
              console.error('Gagal menyimpan jawaban Essay:', error);
              Swal.fire({
                title: 'Gagal!',
                text: 'Data yang dimasukkan tidak valid atau kurang',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else if (question.type === 'Pilgan') {
            for (const [optionIndex, option] of question.options.entries()) {
              const answerData = {
                urutanChoice: optionIndex + 1,
                answerText: option.label,
                questionId: questionId,
                nilaiChoice: option.point || 0,
                quecreatedby: AppContext_test.displayName,
              };
  
              try {
                const answerResponse = await axios.post(API_LINK + 'Choice/SaveDataChoice', answerData);
                console.log("jawaban",answerData);
              } catch (error) {
                console.error('Gagal menyimpan jawaban multiple choice:', error);
                Swal.fire({
                  title: 'Gagal!',
                  text: 'Data yang dimasukkan tidak valid atau kurang',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            }
          }
          
          setResetStepper((prev) => !prev + 1);
        } catch (error) {
          console.error('Gagal menyimpan pertanyaan:', error);
          Swal.fire({
            title: 'Gagal!',
            text: 'Data yang dimasukkan tidak valid atau kurang',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
  
      // Tampilkan pesan sukses atau lakukan tindakan lain yang diperlukan setelah semua data berhasil disimpan
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pretest berhasil ditambahkan',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          setFormContent([]);
          setSelectedOptions([]);
          setErrors({});
          setSelectedFile(null);
          setTimer('');
          setIsButtonDisabled(true);
          handleSection();
        }
      });
  
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSection = () => {
    setIsSectionAction(true);  
    setShowConfirmationSection(true);  
  };


  const handleOptionLabelChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].options[optionIndex].label = value;
    setFormContent(updatedFormContent);
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;

    // Update correctAnswer pada formContent
    const updatedFormContent = [...formContent];
    updatedFormContent[index].correctAnswer = value;
    setFormContent(updatedFormContent);

    // Update selectedOptions untuk radio button yang dipilih
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = value;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleChangeQuestion = (index) => {
  const updatedFormContent = [...formContent];
  const question = updatedFormContent[index];

  if (question.type === "Essay") {
    // Simpan jawaban benar untuk pertanyaan Essay ke state
    setCorrectAnswers((prevCorrectAnswers) => ({
      ...prevCorrectAnswers,
      [index]: question.correctAnswer,
    }));
  }

    const newType =
      question.type !== "answer"
        ? question.options.length > 0
          ? "answer"
          : "answer"
        : question.options.length > 0
          ? "Pilgan"
          : "Pilgan";

  updatedFormContent[index] = {
    ...question,
    type: newType,
    options: newType === "Essay" ? [] : question.options,
  };

  setFormContent(updatedFormContent);
};

  const handleDuplicateQuestion = (index) => {
    const duplicatedQuestion = { ...formContent[index] };
    setFormContent((prevFormContent) => {
      const updatedFormContent = [...prevFormContent];
      updatedFormContent.splice(index + 1, 0, duplicatedQuestion);
      return updatedFormContent;
    });
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelectedOptions = [...prevSelectedOptions];
      updatedSelectedOptions.splice(index + 1, 0, selectedOptions[index]);
      return updatedSelectedOptions;
    });
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].options.splice(optionIndex, 1);
    setFormContent(updatedFormContent);
  };

  const handleDeleteQuestion = (index) => {
    const updatedFormContent = [...formContent];
    updatedFormContent.splice(index, 1);
    setFormContent(updatedFormContent);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
    const updatedCorrectAnswers = { ...correctAnswers };
    delete updatedCorrectAnswers[index];
    setCorrectAnswers(updatedCorrectAnswers);
  };

  const parseExcelData = (data) => {
    const questions = data.map((row, index) => {
      if (index < 2) return null;
      const options = row[3] ? row[3].split(',') : [];
      const points = typeof row[4] === 'string' ? row[4].split(',') : [];
      return {
        text: row[1],
        type: row[2].toLowerCase() === 'essay' ? 'Essay' : (row[2].toLowerCase() === 'praktikum' ? 'Praktikum' : 'Pilgan'),
        options: options.map((option, idx) => ({ label: option, value: String.fromCharCode(65 + idx), point: points[idx] ? points[idx].trim() : null })),
        point: row[5], 
      };
    }).filter(Boolean);

    const initialSelectedOptions = questions.map((question, index) => {
      if (question.type === 'Pilgan') {
        const correctIndex = question.options.findIndex((option) => option.value === question.correctAnswer);

        if (correctIndex !== -1) {
          return question.options[correctIndex].value;
        } else {
          return "";
        }
      } else {
        return "";
      }
    });

    setSelectedOptions(initialSelectedOptions);
    setFormContent(questions);
    console.log("ddsds", questions)
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedFormContent = [...formContent];
    updatedFormContent[index].selectedFile = file;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        updatedFormContent[index].imageWidth = image.width;
        updatedFormContent[index].imageHeight = image.height;
        setFormContent(updatedFormContent);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileExcel = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'warning',
        title: 'Format Berkas Tidak Valid',
        text: 'Silahkan unggah berkas dengan format: .xls atau .xlsx',
      });
      event.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        parseExcelData(parsedData);
      };
      reader.readAsBinaryString(selectedFile);
      Swal.fire({
        title: 'Berhasil!',
        text: 'File Excel berhasil ditambahkan',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Gagal!',
        text: 'Pilih file Excel terlebih dahulu!',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template.xlsx';
    link.download = 'template.xlsx';
    link.click();
  };

  const updateFormQuestion = (name, value) => {
    setFormQuestion((prevFormQuestion) => ({
      ...prevFormQuestion,
      [name]: value,
    }));
  };

  const handleOptionPointChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    
    const updatedFormContent = [...formContent];

    updatedFormContent[questionIndex].options[optionIndex].point = parseInt(value);

    // Update the formContent state
    setFormContent(updatedFormContent);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };
  const convertTimeToSeconds = () => {
      return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  };
  
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  
  const handleHoursChange = (e) => {
      setHours(e.target.value);
  };

  const handleMinutesChange = (e) => {
      setMinutes(e.target.value);
  };
  
  const convertSecondsToTimeFormat = (seconds) => {
      const formatHours = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const formatMinutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');

      setHours(formatHours);
      setMinutes(formatMinutes);
      return `${formatHours}:${formatMinutes}`;
  };

  
  const [activeStep, setActiveStep] = useState(1);

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


  if (isLoading) return <Loading />;

  return (
    <>
      <style>
        {`
          .form-check input[type="radio"] {
            transform: scale(1.5);
            border-color: #000;
          }
          .file-name {
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            max-width: 100%;
          }
          .option-input {
            background: transparent;
            border: none;
            outline: none;
            border-bottom: 1px solid #000;
            margin-left: 20px;
          }
          .form-check {
            margin-bottom: 8px;
          }
          .question-input {
            margin-bottom: 12px;
          }
          .file-upload-label {
            font-size: 14px; /* Sesuaikan ukuran teks label */
          }
          .file-ket-label {
            font-size: 10px; /* Sesuaikan ukuran teks label */
          }
        `}
      </style>
      <div className="" style={{display:"flex", justifyContent:"space-between", marginTop:"100px", marginLeft:"70px", marginRight:"70px"}}>
            <div className="back-and-title" style={{display:"flex"}}>
              <button style={{backgroundColor:"transparent", border:"none"}} onClick={handleGoBack}><img src={BackPage} alt="" /></button>
                <h4 style={{ color:"#0A5EA8", fontWeight:"bold", fontSize:"30px", marginTop:"10px", marginLeft:"20px"}}>Tambah Materi Baru</h4>
              </div>
                <div className="ket-draft">
                <span className="badge text-bg-dark " style={{fontSize:"16px"}}>Draft</span>
                </div>
              </div>
      <form id="myForm" onSubmit={handleAdd}>
        <div>
        <CustomStepper
      activeStep={1}
      steps={steps}
      onChangePage={handlePageChange}
      getStepContent={getStepContent}
    />
        </div>
        <div className="card mt-4"  style={{margin:"100px"}}>
          <div className="card-body p-4">
            <div className="row mb-4">

              <div className="col-lg">
                <Input
                  type="text"
                  label="Deskripsi"
                  forInput="quizDeskripsi"
                  value={formData.quizDeskripsi}
                  onChange={handleInputChange}
                  isRequired={true}
                  errorMessage={errors.quizDeskripsi}
                />
              </div>
            </div>
            <div className="row mb-4">
                <div className="col-lg-4">
                    <label htmlFor="waktuInput" className="form-label">
                        <span style={{ fontWeight: 'bold' }}>Durasi:</span>
                        <span style={{ color: 'red' }}> *</span>
                    </label>

                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center me-3">
                            <select 
                                className="form-select me-2" 
                                name="hours" 
                                value={hours} 
                                onChange={handleHoursChange}
                            >
                                {[...Array(24)].map((_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                            <span>Jam</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <select 
                                className="form-select me-2" 
                                name="minutes" 
                                value={minutes} 
                                onChange={handleMinutesChange}
                            >
                                {[...Array(60)].map((_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                            <span>Menit</span>
                        </div>
                    </div>
                </div>
              <div className="col-lg-4">
                <Input
                  label="Tanggal Dimulai:"
                  type="date"
                  value={formData.tanggalAwal}
                  onChange={(e) => handleChange('tanggalAwal', e.target.value)}
                  isRequired={true}
                  forInput="tanggalAwal"
                  errorMessage={errors.tanggalAwal}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  label="Tanggal Berakhir:"
                  type="date"
                  value={formData.tanggalAkhir}
                  onChange={(e) => handleChange('tanggalAkhir', e.target.value)}
                  isRequired={true}
                  forInput="tanggalAkhir"
                  errorMessage={errors.tanggalAkhir}
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="mb-2">
              </div>
              <div className="">
                <div className="d-flex justify-content-end">
                <div className="">
                <Button
                  title="Tambah Pertanyaan"
                  onClick={() => addQuestion("Essay")}
                  iconName="plus"
                  label="Tambah Soal"
                  classType="primary btn-sm px-3 py-1"
                />
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileExcel }
                  accept=".xls, .xlsx"
                />
                </div>
                <div className="ml-3">
                <Button
                  title="Tambah File Excel"
                  iconName="upload"
                  label="Tambah File Excel"
                  classType="primary btn-sm mx-2 px-3 py-1"
                  onClick={() => document.getElementById('fileInput').click()} // Memicu klik pada input file
                />
                </div>
                </div>
                {/* Tampilkan nama file yang dipilih */}
                {selectedFile && <span>{selectedFile.name}</span>}
                <br></br>
                <br></br>
                <div className="d-flex justify-content-end">
                  <div className="mr-4">
                <Button
                  title="Unggah File Excel"
                  iconName="paper-plane"
                  classType="primary btn-sm px-3 py-1"
                  onClick={handleUploadFile}
                  label="Unggah File"
                />
                </div>

                <Button
                  iconName="download"
                  label="Unduh Template"
                  classType="warning btn-sm px-3 py-1 mx-2"
                  onClick={handleDownloadTemplate}
                  title="Unduh Template Excel"
                />
                </div>

              </div>

            </div>
            {formContent.map((question, index) => (
              <div key={index} className="card mb-4">
                <div className="card-header bg-white fw-medium text-black d-flex justify-content-between align-items-center">
                  <span>Pertanyaan</span>
                  <span>
                    Skor: {
                      question.type === 'Pilgan' 
                        ? (question.options || []).reduce((acc, option) => acc + parseInt(option.point), 0)
                        : parseInt(question.point)
                    }
                  </span>

                  <div className="col-lg-2">
                    <select className="form-select" aria-label="Default select example"
                      value={question.type}
                      onChange={(e) => handleQuestionTypeChange(e, index)}>
                      <option value="Essay">Essay</option>
                      <option value="Pilgan">Pilihan Ganda</option>
                      <option value="Praktikum">Praktikum</option>
                    </select>
                  </div>
                </div>
                <div className="card-body p-4">
                  {question.type === "answer" ? (
                    <div className="row">
                      <div className="col-lg-12 question-input">
                        <Input
                          type="text"
                          label={`Question ${index + 1}`}
                          forInput={`questionText-${index}`}
                          value={question.text}
                          onChange={(e) => {
                            const updatedFormContent = [...formContent];
                            updatedFormContent[index].text = e.target.value;
                            setFormContent(updatedFormContent);
                            // Update formQuestion with the new question text
                            updateFormQuestion('soal', e.target.value);
                          }}
                          isRequired={true}
                        />
                      </div>

                      <div className="col-lg-12">
                        <div className="form-check">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} >
                              <input
                                type="radio"
                                id={`option_${index}_${optionIndex}`}
                                name={`option_${index}`}
                                value={option.value}
                                // Checked hanya jika value di selectedOptions sama dengan value dari option
                                checked={selectedOptions[index] === option.value}
                                onChange={(e) => handleOptionChange(e, index)}
                                style={{ marginRight: '5px' }}
                              />
                              <label htmlFor={`option_${index}_${optionIndex}`}>{option.label}</label>
                            </div>
                          ))}
                        </div>

                        <Input
                          type="number"
                          label="Point"
                          value={question.point}
                          onChange={(e) => handlePointChange(e, index)}
                        />
                        <Button
                          classType="primary btn-sm ms-2 px-3 py-1"
                          label="Done"
                          onClick={() => handleChangeQuestion(index)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-lg-12 question-input">
                      <label htmlFor="deskripsiMateri" className="form-label fw-bold">
                      Pertanyaan <span style={{color:"Red"}}> *</span>
                      </label>
                        <Editor
                        id={`pertanyaan_${index}`}
                        value={question.text}
                        onEditorChange={(content) => {
                          const updatedFormContent = [...formContent];
                          updatedFormContent[index].text = content;
                          setFormContent(updatedFormContent);

                          // Update formQuestion.soal
                          setFormQuestion((prevFormQuestion) => ({
                            ...prevFormQuestion,
                            soal: content,
                          }));
                        }}
                        apiKey="ci4fa00c13rk9erot37prff8jjekb93mdcwji9rtr2envzvi"
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount',
                          ],
                          toolbar:
                            'undo redo | formatselect | bold italic backcolor | ' +
                            'alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | removeformat | help',
                        }}
                      />
                      </div>

                      {/* Tampilkan tombol gambar dan PDF hanya jika type = Essay */}
                      {(question.type === "Essay" || question.type === "Praktikum") && (
                        
                        <div className="d-flex flex-column w-100">
                          {/* <FileUpload
                            forInput={`fileInput_${index}`}
                            formatFile=".jpg,.png"
                            label={<span className="file-upload-label">Gambar (.jpg, .png)</span>}
                            onChange={(e) => handleFileChange(e, index)} // Memanggil handleFileChange dengan indeks
                            hasExisting={question.gambar}
                            style={{ fontSize: '12px' }}
                          /> */}
                           <FileUpload
                        forInput="gambarMateri"
                        label="Gambar Soal Essay (.jpg, .png)"
                        formatFile=".jpg,.png"
                        ref={fileGambarRef}
                        onChange={() => handleFileChangeGambar(fileGambarRef, "jpg, png")}
                        hasExisting={question.gambar}
                      />
                          {/* Tampilkan preview gambar jika ada gambar yang dipilih */}
                          {question.selectedFile && (
                            <div style={{
                              maxWidth: '300px', // Set maximum width for the image container
                              maxHeight: '300px', // Set maximum height for the image container
                              overflow: 'hidden', // Hide any overflow beyond the set dimensions
                              marginLeft: '10px'
                            }}>
                              <img
                                src={URL.createObjectURL(question.selectedFile)}
                                alt="Preview Gambar"
                                style={{
                                  width: '100%', // Ensure image occupies full width of container
                                  height: 'auto', // Maintain aspect ratio
                                  objectFit: 'contain' 
                                }}
                              />
                            </div>
                          )}
                          <div className="mt-2">
                            <Input
                              type="number"
                              label="Skor"
                              value={question.point}
                              onChange={(e) => handlePointChange(e, index)}
                              isRequired={true}
                            />
                          </div>
                        </div> 
                      )}

                      {question.type === "Pilgan" && (
                        <div className="col-lg-12">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="form-check" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                              <input
                                type="radio"
                                id={`option_${index}_${optionIndex}`}
                                name={`option_${index}`}
                                value={option.value}
                                checked={selectedOptions[index] === option.value}
                                onChange={(e) => handleOptionChange(e, index)}
                                style={{ marginRight: '10px' }}
                              />
                              <input
                                type="text"
                                value={option.label}
                                onChange={(e) => handleOptionLabelChange(e, index, optionIndex)}
                                className="option-input"
                                readOnly={question.type === "answer"}
                                style={{ marginRight: '10px' }}
                              />
                              <Button
                                iconName="delete"
                                label="Hapus"
                                classType="btn-sm ms-2 px-2 py-0"
                                onClick={() => handleDeleteOption(index, optionIndex)}
                                style={{ marginRight: '10px' }}
                              />
                              <input
                                type="number"
                                id={`optionPoint_${index}_${optionIndex}`}
                                value={option.point}
                                className="btn-sm ms-2 px-2 py-0"
                                onChange={(e) => handleOptionPointChange(e, index, optionIndex)}
                                style={{ width: '50px' }}
                              />
                            </div>
                          ))}
                          <Button
                            onClick={() => handleAddOption(index)}
                            iconName="add"
                            classType="success btn-sm ms-2 px-3 py-1"
                            label="Opsi Baru"
                          />
                        </div>
                      )}

                      <div className="d-flex justify-content-between my-2 mx-1">
                        <div>
                        </div>
                        <div className="d-flex">
                          <div className="mr-3">
                          <Button
                            iconName="trash"
                            label="Hapus"
                            classType="btn-sm ms-2 px-3 py-1"
                            onClick={() => handleDeleteQuestion(index)}
                          />
                          </div>
                          <Button
                            iconName="duplicate"
                            label="Duplikat"
                            classType="btn-sm ms-2 px-3 py-1"
                            onClick={() => handleDuplicateQuestion(index)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
          <div className="d-flex justify-content-between my-4 mx-1 mt-0">
          <div className="ml-4">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("sharingAdd")}
          />
          </div>
          <div className="d-flex mr-4" >
            <div className="mr-2">
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
            disabled={isButtonDisabled}
          />
          </div>
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("posttestAdd")}
          />
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
          pesan={isSectionAction ? "Apakah anda ingin menambah PostTest?" : "Anda yakin ingin simpan data?"}
          onYes={handleConfirmYesSection}
          onNo={handleConfirmNoSection}
        />
        )}
    </>
  );
}