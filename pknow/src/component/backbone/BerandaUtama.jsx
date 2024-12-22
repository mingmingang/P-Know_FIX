import ceweVR from "../../assets/ceweVR_beranda.png";
import cowoTop from "../../assets/cowoTop_beranda.png";
import "../../style/Beranda.css";

export default function BerandaUtama() {
  const handleKnowledgeDatabase = () => {
      window.location.replace("/daftar_pustaka"); // Redirect to login page
  }
  return (
    <div>
      <section className="sec1">
        <div className="ucapan">
          <h3>Selamat Datang di</h3>
          <h1>System Knowledge Management System</h1>
          <p>
            “Sistem Manajemen Pengetahuan ini akan membantu Anda belajar lebih
            efisien. Mari kita mulai dengan menjelajahi fitur-fitur yang
            tersedia dengan mengakses menu yang disediakan.”
          </p>
          <button onClick={handleKnowledgeDatabase}>Knowledge Database</button>
        </div>

        <div className="imgDatang">
          <img className="ceweVR" src={ceweVR} alt="Ilustrasi Cewek VR" />
          <img className="cowoTop" src={cowoTop} alt="Ilustrasi Cowok" />
        </div>
      </section>
    </div>
  );
}
