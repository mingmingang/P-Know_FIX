import { useState } from "react";
import MasterRiwayatPengajuan from "./RiwayatPengajuan";


export default function MasterRiwayat() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();
  
function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterRiwayatPengajuan onChangePage={handleSetPageMode} />;
    }
  }
  

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
