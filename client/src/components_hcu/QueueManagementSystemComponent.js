import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminQueueManagementSystemComponent.css";
import verify_rights_icon from "../picture/verify_rights_icon.png";
const QueueManagementSystemComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
  
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

        let statusElementDetail = document.getElementById("detail-appointment-status");

        if (statusElementDetail) {
            if (statusElementDetail.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
                console.log("Adding Class...");
                statusElementDetail.classList.add("confirmed-background");
            }
            else if(statusElementDetail.textContent.trim() === 'เสร็จสิ้น'){
                statusElementDetail.classList.add("completed-background");
            }
            else if(statusElementDetail.textContent.trim() === 'ไม่สำเร็จ'){
                statusElementDetail.classList.add("failed-background");
            }
            else if(statusElementDetail.textContent.trim() === 'รอยืนยันสิทธ์'){
                statusElementDetail.classList.add("pending-confirmation-background");
            }
        }
    
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

 
  
    const adminQueueCards = document.querySelectorAll('.admin-queue-card');

    function handleCardClick(event) {
        adminQueueCards.forEach(card => card.classList.remove('focused'));    
        event.currentTarget.classList.add('focused');
    }

    adminQueueCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

    const statusElements = document.querySelectorAll('.admin-queue-card-status p');
    
    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';
        }
        else if(element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F'; 
        }
        else if(element.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            element.style.color = '#D88C09'; 
        }
        else if(element.textContent.trim() === 'รอยืนยันสิทธ์') {
            element.style.color = '#A1A1A1'; 
        }
    }

    statusElements.forEach(changeStatusTextColor);

    
        
    
      

    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ระบบการจัดการคิว</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
            <div className="admin-header">
                <a href="/" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/" target="_parent" >คลินิกกายภาพ</a>
                <a href="/" target="_parent" >คลินิกฝั่งเข็ม</a>
            </div>
            
            <div className="admin-body">
                <div className="admin-queue-flexbox">
                    <div className="admin-queue-box">
                        <h2 className="colorPrimary-800">นัดหมายคลินิกทั่วไป</h2>
                        <div className="admin-queue-card" >
                            <div className="admin-queue-card-time colorPrimary-800">
                                <p className="admin-textBody-small">13:01 - 13:06</p>
                            </div>
                            <div className="admin-queue-card-info colorPrimary-800">
                                <p className="admin-textBody-huge">64090500444</p>
                                <p className="admin-textBody-small">รวิษฎา อนุรุตติกุล</p>
                            </div>
                            <div className="admin-queue-card-status">
                                <p className="admin-textBody-small">ไม่สำเร็จ</p>
                            </div>
                            <div className="admin-queue-card-function">
                                <img src={verify_rights_icon} className="admin-queue-card-icon"/>
                            </div>
                        </div>
                        <div className="admin-queue-card" >
                            <div className="admin-queue-card-time colorPrimary-800">
                                <p className="admin-textBody-small">13:01 - 13:06</p>
                            </div>
                            <div className="admin-queue-card-info colorPrimary-800">
                                <p className="admin-textBody-huge">64090500444</p>
                                <p className="admin-textBody-small">รวิษฎา อนุรุตติกุล</p>
                            </div>
                            <div className="admin-queue-card-status">
                                <p className="admin-textBody-small">เสร็จสิ้น</p>
                            </div>
                            <div className="admin-queue-card-function">
                                <img src={verify_rights_icon} className="admin-queue-card-icon"/>
                            </div>
                        </div>
                        <div className="admin-queue-card" >
                            <div className="admin-queue-card-time colorPrimary-800">
                                <p className="admin-textBody-small">13:01 - 13:06</p>
                            </div>
                            <div className="admin-queue-card-info colorPrimary-800">
                                <p className="admin-textBody-huge">64090500444</p>
                                <p className="admin-textBody-small">รวิษฎา อนุรุตติกุล</p>
                            </div>
                            <div className="admin-queue-card-status">
                                <p className="admin-textBody-small">รอยืนยันสิทธ์</p>
                            </div>
                            <div className="admin-queue-card-function">
                                <img src={verify_rights_icon} className="admin-queue-card-icon"/>
                            </div>
                        </div>
                        {/* กรอง status == ยืนยันสิทธ์ เป็นอันด้านล่างนะ */}
                        <div className="admin-queue-card" >
                            <div className="admin-queue-card-time colorPrimary-800">
                                <p className="admin-textBody-small">13:01 - 13:06</p>
                            </div>
                            <div className="admin-queue-card-info colorPrimary-800">
                                <p className="admin-textBody-huge">64090500444</p>
                                <p className="admin-textBody-small">รวิษฎา อนุรุตติกุล</p>
                            </div>
                            <div className="admin-queue-card-status">
                                <p className="admin-textBody-small">ยืนยันสิทธ์แล้ว</p>
                            </div>
                            <div className="admin-queue-card-function-succeed">
                                <img src={verify_rights_icon} className="admin-queue-card-icon"/>
                            </div>
                        </div>

                    </div>
                    <div className="admin-queue-box border-L colorPrimary-800">
                        <div className="admin-queue-detail-header">
                            <div className="admin-queue-detail-header-items"></div>
                            <h2 className="admin-queue-detail-header-items center">รายละเอียดนัดหมาย</h2>
                            <div className="admin-queue-detail-header-items admin-right" ><span id="detail-appointment-status">ยืนยันสิทธ์แล้ว</span></div>
                        </div>
                        <br></br>
                        <p id="detail-appointment-date" className="admin-textBody-big"><b>วันที่</b> : 13/12/2023</p>
                        <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="admin-textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="admin-textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="admin-textBody-big"><b>หมายเหตุ</b>: -</p>

                    </div>

                </div>
                
                
            </div>
           
        </div>
        
    </div>

    );
}

export default QueueManagementSystemComponent;