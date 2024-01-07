import React from "react";
import { Link } from "react-router-dom";
import "../css/AppointmentDetail.css";
import '../css/UserChooseClinic.css';
import List_icon from "../picture/List.png";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import logo1 from '../picture/logo-clinic1.png';
import logo2 from '../picture/logo-clinic2.png';
import logo3 from '../picture/logo-clinic3.png';
import logo4 from '../picture/logo-clinic4.png';
const AppointmentDetail = (props) => {
    return (
        <div id='xd'>
    <div className="UserChooseClinicComponent">
        <div className="UserChooseClinic">
        <header className="UserChooseClinic-header">
            <div>
            <h1>การนัดหมาย</h1>
            <h2>เลือกคลินิก</h2>
            </div>

            <NavbarUserComponent/>
        </header>
        <div className="clinic-function">
           

                <div className="wrapper-details">
                    <div className="Card colorPrimary-800 bgColorNeutralBlue-50 gap">
                <h2 className="Card-title">นัดหมาย</h2>
                <p className="textBody-big">ID : 64000000000</p>
                <p className="textBody-big">ชื่อ-นามสกุล : Rawisada Anurutikun</p>
                <p className="textBody-big">คลินิก : คลินิกทั่วไป</p>
                <p className="textBody-big"> <img src={CalendarFlat_icon}/>  14/12/2023</p>
                <p className="textBody-big"> <img src={ClockFlat_icon}/>  10:01 - 10:06</p>
                <h3>สาเหตุการนัดหมาย</h3>
                <p className="textBody-big">: ตรวจรักษาโรค</p>
                <h3>อาการเบื้องต้น</h3>
                <p className="textBody-big">: มีอาการปวดหัว อาเจียน</p>
            </div>
                </div>


            </div>

    </div>
    </div>
    </div>

    );
}

export default AppointmentDetail;

 