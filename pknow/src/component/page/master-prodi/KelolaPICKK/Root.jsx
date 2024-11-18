import { useState } from "react";
import MasterKelolaPICKK from "./KelolaPICKK";
import MasterTambahPICKK from "./TambahPICKK";

export default function MasterKelolaPIC() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

 // MasterPICPKNOW component
// In MasterPICPKNOW component
function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterKelolaPICKK onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterTambahPICKK onChangePage={handleSetPageMode} />;
        // withID={dataID}
      // case "detail":
      //   return (
      //     <MasterLihatDaftarPustaka
      //       onChangePage={handleSetPageMode}
      //       // withID={dataID}
      //     />
      //   );
      // case "edit":
      //   return (
      //     <MasterEditDaftarPustaka
      //       onChangePage={handleSetPageMode}
      //       withID={dataID}
      //     />
      //   );
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
