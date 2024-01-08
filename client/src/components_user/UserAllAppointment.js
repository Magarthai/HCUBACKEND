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
    {/* btn submit */}
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    const handleOpenPopup1 = () => {
        setIsOpen1(true); // เปิด Popup 1
    };

    const handleOpenPopup2 = () => {
        setIsOpen1(false); // ปิด Popup 1
        setIsOpen2(true); // เปิด Popup 2
    };
    
    const handleClosePopup2 = () => {
        setIsOpen2(false); // ปิด Popup 2
    };

    {/* btn cancle */}
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);

    const handleOpenPopup3 = () => {
        setIsOpen3(true); // เปิด Popup 3
    };

    const handleOpenPopup4 = () => {
        setIsOpen3(false); // ปิด Popup 3
        setIsOpen4(true); // เปิด Popup 4
    };
    
    const handleClosePopup4 = () => {
        setIsOpen4(false); // ปิด Popup 4
    };
    
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
                            <button className="btn-add"><Link to="/ChooseClinicUser"><x>เพิ่มนัดหมาย +</x></Link></button>
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

                                <lable className="warn">หมายเหตุ</lable> <br></br>
                                <lable className="warn">: กรุณายืนยันสิทธิ์ก่อน 15 นาที</lable>
                                
                                <div className="btn-submit-appointment">
                                    <button className="btn-cancel" onClick={handleOpenPopup3}>ยกเลิกสิทธิ์</button>
                                    <button className="btn-submit" onClick={handleOpenPopup1}>ยืนยันสิทธิ์</button>
                                </div>

                                {/* Pop Up */}
                                {/* Pop Up ขั้นเลือก */}
                                <Popup className='Popup-appointment' open={isOpen1} onClose={() => setIsOpen1(false)}>
                                    <div className='Popup-submit'>
                                        <h2>ยืนยันสิทธิ์</h2>
                                        <label><b>คลินิก</b></label> <br></br>
                                        <lable>วันที่ 05/12/2023</lable> <br></br>
                                        <lable>เวลา 10:01 - 10:06</lable>
                                        <div className="btn-submit-appointment">
                                            <button className="btn-submit-cancel">ยกเลิก</button>
                                            <button className="btn-submit-submit" onClick={() => { handleOpenPopup2(); setIsOpen1(false);}}>ยืนยัน</button>
                                        </div>
                                    </div>
                                </Popup>
                                <Popup className='Popup-appointment' open={isOpen3} onClose={() => setIsOpen3(false)}>
                                    <div className='Popup-cancel'>
                                        <h2>ยกเลิกสิทธิ์</h2>
                                        <label><b>คลินิก</b></label> <br></br>
                                        <lable>วันที่ 05/12/2023</lable> <br></br>
                                        <lable>เวลา 10:01 - 10:06</lable>
                                        <div className="btn-submit-appointment">
                                            <button className="btn-cancel-cancel">กลับ</button>
                                            <button className="btn-cancel-submit" onClick={() => { handleOpenPopup4(); setIsOpen3(false);}}>ยกเลิกสิทธิ์</button>
                                        </div>
                                    </div>
                                </Popup>

                                {/* Pop Up ขั้นยืนยัน*/}
                                <Popup className='Popup-appointment' open={isOpen2} onClose={handleClosePopup2}>
                                    <div className='Popup-success-submit'>
                                    <img className="icon_submit" src={icon_submit} alt="icon_submit" />
                                        <h2>ยืนยันสิทธิ์</h2>
                                        <button className="btn-btn-submit" onClick={handleClosePopup2}>ตกลง</button>
                                    </div>
                                </Popup>
                                <Popup className='Popup-appointment' open={isOpen4} onClose={handleClosePopup4}>
                                    <div className='Popup-success-cancel'>
                                        <img className="icon_cancel" src={icon_cancel} alt="icon_cancel" />
                                        <h2>ยกเลิกสิทธิ์</h2>
                                        <button className="btn-btn-submit" onClick={handleClosePopup4}>ตกลง</button>
                                    </div>
                                </Popup>

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

                                <lable className="warn">หมายเหตุ</lable> <br></br>
                                <lable className="warn">: กรุณามาก่อนเวลา 10 นาที</lable>
                            </div>
                        </div>
                    </body>
                    <footer className="UserAllAppointmet-footermenu">
                        <lable class="vertical"><Link to="/"><y>นัดหมายทั้งหมด</y></Link></lable>
                        <lable><Link to="/"><y>ประวัติการดำเนิน<br></br>การนัดหมาย</y></Link></lable>
                    </footer>
                </div>
            </div>
        </div>

    )
}

export default UserAllAppointment;
