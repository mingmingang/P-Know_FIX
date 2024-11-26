import React, { forwardRef } from "react";
import Button from "./Button copy";
import Icon from "./Icon";
import Input from "./Input";

const CardProgram = ({
  id,
  data,
  isActive,
  onClick,
  children,
  onChangePage,
  onChangeStatus,
  onDelete,
  index,
}) => {
  const handleStatusChange = (data, status) => {
    onChangeStatus(data, status);
  };

  const handleDeleteClick = (data) => {
    onDelete(data.Key);
  };

  return (
    <div
      id={id}
      className={`card card-program mt-3 ${isActive ? "border-primary" : ""}`}
    >
      {data.Status === "Draft" ? (
        <span
          className="text-danger bg-white px-2 ms-2 mb-0"
          style={{
            marginTop: "-12px",
            width: "fit-content",
            fontSize: "14px",
          }}
        >
          Draft
        </span>
      ) : (
        ""
      )}
      <div
        className={`card-body d-flex justify-content-between ${
          isActive ? "align-items-center border-bottom border-primary" : ""
        }`}
      >
        <p
          className="fw-medium mb-0"
          style={{ width: "20%", borderRight: "solid grey 1px" }}
        >
          {index}
          {". "}
          {data["Nama Program"]}
        </p>
        <p
          className="mb-0 pe-3"
          style={{
            width: "60%",
            display: isActive ? "block" : "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textAlign: "justify",
          }}
        >
          {data.Deskripsi}
        </p>
        {data.Status === "Draft" ? (
          <div
            className="d-flex justify-content-between align-items-center px-3"
            style={{
              width: "10%",
              borderLeft: "solid grey 1px",
            }}
          >
            <Icon
              name="edit"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Ubah data"
              onClick={() => onChangePage("edit", data)}
            />
            <Icon
              name="trash"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Hapus data permanen"
              onClick={() => handleDeleteClick(data)}
            />
            <Icon
              name="paper-plane"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Publikasi program"
              onClick={() => handleStatusChange(data, "Aktif")}
            />
          </div>
        ) : (
          <div
            className="d-flex justify-content-between align-items-center px-3"
            style={{
              width: "10%",
              borderLeft: "solid grey 1px",
            }}
          >
            <Icon
              name="edit"
              type="Bold"
              cssClass="btn px-2 py-0 text-primary"
              title="Ubah data"
              onClick={() => onChangePage("edit", data)}
            />
            <div
              class="form-check form-switch py-0 ms-2"
              style={{ width: "fit-content" }}
            >
              <Input
                type="checkbox"
                forInput=""
                label=""
                className="form-check-input"
                checked={data.Status === "Aktif"}
                onChange={() =>
                  handleStatusChange(
                    data,
                    data.Status === "Aktif" ? "Tidak Aktif" : "Aktif"
                  )
                }
              />
              <label
                className="form-check-label"
                for="flexSwitchCheckDefault"
              ></label>
            </div>
          </div>
        )}
        <div
          className="ps-3"
          style={{
            borderLeft: "solid grey 1px",
          }}
        >
          <Button
            iconName={isActive ? "caret-up" : "caret-down"}
            classType="outline-primary btn-sm px-3"
            onClick={onClick}
            title="Detail Kelompok Keahlian"
          />
        </div>
      </div>
      <div
        className="card-body"
        style={{ display: isActive ? "block" : "none" }}
      >
        <Button
          iconName="add"
          classType="primary btn-sm mb-2"
          label="Tambah Kategori"
          onClick={() => onChangePage("addKategori", data)}
        />
        {children}
      </div>
    </div>
  );
};

export default CardProgram;
