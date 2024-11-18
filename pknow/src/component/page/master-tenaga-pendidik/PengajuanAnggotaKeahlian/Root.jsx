import { useState } from "react";
import MasterPengajuanAnggotaKeahlian from "./PengajuanAnggotaKeahlian";
import MasterGabungKelompokKeahlian from "./GabungKelompokKeahlian";

export default function MasterTenagaPendidik() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();
  
function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterPengajuanAnggotaKeahlian onChangePage={handleSetPageMode} />;
      case "gabung":
        return (
          <MasterGabungKelompokKeahlian
            onChangePage={handleSetPageMode}
            // withID={dataID}
          />
        );
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
