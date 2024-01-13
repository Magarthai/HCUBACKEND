import React from "react";
import "../css/AppointmentDetail.css";
import '../css/Component.css';
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import NavbarUserComponent from '../components_user/NavbarUserComponent';


const AppointmentDetail = (props) => {
    return (
        <div className="user">
            <header className="user-header">
                <div>
                    <h1>การนัดหมาย</h1>
                    <h2>รายละเอียดนัดหมาย</h2>
                </div>

                <NavbarUserComponent />
            </header>

            <div className="user-body">
                <div className="user-AppointmenDetail-Card_container gap-32">
                    <div className="user-AppointmenDetail-Card colorPrimary-800">
                        <h2 className="user-AppointmenDetail-Card_title">นัดหมาย</h2>
                        <p className="textBody-big gap-4">ID : 64000000000</p>
                        <p className="textBody-big gap-4">ชื่อ-นามสกุล : Rawisada Anurutikun</p>
                        <p className="textBody-big gap-4">คลินิก : คลินิกทั่วไป</p>
                        <p className="textBody-big gap-4"> <img src={CalendarFlat_icon} />  14/12/2023</p>
                        <p className="textBody-big gap-4"> <img src={ClockFlat_icon} />  10:01 - 10:06</p>
                        <h3>สาเหตุการนัดหมาย</h3>
                        <p className="textBody-big">: ตรวจรักษาโรค</p>
                        <h3>อาการเบื้องต้น</h3>
                        <p className="textBody-big">: มีอาการปวดหัว อาเจียน</p>
                    </div>
                </div>

                <div className="user-AppointmenDetail-Button_container">
                    <button className="btn-primary">หน้าแรก</button>
                </div>
            </div>


        </div>

    );
}

export default AppointmentDetail;

