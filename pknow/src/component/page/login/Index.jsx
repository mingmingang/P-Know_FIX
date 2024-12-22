import Header from "../../backbone/Header";
import Footer from "../../backbone/Footer";
import "../../../style/Login.css";
import logoPknow from "../../../assets/pknow.png";
import { useState, useRef } from "react";
import Role from "../../part/Role";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";

import {
  API_LINK,
  APPLICATION_ID,
  APPLICATION_NAME,
  ROOT_LINK,
} from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import { encryptId } from "../../util/Encryptor";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/AlertLogin";
import Modal from "../../part/Modal";
import Input from "../../part/Input";
import { object, string } from "yup"; 

export default function Login() {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const RECAPTCHA_SITE_KEY = "6Lf99J4qAAAAAK7bBg2Wh5ynAaXBwEbPY4gJcgKx";


  const formDataRef = useRef({
    username: "",
    password: "",
  });

  const modalRef = useRef();

  // Validation schema for user inputs
  const userSchema = object({
    username: string().max(50, "maksimum 50 karakter").required("harus diisi"),
    password: string().required("Nama Pengguna dan Kata Sandi Wajib Diisi!"),
  });

  // Input change handler with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleCaptchaChange = (value) => setCaptchaValue(value);

  // Login button click handler
  const handleLoginClick = async (e) => {
    // if (!captchaValue) {
    //   setIsError({ error: true, message: "Harap selesaikan CAPTCHA!" });
    //   return;
    // }

  
    e.preventDefault();
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(API_LINK + "Utilities/Login", formDataRef.current);
        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal melakukan autentikasi.");
        } else if (data[0].Status === "LOGIN FAILED") {
          throw new Error("Nama akun atau kata sandi salah.");
        } else {
            setListRole(data);
            setShowModal(true);
            modalRef.current.open();
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  async function handleLoginWithRole(role, nama, peran) {
    try {
      const ipAddress = await fetch("https://api.ipify.org/?format=json")
      .then(response => response.json())
      .then(data => data.ip)
      .catch(error => console.error("Gagal mendapatkan IP:", error));
      
      if (ipAddress === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mendapatkan alamat IP.");
      }
  
      const token = await UseFetch(API_LINK + "Utilities/CreateJWTToken", {
        username: formDataRef.current.username,
        role: role,
        nama: nama,
      });
  
      if (token === "ERROR") {
        throw new Error(
          "Terjadi kesalahan: Gagal mendapatkan token autentikasi."
        );
      }
  
      localStorage.setItem("jwtToken", token.Token);
      const userInfo = {
        username: formDataRef.current.username,
        role: role,
        nama: nama,
        peran: peran,
        lastLogin: null,
      };
      console.log("pengguna",userInfo);
  
      let user = encryptId(JSON.stringify(userInfo));


      Cookies.set("activeUser", user, { expires: 1 });

      if(userInfo.peran == 'PIC P-KNOW' || userInfo.peran == 'PIC Kelompok Keahlian' || userInfo.peran == 'Tenaga Pendidik' ){
        window.location.href = ROOT_LINK + "/" + "beranda_utama";
      } else if(userInfo.peran == 'Program Studi') {
        window.location.href = ROOT_LINK + "/" + "beranda_prodi";
      }else if(userInfo.peran == 'Tenaga Kependidikan') {
        window.location.href = ROOT_LINK + "/" + "beranda_tenaga_kependidikan";
      }else if(userInfo.peran == 'Mahasiswa') {
        window.location.href = ROOT_LINK + "/" + "beranda_mahasiswa";
      }
      
    } catch (error) {
      window.scrollTo(0, 0);
      modalRef.current.close();
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  }
  
  if (Cookies.get("activeUser")) {
    window.location.href = "/";
  } else {
    return (
      <div>
        {isLoading && <Loading />}
        {isError.error && (
          <div className="flex-fill m-3">
            <Alert type="danger" message={isError.message} />
          </div>
        )}

        <Header  showUserInfo={false} />
        <main>
          <section className="login-background">
            <div className="login-container">
              <div className="login-box">
                <img
                  src={logoPknow}
                  className="pknow"
                  alt="Logo ASTRAtech"
                  title="Logo ASTRAtech"
                  width="290px"
                  height="43px"
                />
                <form className="login-form" onSubmit={handleLoginClick}>
                  
                  <Input
                    type="text"
                    forInput="username"
                    placeholder="Nama Pengguna"
                    isRequired
                    value={formDataRef.current.username}
                    onChange={handleInputChange}
                    style={{ marginTop: "20px" }}
                  />
                  <Input
                    type="password"
                    forInput="password"
                    placeholder="Kata Sandi"
                    isRequired
                    value={formDataRef.current.password}
                    onChange={handleInputChange}
                    errorMessage={errors.password}
                    style={{ marginTop: "20px" }}
                  />
                 
                 {/* <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                /> */}

                  {/* <div className="captcha">
                    <div id="captchaValue">SSSS</div>
                      <input type="text" id="inputCaptcha" placeholder="Captcha" />
                  </div> */}
                  <button className="login-button" style={{border:'none', width:'100%', backgroundColor:'#0E6DFE', height:'40px', color:'white', marginTop:'20px', borderRadius:'10px'}}
                    type="submit"
                    label="MASUK">Masuk</button>
                </form>
              </div>
            </div>
          </section>
        </main>
        <Footer />

        <Modal title="Pilih Peran" ref={modalRef} size="small">
          <div className="">
            {listRole.map((value, index) => (
              <>
              <div className="d-flex justify-content-between mr-2 ml-2 fw-normal">
              <button
                key={index}
                type="button"
                className="list-group-item list-group-item-action mb-3"
                onClick={() =>
                  handleLoginWithRole(value.RoleID, value.Nama, value.Role)
                }
              >
                Masuk sebagai {value.Role}
              </button>
              <input type="radio" name="" id="" style={{cursor:"pointer", width:"20px"}}  onClick={() =>
                  handleLoginWithRole(value.RoleID, value.Nama, value.Role)
                }/>
              </div>
              </>
            ))}
          </div>
        </Modal>
      </div>
    );
  }
}
