import { useEffect, useState, useRef } from "react";
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
import { db, getDocs ,collection} from "../firebase/config"; // Import the necessary Firestore functions and initialization file

const HomeComponent = (props) => {
  const [showTime, setShowTime] = useState(getShowTime);
  const [userData, setUserData] = useState(null); // State to store user data
  const animationFrameRef = useRef();
  const { user } = useUserAuth();

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
    const updateShowTime = () => {
      const newTime = getShowTime();
      if (newTime !== showTime) {
        setShowTime(newTime);
      }
      animationFrameRef.current = requestAnimationFrame(updateShowTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateShowTime);

    // Fetch user data when the component mounts
    fetchUserData();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showTime]);

  // Function to fetch all user data
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
        console.error("Error fetching user data:", error);
    }
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
  const locale = 'en'
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const currentDate = `${day} ${month}/${date}/${year}`;

  return (
    <div>
      <NavbarComponent />
      <div className="top">
        <div className="top-item">
          <img className="logo" src={logo} alt="logo health care unit" />
          <h3 className="colorPrimary-800">Health Care Unit</h3>
          <p className="textBody-medium colorPrimary-800">กลุ่มงานบริการสุขภาพและอนามัย</p>
        </div>
        <div className="top-item date">
          {userData && <p className="colorPrimary-800">Welcome, {userData.firstName} {userData.lastName}</p>}
          <p>Date : {currentDate}</p>
          <p>Time : {showTime}</p>
        </div>
      </div>
      <div className="flexbox-function">
          <a href="#" target="_parent" className="function"><img className="function" src={function1} alt="Queue management system"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function2} alt="Appointment management system"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function3} alt="Activity management system"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function4} alt="Dashboard"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function5} alt="General information management system"  href="/login"/></a>
          <a href="/timeTableAdmin" target="_parent" className="function"><img className="function" src={function6} alt="Medical hours management system"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function7} alt="Feedback"  href="/login"/></a>
          <a href="#" target="_parent" className="function"><img className="function" src={function8} alt="User manual"  href="/login"/></a>

      </div>
        
       
    </div>
        
    );
}

export default HomeComponent;