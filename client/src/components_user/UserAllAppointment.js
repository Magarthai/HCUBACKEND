import React from "react"
import "../css/UserAllAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import icon1 from '../picture/calendar-flat.png';
import icon2 from '../picture/clock-flat.png';

const UserAllAppointment = () => {

    return(
        <div id='xd'>
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
                        <h2 className='userrheader' style={{marginLeft:45,marginTop:25,marginBottom:20}}>ปฏิทิน</h2>
                        <div className="CalendarUser">
                            <CalendarUserComponent/>
                        </div>

                        <div className="bar-btn">
                            <h2 className='userrheader' style={{marginLeft:45,marginTop:20,marginBottom:0}}>นัดหมายสัปดาห์นี้</h2>
                            <button className="btn-add"><Link to="/ChooseClinicUser">เพิ่มนัดหมาย +</Link></button>
                        </div>

                        <div className="appointment-funtion">
                            {/* แบบยังไม่ยืนยันสิทธิ์ */}
                            <div className="appointment-card">

                                {/* ชื่อคลินิกที่มีการนัดหมาย */}
                                <label><b>คลินิก</b></label>

                                {/* ข้อมูลการนัดหมาย */}
                                <div className="description1">
                                    <img className="icon-card" src={icon1} alt="icon-calendar" />
                                    <lable>05/12/2023</lable>
                                </div>
                                
                                <div className="description1">
                                    <img className="icon-card" src={icon2} alt="icon-clock" />
                                    <lable>10:01 - 10:06</lable>
                                </div>
                                
                                <div className="description2">
                                    <label><b>สาเหตุการนัดหมาย</b></label> <br></br>
                                    <lable>: ตรวจรักษาโรค</lable>
                                </div>
                                
                                <div className="description2">
                                    <label><b>อาการ</b></label> <br></br>
                                    <lable>: มีอาการปวดหัว อาเจียน</lable>
                                </div>

                                <lable className="warn">หมายเหตุ: กรุณายืนยันสิทธิ์ก่อน 15 นาที</lable>
                                
                                {/* ปุ่มยืนยันสิทธิ์ */}
                                <div className="btn-submit-appointment">
                                    <button className="btn-cancel">ยกเลิกสิทธิ์</button>
                                    <button className="btn-submit">ยืนยันสิทธิ์</button>
                                </div>
                            </div>

                            {/* แบบยืนยันสิทธิ์แล้ว */}
                            <div className="appointment-card">

                                <div className="header-appointment-card">
                                    {/* ชื่อคลินิกที่มีการนัดหมาย */}
                                    <label><b>คลินิก</b></label>
                                    <div className="appointment-status">
                                        เสร็จสิ้น
                                    </div>
                                </div>

                                {/* ข้อมูลการนัดหมาย */}
                                <div className="description1">
                                    <img className="icon-card" src={icon1} alt="icon-calendar" />
                                    <lable>05/12/2023</lable>
                                </div>
                                
                                <div className="description1">
                                    <img className="icon-card" src={icon2} alt="icon-clock" />
                                    <lable>10:01 - 10:06</lable>
                                </div>
                                
                                <div className="description2">
                                    <label><b>สาเหตุการนัดหมาย</b></label> <br></br>
                                    <lable>: ตรวจรักษาโรค</lable>
                                </div>
                                
                                <div className="description2">
                                    <label><b>อาการ</b></label> <br></br>
                                    <lable>: มีอาการปวดหัว อาเจียน</lable>
                                </div>

                                <lable className="warn">หมายเหตุ: กรุณามาก่อนเวลา 10 นาที</lable>
                            </div>
                        </div>
                    </body>
                </div>
            </div>
        </div>

    )
}

export default UserAllAppointment;
