import Button from "./Button copy";

export default function Filter({ children, handleSearch }) {
  return (
    <>
      <Button
        iconName="apps-sort"
        classType="primary dropdown-toggle px-4 border-start"
        title="Saring atau Urutkan Data"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        label="Filter"
        style={{backgroundColor:"white", color:"black", boxShadow: "0 0 10px rgba(0, 0, 0, 0.223)"}}
      />
      <div className="dropdown-menu p-4" style={{ width: "350px" }}>
        {children}
        <Button
              classType="primary px-4 d-flex justify-content-end"
              title="Cari"
              onClick={handleSearch}
              label="Filter"
            />
      </div>
    </>
  );
}
