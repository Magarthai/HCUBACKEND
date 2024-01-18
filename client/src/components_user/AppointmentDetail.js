import React from "react";
import "../css/UserAppointmentDetail.css";
import '../css/Component.css';
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import NavbarUserComponent from '../components_user/NavbarUserComponent';


const AppointmentDetail = (props) => {
    return (
        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>รายละเอียดนัดหมาย</h3>
                </div>

                <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-AppointmenDetail-Card_container gap-32">
                    <div className="user-AppointmenDetail-Card colorPrimary-800">
                        <h2 className="user-AppointmenDetail-Card_title" style={{marginTop:10}}>นัดหมาย</h2>
                        <p className="textBody-big gap-4">ID : 64000000000</p>
                        <p className="textBody-big gap-4">ชื่อ-นามสกุล : Rawisada Anurutikun</p>
                        <p className="textBody-big gap-4">คลินิก : คลินิกทั่วไป</p>
                        <p className="textBody-big gap-4"> <img src={CalendarFlat_icon}/>  14/12/2023</p>
                        <p className="textBody-big gap-4"> <img src={ClockFlat_icon}/>  10:01 - 10:06</p>
                        <h5>สาเหตุการนัดหมาย</h5>
                        <p className="textBody-big">: ตรวจรักษาโรค</p>
                        <h5>อาการเบื้องต้น</h5>
                        <p className="textBody-big">: มีอาการปวดหัว อาเจียน</p>
                    </div>
                </div>

                <div className="user-AppointmenDetail-Button_container">
                    <a className="btn btn-primary" href="/appointment" role="button"  target="_parent">ย้อนกลับ</a>
                </div>
            </div>
    
            
        </div>

    );
}

export default AppointmentDetail;

 