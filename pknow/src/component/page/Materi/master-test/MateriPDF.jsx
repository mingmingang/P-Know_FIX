import { useEffect, useRef, useState, useContext } from "react";
import axios from 'axios';
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import Button from "../../../part/Button";
import Input from "../../../part/Input";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import Alert from "../../../part/Alert";
import Loading from "../../../part/Loading";
import KMS_VideoPlayer from "../../../part/VideoPlayer";
import AppContext_test from "./TestContext";
import ReactPlayer from 'react-player';
import PDF_Viewer from "../../../part/PDF_Viewer";
import KMS_Rightbar from "../../../part/RightBar";

  const inisialisasiData = [
    {
    Key: null,
    No: null,
    Kategori: null,
    Judul: null,
    File_pdf: null,
    File_vidio: null,
    Pengenalan: null,
    Keterangan: null,
    "Kata Kunci": null,
    Gambar: null,
    Sharing_pdf: null,
    Sharing_vidio: null,
    Status: "Aktif",
    Count: 0,
    },
  ];

export default function MasterTestIndex({ onChangePage,materiId }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [fileData, setFileData] = useState({
    file: "",
});
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Kode Test] asc",
    status: "Aktif",
  });

  // console.log(materiId)
  
  
  const formUpdate = useRef({
    materiId: AppContext_test.materiId,
    karyawanId: AppContext_test.activeUser,
    totalProgress: "0", 
    statusMateri_PDF: "",
    statusMateri_Video: "",
    statusSharingExpert_PDF: "",
    statusSharingExpert_Video: "",
    createdBy: "Fahriel",
  });



const getFileData = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
      try {
          const response = await axios.post(API_LINK + "Materi/GetDataMateriById", {
              id: AppContext_test.materiId,
          });
          if (response.data.length !== 0) {
              const { File_pdf, Judul, Nama, Creadate } = response.data[0];
              setFileData({
                  file: File_pdf || "",
                  judul: Judul || "Tidak ada judul",
                  uploader: Nama || "Tidak ada uploader",
                  creadate: Creadate || "Tanggal tidak tersedia",
              });
              return;
          }
      } catch (error) {
          console.error("Error fetching materi data: ", error);
          if (i < retries - 1) {
              await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
              throw error;
          }
      }
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};


useEffect(() => {
    const fetchData = async () => {
        try {
            await getFileData();
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
}, [AppContext_test.materiId]);

  console.log("coba",currentData)

  if (AppContext_test.progresMateri == "materi_video") {
    formUpdate.current.statusMateri_Video = "Done";
  } else {
    formUpdate.current.statusSharingExpert_Video = "Done";
  }
  console.log("tes materi", AppContext_test.materiId);

 async function saveProgress() {
    let success = false;
    let retryCount = 0;
    const maxRetries = 5; 

    while (!success && retryCount < maxRetries) {
      try {
        const response = await axios.post(API_LINK + "Materis/SaveProgresMateri", formUpdate.current);
        
        if (response.data != 0){
          success = true;
          console.log(response.data)
          AppContext_test.refreshPage += retryCount;
          console.log(AppContext_test.refreshPage, "DS")
          console.log('ds') 
        }
      } catch (error) {
        console.error("Failed to save progress:", error);
        retryCount += 1;
        if (retryCount >= maxRetries) {
          console.error("Max retries reached. Stopping attempts to save progress.");
        }
      }
    }
  }

  // async function updateProgres() {
  //   let success = false;
  //   let retryCount = 0;
  //   const maxRetries = 5; 

  //   while (!success && retryCount < maxRetries) {
  //     try {
  //       const response = await axios.post(API_LINK + "Materis/UpdatePoinProgresMateri", {
  //         materiId: AppContext_test.materiId,
  //       });
  //     } catch (error) {
  //       console.error("Failed to save progress:", error);
  //       retryCount += 1;
  //       if (retryCount >= maxRetries) {
  //         console.error("Max retries reached. Stopping attempts to save progress.");
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    saveProgress();
    // updateProgres();
  }, []);


return (
  <>
    <div className="d-flex">
        <KMS_Rightbar
     isActivePengenalan={false}
     isActiveForum={false}
     isActiveSharing={false}
     isActiveSharingPDF={false}
     isActiveSharingVideo={false}
     isActiveMateri={true}
     isActiveMateriPDF={true}
     isActiveMateriVideo={false}
     isActivePreTest={false}
     isActivePostTest={false}
      isOpen={true}
      onChangePage={onChangePage}
      materiId={materiId}
      // refreshKey={refreshKey}
      // setRefreshKey={setRefreshKey}
    />
    <div className="">
      {isError && (
        <div className="">
          <Alert
            type="warning"
            message="Terjadi kesalahan: Gagal mengambil data Test."
          />
        </div>
      )}
      <div className=""></div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
          <div style={{  marginTop:"100px", marginBottom:"80px" }}>
           <h1 style={{ fontWeight: 600, color: "#0A5EA8" }} className="ml-4">Materi {fileData.judul}</h1>
                        <h6 style={{ color: "#0A5EA8" }} className="ml-4">
                            Oleh {fileData.uploader} - {formatDate(fileData.creadate)}
                        </h6>
                        {fileData.file ? (
                        <PDF_Viewer 
                          pdfFileName={fileData.file} 
                          width="1000px" 
                          height="800px" 
                        />
                      ) : (
                        <div className="alert alert-warning mt-4 mb-4 ml-4" >
                        Tidak ada Materi PDF yang tersedia.
                        </div>
                      )}

                        </div>
          </>
        )}
    </div>
    </div>
  </>
);
}