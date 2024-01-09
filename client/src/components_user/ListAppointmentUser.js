import React from 'react';
import "../css/ListAppointmentUser.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import item1 from '../picture/calendar-dark.png';
import item2 from '../picture/calen-search.png';
import item3 from '../picture/clock-dark.png';

// import ListAppointmentUser from './components_user/ListAppointmentUser.js';
// {
//     path: "/ListAppointmentUser",
//     element: <ProtectRoute><ListAppointmentUser/></ProtectRoute>
//   },


const ListAppointmentUser = () => {
    return (

        <div id='xd'>
            <div className="User-AllAppointComponent">
                <div className="Part-AppointList">

                    <header className="AppointList-header">
                        <div className="AppointList-header-items">
                            <div className="AppointList-header-txt">
                                <h1 className="head-txt-List">รายการนัดหมาย</h1>
                                <h2 className="head-txt-All">นัดหมายทั้งหมด</h2>
                            </div>
                            <div className="AppointList-header-navbar">
                                <NavbarUserComponent />
                            </div>
                        </div>
                    </header>

                    <div className="AppointList-body">
                        <div className="AppointList-body-search">
                            <p className="search-txt" style={{ marginLeft: 430, marginTop: 25, marginBottom: 20 }}>ค้นหา</p>
                            <img className="mini-card-icon" src={item2} alt="icon-search" />
                        </div>

                        <div className="AppointList-body-card">
                            <div className="AppointList-body-card-ref">

                                <div className="card-of-appointment">
                                    <p className="outer-card-ref">วัน/เดือน/ปี</p>
                                    <div className="inner-card-ref">
                                        <div className="inner-card-ref-items">
                                            <p className="inner-card-ref-items-ClinicName">คลินิกทั่วไป</p>
                                            <div className="inner-card-ref-items-Calendar">
                                                <img className="mini-card-icon" src={item1} alt="icon-calen" />
                                                <p className="inner-card-ref-items-Calendar-txt">วัน/เดือน/ปี</p>
                                            </div>

                                            <div className="inner-card-ref-items-TimeClick">
                                                <div className="inner-card-ref-items-TimeClick-Time">
                                                    <img className="mini-card-icon" src={item3} alt="icon-clock" />
                                                    <p className="inner-card-ref-items-TimeClick-Time-txt">เวลา __:__:__</p>
                                                </div>
                                                <div className="inner-card-ref-items-TimeClick-Click-txt">
                                                    <a href="#">คลิกเพื่อดูรายละเอียด</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                            </div>




                            <div className="text-status-appointment">
                                <p>----------ดำเนินการนัดหมายสำเร็จ----------</p>
                            </div>


                            <div className="AppointList-body-card-fini">
                                <div className="AppointList-body-card-fini-ref">
                                    <div className="AppointList-body-card-fini-ref-clinic">
                                        <p className="AppointList-body-card-fini-ref-clinic-Name">คลินิกทั่วไป</p>
                                        <div className="AppointList-body-card-fini-ref-clinic-status">
                                            เสร็จสิ้น
                                        </div>
                                    </div>

                                    <div className="AppointList-body-card-fini-ref-Date">
                                        <img className="mini-card-icon" src={item1} alt="icon-calen" />
                                        <p className="AppointList-body-card-fini-ref-Date-txt">วัน/เดือน/ปี</p>
                                    </div>
                                    <div className="AppointList-body-card-fini-ref-Time">
                                        <img className="mini-card-icon" src={item3} alt="icon-clock" />
                                        <p className="AppointList-body-card-fini-ref-Time-txt">เวลา __:__:__</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <footer className="AppointList-footer">
                        <div className="AppointList-footer-btn">
                            <button className="return-btn">ย้อนกลับ</button>
                        </div>
                    </footer>

                </div>
            </div>
        </div>

    )
}

export default ListAppointmentUser;