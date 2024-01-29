import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminActivityComponent.css";
import calendarFlat_icon from "../picture/calendar-flat.png";
import clockFlat_icon from "../picture/clock-flat.png";
import person_icon from "../picture/person-dark.png";
import annotaion_icon from "../picture/annotation-dark.png";

const ActivityTodayComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [isChecked, setIsChecked] = useState({});
  
    
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

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ระบบการจัดการกิจกรรม</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
            <div className="admin-header">
                <div className="admin-hearder-item">
                    <a href="#" target="_parent" id="select">กิจกรรมวันนี้</a>
                    <a href="/adminActivityOpenRegisterComponent" target="_parent" >เปิดลงทะเบียน</a>
                    <a href="/adminActivityNoOpenRegisterComponent" target="_parent" >ยังไม่เปิดลงทะเบียน</a>
                    <a href="/adminActivityAllComponent" target="_parent" >ทั้งหมด</a>
                </div>
                <div className="admin-hearder-item admin-right">
                    <a href="/adminActivityAddComponent" target="_parent">เพิ่มกิจกรรม </a>
                </div>
            </div>
            
            <div className="admin-body">
                <div className="admin-activity-today">
                    <div className="admin-activity-today-hearder-flexbox">
                        <div className="admin-activity-today-hearder-box">
                            <h2 className="colorPrimary-800">กิจกรรม</h2>
                            <p className="admin-textBody-big colorPrimary-800"><img src={calendarFlat_icon} className="icon-activity"/> : 14/10/2023</p>
                            <p className="admin-textBody-big colorPrimary-800"><img src={clockFlat_icon} className="icon-activity"/> : 10:00 - 16:00</p>
                            <p className="admin-textBody-big colorPrimary-800"><a href="/adminActivityListOfPeopleComponent" target="_parent" className="colorPrimary-800"><img src={person_icon} className="icon-activity"/> : 40 คน <img src={annotaion_icon} className="icon-activity"/></a></p>
                        </div>
                        <div className="admin-activity-today-hearder-box admin-right">
                            <label className={`toggle-switch ${isChecked ? 'checked' : ''}`}>
                                <input type="checkbox"  
                                checked={isChecked}
                                onChange={handleToggle}/>
                                <div className="slider"></div>
                            </label>
                        </div>
                    </div>
                    <h3 className="colorPrimary-800">รายละเอียด</h3>
                    <p className="admin-textBody-huge2 colorPrimary-800">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Molestie a iaculis at erat pellentesque adipiscing commodo. Diam quis enim lobortis scelerisque. Orci dapibus ultrices in iaculis nunc sed augue lacus. Velit euismod in pellentesque massa placerat. At augue eget arcu dictum varius duis at. Nisl rhoncus mattis rhoncus urna neque viverra justo nec. Quis ipsum suspendisse ultrices gravida. Sed felis eget velit aliquet sagittis. Leo integer malesuada nunc vel risus commodo. Lacus sed viverra tellus in hac habitasse platea dictumst. Eros donec ac odio tempor orci dapibus. Lacus vel facilisis volutpat est velit egestas dui id. Odio tempor orci dapibus ultrices. Fermentum leo vel orci porta non pulvinar. Id diam vel quam elementum pulvinar etiam. Libero id faucibus nisl tincidunt eget nullam non nisi. Ornare suspendisse sed nisi lacus. Etiam erat velit scelerisque in dictum non consectetur a erat. Ac auctor augue mauris augue.</p>
                    <div className="admin-right">
                        <a href="/adminActivityListOfPeopleComponent" target="_parent" className="btn-activity ">จัดการคิว</a>
                    </div>
                    
                </div>
                
                
            </div>
           
        </div>
        
    </div>

    );
}

export default ActivityTodayComponent;