import React from 'react';
import "../css/UserHistoryAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import item1 from "../picture/calendar-dark.png";
import item2 from "../picture/calen-search.png";
import item3 from "../picture/clock-dark.png";

// {
//     path: "/UserHistoryAppointment",
//     element: <ProtectRoute><UserHistoryAppointment/></ProtectRoute>
//   },
// import UserHistoryAppointment from './components_user/UserHistoryAppointment.js';

const UserHistoryAppointment = () => {
    return (
        
        <div className="user">
            <header className="user-header">
                    <div className="HistoryAppointment-header-txt">
                        <h2 className="head-txt-HistoryApp">รายการนัดหมาย</h2>
                        <h3 className="head-txt-HistoryApp-status">การดำเนินงานนัดหมาย</h3>
                    </div>
                    <div className="HistoryAppointment-header-navbar">
                        <NavbarUserComponent />
                    </div>
            </header>

            <div className="user-body">
                <div className="HistoryAppointment-body-search">
                    <p className="historyAppsearch-txt" style={{ marginLeft: 430, marginTop: 25, marginBottom: 20 }}>ค้นหา</p>
                    <img className="mini-card-icon" src={item2} alt="icon-search" />
                </div>

                <div className="HistoryAppointment-body-card">
                    <div className="HistoryAppointment-body-card-outer">
                        <div className="HistoryAppointment-body-card-outer-Date">
                            <p className="HistoryAppointCard-outer-Date">วัน/เดือน/ปี</p>

                        </div>
                    </div>
                    <div className="HistoryAppointment-body-card-inner">
                        <div className="HistoryAppointment-body-card-inner-items">
                            <div className="HistoryAppointment-body-card-inner-items-Clinic">
                                <p className="HistoryAppointment-body-card-inner-items-Clinic-clinicAppointType">(ประเภทการนัดหมาย)</p>
                                <div className="HistoryAppointment-body-card-inner-items-Clinic-clinicAppointStatus">เสร็จสิ้น</div>
                            </div>
                            <div className="HistoryAppointment-body-card-inner-ref-clinic">
                                    <p className="HistoryAppointment-body-card-inner-ref-clinic-Name">คลินิกทั่วไป</p>
                            </div>
                            <div className="HistoryAppointment-body-card-inner-ref-date">
                                <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                                <p className="HistoryAppointment-body-card-inner-ref-date-txt">วัน/เดือน/ปี</p>
                            </div>
                            <div className="HistoryAppointment-body-card-inner-ref-time">
                                <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                                <p className="HistoryAppointment-body-card-inner-ref-time-txt">เวลา __:__:__</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <footer className="HistoryApppointment-footer">
                <div className="HistoryApppointment-footer-btn">
                    <button className="HistoryApppointment-footer-btn-return">ย้อนกลับ</button>
                </div>
            </footer>
        </div>

    );
}
export default UserHistoryAppointment;