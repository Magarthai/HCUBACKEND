import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import NavbarComponent from "../components_hcu/NavbarComponent";
import "../css/AdminHomeComponent.css";
import function1 from "../picture/function1.jpg";
import function2 from "../picture/function2.jpg";
import function3 from "../picture/function3.jpg";
import function4 from "../picture/function4.jpg";
import function5 from "../picture/function5.jpg";
import function6 from "../picture/function6.jpg";
import function7 from "../picture/function7.jpg";
import function8 from "../picture/function8.jpg";
import logo from "../picture/LogoHCU.png";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import "../css/Component.css";
import ClockComponent from "./ClockComponent";
import ResponsiveComponent from "./ResponsiveComponent";

const HomeComponent = () => {
  const { user, userData } = useUserAuth();
  const [zoomLevel, setZoomLevel] = useState(1);

  const containerStyle = {
    zoom: zoomLevel,
  };
  
  
  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
    console.log(userData)
    const responsivescreen = () => {
      const innerWidth = window.innerWidth;
      const baseWidth = 1920;
      const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
      setZoomLevel(newZoomLevel);
    };

    responsivescreen();
    window.addEventListener("resize", responsivescreen);

    return () => {
      window.removeEventListener("resize", responsivescreen);
    };
  }, []);
    


  return (
    <div style={containerStyle}>
      <NavbarComponent />
      <div className="top">
        <div className="top-item colorPrimary-800">
          <img className="logo" src={logo} alt="logo health care unit" />
          <h2>Health Care Unit</h2>
          <p className="admin-textBody-large">กลุ่มงานบริการสุขภาพและอนามัย</p>
        </div>
        <div className="top-item date colorPrimary-800">
          {userData && <p className="admin-textBody-large">Welcome, {userData.firstName} {userData.lastName}</p>}
          <p className="admin-textBody-large">Time : <ClockComponent /></p>
        </div>
      </div>
      <div className="flexbox-function">
        <Link to="/adminQueueManagementSystemComponent" className="function">
          <img className="function" src={function1} alt="Queue management system" />
        </Link>
        <Link to="/appointmentAdmin" className="function">
          <img className="function" src={function2} alt="Appointment management system" />
        </Link>
        <Link to="#" className="function">
          <img className="function" src={function3} alt="Activity management system" />
        </Link>
        <Link to="#" className="function">
          <img className="function" src={function4} alt="Dashboard" />
        </Link>
        <Link to="#" className="function">
          <img className="function" src={function5} alt="General information management system" />
        </Link>
        <Link to="/timeTableGeneralAdmin" className="function">
          <img className="function" src={function6} alt="Medical hours management system" />
        </Link>
        <Link to="#" className="function">
          <img className="function" src={function7} alt="Feedback" />
        </Link>
        <Link to="#" className="function">
          <img className="function" src={function8} alt="User manual" />
        </Link>
      </div>
    </div>
  );
}

export default HomeComponent;
