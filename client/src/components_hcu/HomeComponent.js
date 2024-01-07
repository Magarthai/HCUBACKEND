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

const HomeComponent = (props) => {
  const [showTime, setShowTime] = useState(getShowTime);
  const [userData, setUserData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); 
  const [loading, setLoading] = useState(true); // Added loading state
  const animationFrameRef = useRef();
  const { user } = useUserAuth();

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
    const fetchUserData = async () => {
        try {
            if (user) {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
    
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                const currentUserData = usersData.find((userData) => userData.uid === user.uid);
    
            if (currentUserData) {
                setUserData(currentUserData);
                console.log(currentUserData);
            } else {
                console.log("User not found");
            }}
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    fetchUserData();
    const responsivescreen = () => {
      const innerWidth = window.innerWidth;
      const baseWidth = 1920;
      const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
      setZoomLevel(newZoomLevel);
    };

    responsivescreen();
    window.addEventListener("resize", responsivescreen);
    const updateShowTime = () => {
      const newTime = getShowTime();
      if (newTime !== showTime) {
        setShowTime(newTime);
      }
      animationFrameRef.current = requestAnimationFrame(updateShowTime);
    };
  
    animationFrameRef.current = requestAnimationFrame(updateShowTime);
  
    // Fetch user data when the component mounts
    
  
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", responsivescreen);
    };
    
  }, [user]); 
  const containerStyle = {
    zoom: zoomLevel,
  };


  function getShowTime() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  }

  function formatNumber(num) {
    return num < 10 ? "0" + num : num.toString();
  }

  const locale = 'en';
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const currentDate = `${day} ${month}/${date}/${year}`;

  return (
    <div style={containerStyle}>
      <NavbarComponent />
      <div className="top">
        <div className="top-item colorPrimary-800">
          <img className="logo" src={logo} alt="logo health care unit" />
          <h3>Health Care Unit</h3>
          <p className="textBody-large">กลุ่มงานบริการสุขภาพและอนามัย</p>
        </div>
        <div className="top-item date colorPrimary-800">
          {userData && <p className="textBody-large">Welcome, {userData.firstName} {userData.lastName}</p>}
          <p className="textBody-large">Date : {currentDate}</p>
          <p className="textBody-large">Time : {showTime}</p>
        </div>
      </div>
      <div className="flexbox-function">
        <Link to="#" className="function">
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
