import React, { useState } from 'react';
import "../css/UserAllAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import icon1 from '../picture/calendar-flat.png';
import icon2 from '../picture/clock-flat.png';
import Popup from 'reactjs-popup';
import icon_submit from '../picture/tick-circle.png';
import icon_cancel from '../picture/close-circle.jpg';

const UserAllAppointment = () => {
    
    return(
        <div id='user-appointment-xd'>
            <div className="UserAllAppointmetComponent">
                <div className="UserAllAppointmet">
                    <header className="UserAllAppointmet-header">
                        <div>
                        <h1>การนัดหมาย</h1>
                        <h2>รายการ</h2>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="UserAllAppointmet-body">
                        <h2 className='User-appointmentmenu-headbar'>ปฏิทิน</h2>
                        <div className="CalendarUser-appointment">
                            <CalendarUserComponent/>
                        </div>

                        <div className="user-appointment-bar-btn">
                            <h2 className='User-appointmentmenu-headbar'>นัดหมายสัปดาห์นี้</h2>
                            <button className="user-appointment-btn-add"><Link to="/appointment/clinic"><x>เพิ่มนัดหมาย +</x></Link></button>
                        </div>

                        <div className="user-appointment-funtion">
                            {/* แบบยังไม่ยืนยันสิทธิ์ */}
                            <div className="user-appointment-card">

                                {/* ชื่อคลินิกที่มีการนัดหมาย */}
                                <label><b className='user-appointment-Bold-letter'>คลินิก</b></label>

                                {/* ข้อมูลการนัดหมาย */}
                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                    <lable>05/12/2023</lable>
                                </div>
                                
                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                    <lable>10:01 - 10:06</lable>
                                </div>
                                
                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                    <lable>: ตรวจรักษาโรค</lable>
                                </div>
                                
                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                    <lable>: มีอาการปวดหัว อาเจียน</lable>
                                </div>

                                <lable className="user-appointment-warn">หมายเหตุ</lable> <br></br>
                                <lable className="user-appointment-warn">: กรุณายืนยันสิทธิ์ก่อน 15 นาที</lable>
                                
                                <div className="user-appointment-btn-submit-set">
                                    <button className="user-appointment-btn-cancel">ยกเลิกสิทธิ์</button>
                                    <button className="user-appointment-btn-submit">ยืนยันสิทธิ์</button>
                                </div>
                            </div>

                            {/* แบบยืนยันสิทธิ์แล้ว */}
                            <div className="user-appointment-card">

                                <div className="user-header-appointment-card">
                                    {/* ชื่อคลินิกที่มีการนัดหมาย */}
                                    <label><b className='user-appointment-Bold-letter'>คลินิก</b></label>
                                    <div className="user-appointment-status">
                                        เสร็จสิ้น
                                    </div>
                                </div>

                                {/* ข้อมูลการนัดหมาย */}
                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                    <lable>05/12/2023</lable>
                                </div>
                                
                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                    <lable>10:01 - 10:06</lable>
                                </div>
                                
                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                    <lable>: ตรวจรักษาโรค</lable>
                                </div>
                                
                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                    <lable>: มีอาการปวดหัว อาเจียน</lable>
                                </div>

                                <lable className="user-appointment-warn">หมายเหตุ</lable> <br></br>
                                <lable className="user-appointment-warn">: กรุณามาก่อนเวลา 10 นาที</lable>
                            </div>
                        </div>
                    </body>
                    <footer className="UserAllAppointmet-footermenu">
                        <lable class="user-appointment-vertical"><Link to="/appointment/list"><y>นัดหมายทั้งหมด</y></Link></lable>
                        <lable><Link to="/apppointment/history"><y>ประวัติการดำเนิน<br></br>การนัดหมาย</y></Link></lable>
                    </footer>
                </div>
            </div>
        </div>

    )
}

export default UserAllAppointment;
