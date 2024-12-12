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
import maskot from "../../../../assets/pknowmaskot.png";
import axios from "axios";
import AppContext_test from "./TestContext";
import Cookies from "js-cookie";
import { decryptId } from "../../../util/Encryptor";
import "../../../../style/Table.css";

export default function MasterTestPreTest({
  onChangePage,
  CheckDataReady,
  materiId,
}) {
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [marginRight, setMarginRight] = useState("0vh");
  const [currentData, setCurrentData] = useState(0);
  const [dataDetailQuiz, setDataDetailQuiz] = useState(0);
  const [receivedMateriId, setReceivedMateriId] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [error, setError] = useState(null);
  

  function onStartTest() {
    console.log("id quiiizz", currentData.quizId);
    console.log("durasi", currentData.timer);
    try {
      axios
        .post(API_LINK + "Quiz/SaveTransaksiQuiz", {
          karyawanId: activeUser,
          status: "",
          createdBy: activeUser,
          // nilai: "", 
          // answers: [],
          // createdBy: AppContext_test.displayName,
          jumlahBenar: "",
        })
        .then((response) => {
          const data = response.data;
          console.log("data trQuiz", data[0]);
          if (data[0].hasil === "OK") {
            AppContext_test.dataIdTrQuiz = data[0].tempIDAlt;
            onChangePage(
              "pengerjaantest",
              "Posttest",
              materiId,
              currentData.quizId,
              currentData.timer,
              AppContext_test.dataIdTrQuiz
            );
            // SweetAlert(
            //   "Sukses",
            //   "Data Quiz berhasil ditambahkan",
            //   "success"
            // );
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
  }

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--responsiveContainer-margin-left",
      "0vw"
    );
    const sidebarMenuElement = document.querySelector(".sidebarMenu");
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add("sidebarMenu-hidden");
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
            getQuiz_pretest(),
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
          const response = await axios.post(
            API_LINK + "Quiz/GetDataResultQuiz",
            {
              matId: AppContext_test.materiId,
              quiTipe: "Posttest",
              karyawanId: activeUser,
            }
          );
          if (response.data.length !== 0) {
            setDataDetailQuiz(response.data);
            return response.data;
          }
        } catch (error) {
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            setError("Failed to fetch data after several retries.");
          }
        }
      }
    };

    const getListSection = async (retries = 10, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.post(
            API_LINK + "Section/GetDataSectionByMateri",
            {
              mat_id: AppContext_test.materiId,
              sec_type: "Post-Test",
              sec_status: "Aktif",
            }
          );

          if (response.data.length !== 0) {
            console.log("section post test", response.data);
            idSection = response.data[0].SectionId;
            return response.data;
          }
        } catch (e) {
          console.error("Error fetching materi data: ", error);
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
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
          const quizResponse = await axios.post(
            API_LINK + "Quiz/GetDataQuizByIdSection",
            {
              section: idSection,
            }
          );
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
    fetchDataWithRetry_pretest();

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
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
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
            <div style={{ marginRight: marginRight, marginLeft:"40px" }}>
              <div className=" align-items-center mb-5">
                <div style={{ marginTop: "100px" }}>
                  <div className="d-flex">
                    <div className="mt-2"></div>
                  </div>
                  <h2
                    className="mb-4 primary mt-4"
                    style={{ color: "#002B6C", fontWeight: "600" }}
                  >
                    {currentData.quizDeskripsi}
                    <h6 className="mt-2" style={{ fontWeight: "400" }}>
                      Oleh {currentData.Nama} -{" "}
                      {formatDate(currentData.createdDate)}
                    </h6>
                  </h2>
                  <p
                    className="mb-3"
                    style={{ textAlign: "justify", width: "98%" }}
                  >
                    Post-test ini merupakan evaluasi akhir yang terdiri dari{" "}
                    {currentData.jumlahSoal} soal. Anda diberikan waktu total{" "}
                    {convertToMinutes(currentData.timer)} menit untuk
                    menyelesaikan semua soal tersebut. Waktu pengerjaan akan
                    dimulai secara otomatis saat Anda menekan tombol “Mulai
                    Post-Test” yang terletak di bawah instruksi ini. Post-Test
                    tidak akan dimulai hingga Anda siap dan memilih untuk
                    memulainya dengan mengklik tombol tersebut. Begitu tombol
                    ditekan, waktu akan mulai berjalan, dan Anda harus
                    menyelesaikan semua soal dalam jangka waktu yang telah
                    ditetapkan.
                  </p>
                </div>

                <Button
                  classType="primary mt-2"
                  label="Mulai Post-Test"
                  onClick={onStartTest}
                />
              </div>
              <hr style={{marginRight:"20px"}}/>
              <div className="table-container">
      <h3>Riwayat</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <table className="dynamic-table mb-4">
        <thead>
          <tr>
            <th>No</th> {/* Tambahkan kolom No */}
            <th>Tanggal Quiz</th>
            {/* <th>Trq ID</th> */}
            <th>Nilai</th>
            <th>Keterangan</th>
           
          </tr>
        </thead>
        <tbody>
  {dataDetailQuiz.length > 0 ? (
    dataDetailQuiz.map((item, index) => (
      <tr
        key={index}
        style={{
          backgroundColor: item.Nilai < 75 ? "#f44336" : "#4CAF50", // Merah atau Hijau
          color: "white", // Warna teks selalu putih
        }}
      >
        <td>{index + 1}</td>
        <td>
          {new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(item["Tanggal Quiz"]))}
        </td>
        {/* <td>{item.IdTrq}</td> */}
        <td>{item.Nilai}</td>
        <td>{item.Keterangan}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" ,  backgroundColor:"#ddd"}}>
        Tidak ada data riwayat.
      </td>
    </tr>
  )}
</tbody>

      </table>
      
      )}
    </div>
   
            </div>
            
          ) : (
            <div className="" style={{marginTop:"110px", }}>
            <Alert type="info" message="Saat ini belum tersedia Post Test pada Materi ini." />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
