import DetailDaftarPustaka from "../../../part/DetailDaftarPustaka";

export default function LihatDaftarPustaka({ onChangePage }) {

  return (
    <div className="">
      <main>
        <DetailDaftarPustaka
        onChangePage={onChangePage}
        ></DetailDaftarPustaka>
      </main>
    </div>
  );
}
