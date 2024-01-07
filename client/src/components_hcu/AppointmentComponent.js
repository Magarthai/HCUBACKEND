import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../components_hcu/NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import CalendarUserComponent from "../components_user/CalendarUserComponent";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import "../css/AdminAppointmentComponent.css";
import { addDoc } from 'firebase/firestore';

const AppointmentComponent = (props) => {
    const [showTime, setShowTime] = useState(getShowTime);
    const [userData, setUserData] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1); 
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

        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };

        updateShowTime();
        responsivescreen();

        window.addEventListener("resize", responsivescreen);

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

    const locale = 'en'
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;

    const openDetailAppointment = (element, timetable) => {
        
    }

    return (
        <div className="appointment" style={containerStyle}>
            <NavbarComponent />
            <div className="topicBox">
                <div></div>
                <div>
                    <h1 className="colorPrimary-800 center">ระบบการจัดการนัดหมาย</h1>
                </div>
                <div className="dateTime">
                    <p className="textBody-large">Date : {currentDate}</p>
                    <p className="textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <div className="clinic">
                <a href="/appointmentAdmin" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกกายภาพ</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกฝั่งเข็ม</a>
                <a href="/" target="_parent" id="appointment-request-list">รายการขอนัดหมาย</a>
            </div>
            <div className="flex">
                <CalendarAdminComponent />
                <div className="box">
                    <div >
                        <div className="box-header-container">
                            <div className="box-header colorPrimary-800 system-top-item"><h3>นัดหมายคลินิกทั่วไป</h3></div>
                            <div className="box-date colorPrimary-800 system-top-item textBody-large">13/12/2023</div>
                        </div>
                        <div className="box-list colorPrimary-800">
                            <div className="box-userapointment">
                                <div className="time-apppoint textBody-medium">13:01-13:06</div>
                                <div className="appoint-info">
                                    <div className="user-appointment-info flex-column">
                                        <p id="student-id" className="textBody-huge">64090500440</p>
                                        <p id="student-name" className="textBody-medium">uvuvwevwevwe onyetenyevwe</p>
                                    </div>
                                    <div className="appointment-status success textBody-medium">เสร็จสิ้น</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="box">
                    <div id="detail-appointment-current-date" className="colorPrimary-800">
                        <h3 className="center">รายละเอียนัดหมาย</h3>
                        <p id="detail-appointment-date" className="textBody-big"><b>วันที่</b> : 13/12/2023</p>
                        <p id="detail-appointment-time" className="textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="textBody-big"><b>หมายเหตุ</b>: -</p>


                    </div>
                </div>
               
            </div>





        </div>
    );
}

export default AppointmentComponent;
