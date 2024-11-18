import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import "../../style/KelompokKeahlian.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUser,
  faArrowRight,
  faPeopleGroup,
  faClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import developerImage from "../../assets/developer.png"

function CardKelompokKeahlian({
  config = { footer: "", icon: "", className: "", label: "", page: "" },
  data = {
    id: "",
    title: "",
    prodi: { key: "", nama: "" },
    pic: { key: "", nama: "" },
    desc: "",
    status: "",
    members: [],
    memberCount: 0,
    gambar,
  },
  ketButton,
  colorCircle,
  iconClass,
  showDropdown = true,
  showStatusText = true,
  showProdi = true,
  showUserProdi = true,
  anggota,
  statusPersetujuan,
  onClick,
  onChangePage,
  onChangeStatus,
  onDelete,
  title,
  image,
}) {
  const handleStatusChange = (newStatus) => {
    if (onChangeStatus) {
      onChangeStatus(data, newStatus);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(data.id);
    }
  };

  return (
    <div className="kelompokKeahlian">
      <div className="bg-white-kk">
        <img
          alt={`${title} image`}
          className="cover-daftar-kk"
          height="200"
          src={data.gambar || developerImage}
          width="300"
        />
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h3 className="text-xl font-bold text-blue-600">{data.title}</h3>
        </div>
      <div className="pemilik">
        <div className="prodi">
          <FontAwesomeIcon
            icon={showProdi ? faGraduationCap : faPeopleGroup}
            className="icon-style"
          />
          <p className="text-gray-700" style={{marginLeft:"15px"}}>{showProdi ? data.prodi.nama : anggota}</p>
        </div>
        <div className="userProdi">
          <FontAwesomeIcon
            icon={showUserProdi ? faUser : faClock}
            className="icon-style"
          />
          <p className="text-gray-700">
            {showUserProdi ? `PIC: ${data.pic.nama.replace(/-/g, '')}` : statusPersetujuan}
          </p>
        </div>
        {/* <div className="userProdi">
          <FontAwesomeIcon icon={faUsers} className="icon-style" />
          <span className="text-gray-700" style={{marginLeft:"15px", fontWeight:"600"}}>{data.memberCount} Members</span>
        </div> */}
        </div>
        <div className="">
          <p className="deskripsi" style={{marginTop:"10px"}}>{data.desc}</p>
        </div>
        <div className="status-open">
          <table>
            <tbody>
              <tr>
                <td>
                  {showStatusText ? (
                    <>
                      <i className="fas fa-circle"
                        icon="circle"
                        style={{
                          color: colorCircle,
                          marginRight: "20px",
                        }}
                      />
                      <span style={{ fontSize: "14px" }}>{data.status}</span>
                    </>
                  ) : (
                    <a
                      href="#selengkapnya"
                      className="text-blue-600"
                      style={{ textDecoration: "none" }}
                    >
                      Selengkapnya <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {ketButton && (
            <button
              className="bg-blue-100 text-white px-6 rounded-full open"
              aria-label={`Action for ${title}`}
              onClick={onClick}
            >
              <FontAwesomeIcon
                icon={iconClass}
                style={{ color: "white", marginRight: "10px" }}
              />
              {ketButton}
            </button>
          )}
        </div>
      </div>
      {/* <div className="card-body">
        <div className="pic-info">
          <Icon name="user" />
          <span>{data.pic.nama}</span>
        </div>
        <div className="status-info">
          <p>
            Status: <strong>{data.status}</strong>
          </p>
        </div>
      </div>
      <div className="card-footer">
        {data.status === "Draft" && (
          <div>
            <Button
              label="Publish"
              classType="success"
              onClick={() => handleStatusChange("Aktif")}
            />
            <Button
              label="Delete"
              classType="danger"
              onClick={handleDeleteClick}
            />
          </div>
        )}
        {data.status === "Aktif" && (
          <Button
            label="Deactivate"
            classType="warning"
            onClick={() => handleStatusChange("Tidak Aktif")}
          />
        )}
        {data.status === "Tidak Aktif" && (
          <Button
            label="Activate"
            classType="success"
            onClick={() => handleStatusChange("Aktif")}
          />
        )}
        <Button
          label="View"
          classType="info"
          onClick={() => onChangePage(data.id)}
        />
      </div> */}
    </div>
  );
}

export default CardKelompokKeahlian;
