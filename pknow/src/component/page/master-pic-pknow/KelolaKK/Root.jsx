import { useState } from "react";
import MasterKelolaKelompokKeahlian from "./KelolaKK";
import MasterTambahKelompokKeahlian from "./TambahKK";
import MasterLihatKelompokKeahlian from "./LihatKK";
import MasterEditKelompokKeahlian from "./EditKK";

export default function MasterPICPKNOW() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

 // MasterPICPKNOW component
// In MasterPICPKNOW component
function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterKelolaKelompokKeahlian onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterTambahKelompokKeahlian onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterLihatKelompokKeahlian
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterEditKelompokKeahlian
            onChangePage={handleSetPageMode}
            withID={dataID}
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
