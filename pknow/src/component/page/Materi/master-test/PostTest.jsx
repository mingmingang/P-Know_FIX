import { useEffect, useRef, useState, useContext } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button copy";
import Input from "../../../part/Input";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import Alert from "../../../part/Alert";
import Loading from "../../../part/Loading";
// import profilePicture from "../../../../assets/test.jpg";
import KMS_Rightbar from "../../../part/RightBar";
// import SideBar from "../../../backbone/SideBar";
import axios from "axios";
import AppContext_test from "./TestContext";
export default function MasterTestPreTest({ onChangePage, CheckDataReady, materiId }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [marginRight, setMarginRight] = useState("0vh");
  const [currentData, setCurrentData] = useState(null);
  const [receivedMateriId, setReceivedMateriId] = useState();
  const [sectionData, setSectionData] = useState([]);
  function onStartTest() {
    console.log("id quiiizz", currentData.quizId)
    console.log("durasi", currentData.timer);
    onChangePage("pengerjaantest","Posttest" , materiId,currentData.quizId, currentData.timer);
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);

  let idSection;
    
  useEffect(() => {
    let isMounted = true;

    const fetchData_pretest = async (retries = 10, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        setIsLoading(true);
        try {
          const [dataQuiz] = await Promise.all([
            // fetchDataWithRetry_pretest(),
            getListSection(),
            getQuiz_pretest()
          ]);

          if (isMounted) {

            // if (data) {
            //   if (Array.isArray(data)) {
            //     if (data.length !== 0) {
            //       onChangePage("hasiltest", "Pretest", data[0].IdQuiz);
            //       AppContext_test.quizType = "Pretest";
            //       break;
            //     }
            //   } else {
            //     console.error("Data is not an array:", data);
            //   }
            // } else {
            // }
          }
        } catch (error) {
          if (isMounted) {
            setIsError(true);
            console.error("Fetch error:", error);
            if (i < retries - 1) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
              return; // Exit function if max retries reached
            }
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    const fetchDataWithRetry_pretest = async (retries = 15, delay = 500) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.post(API_LINK + "Quiz/GetDataResultQuiz", {
            quizId: AppContext_test.materiId,
            karyawanId: AppContext_test.activeUser,
            tipeQuiz: "Pretest",
          });
          if (response.data.length !== 0) {
   
            return response.data;
          }
        } catch (error) {
          // console.error("Error fetching quiz data:", error);
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error; // Throw error if max retries reached
          }
        }
      }
    };

    

    const getListSection = async (retries = 10, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
          try {
              const response = await axios.post(API_LINK + "Section/GetDataSectionByMateri", {
                  mat_id: AppContext_test.materiId,
                  sec_type: "Pre-Test",
                  sec_status: "Aktif"
              });
              
              if (response.data.length !== 0) {
                idSection = response.data[0].SectionId;
                  return response.data;
              }
          } catch (e) {
              console.error("Error fetching materi data: ", error);
              if (i < retries - 1) {
                  await new Promise((resolve) => setTimeout(resolve, delay))
              } else {
                  throw error;
              }
          }
      }
  };

    // const getQuizData = async () => {
    //     try {
    //       const sectionData = await getSectionData();
    //       const data = await UseFetch(API_LINK + "Quiz/GetDataQuizByIdSection", {
    //         section: sectionData.SectionId
    //       });
    //       if (data === "ERROR" || data.length === 0) throw new Error("Gagal mengambil data quiz.");
    //       return data[0];
    //     } catch (error) {
    //       console.error("Error fetching quiz data:", error);
    //       throw error;
    //     }
    //   };



    const getQuiz_pretest = async (retries = 10, delay = 500) => {
      for (let i = 0; i < retries; i++) {
        try {
          const quizResponse = await axios.post(API_LINK + "Quiz/GetDataQuizByIdSection", {
            section: idSection,
          });
          if (quizResponse.data && quizResponse.data.length > 0) {
            setCurrentData(quizResponse.data[0]); // Hanya set data pertama
            console.log("data quiz", quizResponse.data[0]); // Debugging
            break;
          } 
        } catch (error) {
          console.error("Error fetching quiz data:", error);
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
    };
    

    fetchData_pretest();
    

    return () => {
      isMounted = false;
    };
  }, [AppContext_test.materiId]);



  const circleStyle = {
    width: "50px",
    height: "50px",
    backgroundColor: "lightgray",
    marginRight: "20px",
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const convertToMinutes = (duration) => {
      AppContext_test.durasiTest = duration;
      return Math.floor(duration / 60); 
  };

  return (
    <>
    <div className="d-flex">
    <div className="">
    <KMS_Rightbar
    isActivePengenalan={false}
    isActiveForum={false}
    isActiveSharing={false}
    isActiveSharingPDF={false}
    isActiveSharingVideo={false}
    isActiveMateri={false}
    isActiveMateriPDF={false}
    isActiveMateriVideo={false}
    isActivePreTest={false}
    isActivePostTest={true}
    isOpen={true}
    onChangePage={onChangePage}
    materiId={materiId}
    // refreshKey={refreshKey}
    // setRefreshKey={setRefreshKey}
  />
  </div>
    <div className="d-flex flex-column">
      {isError && (
        <Alert
          type="warning"
          message="Terjadi kesalahan: Gagal mengambil data Test."
        />
      )}
      {isLoading ? (
        <Loading message="Sedang memuat data..." />
      ) : currentData ? ( // Periksa currentData ada atau tidak
        <div style={{ marginRight: marginRight }}>
          <div className=" align-items-center mb-5">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
              style={circleStyle}
            >
              <img
                className="align-self-start"
                style={{
                  width: "450%",
                  height: "auto",
                  position: "relative",
                  right: "30px",
                  bottom: "40px",
                }}
              />
            </div>
            <div style={{marginTop:"100px"}}>
              <h6 className="mb-0">
                {currentData.createdby} - {formatDate(currentData.createdDate)}
              </h6>
              <h2 className="font-weight-bold mb-4 primary">
                {currentData.quizDeskripsi}
              </h2>
              <p className="mb-5">
                Tes ini terdiri dari {currentData.jumlahSoal} soal. Anda hanya memiliki waktu {convertToMinutes(currentData.timer)} menit untuk mengerjakan semua soal.
              </p>
            </div>
            
            <Button
              classType="primary ms-2 px-4 py-2"
              label="Mulai Pre-Test"
              onClick={onStartTest}
            />
          </div>
        </div>
      ) : (
        <Alert type="info" message="Tidak ada data pre-test tersedia." />
      )}
    </div>
    </div>
    </>
  );
  
}