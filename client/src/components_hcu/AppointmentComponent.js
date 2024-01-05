import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import NavbarComponent from "../components_hcu/NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import CalendarUserComponent from "../components_user/CalendarUserComponent";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import "../css/AdminHomeComponent.css";
import { addDoc } from 'firebase/firestore';

const AppointmentComponent = (props) => {
    const [showTime, setShowTime] = useState(getShowTime);
    const [userData, setUserData] = useState(null)
    const animationFrameRef = useRef();
    const { user } = useUserAuth();
   
    useEffect(() => {
        document.title = 'Health Care Unit';
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
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
        const updateShowTime = () => {
            const newTime = getShowTime();
            if (newTime !== showTime) {
                setShowTime(newTime);
            }
            animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };

        animationFrameRef.current = requestAnimationFrame(updateShowTime);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [user]); 

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
      <div className="topicBox">
        <div></div>
        <div>
            <h1 className="colorPrimary-800 center">ระบบการจัดการนัดหมาย</h1>
        </div>
        <div className="dateTime">
            <p>Date : {currentDate}</p>
            <p>Time : {showTime}</p>
        </div>
    </div>
    <div className="clinic">
                <a href="/" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/" target="_parent" >คลินิกกายภาพ</a>
                <a href="/" target="_parent" >คลินิกฝั่งเข็ม</a>
    </div>
      <CalendarAdminComponent/>


    </div>
  );
}

export default AppointmentComponent;
