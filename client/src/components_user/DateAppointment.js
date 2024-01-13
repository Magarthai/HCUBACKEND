import React from "react";
import "../css/DateAppointment.css";
import "../css/Component.css";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Delete_icon from "../picture/icon_delete.jpg";
import Edit_icon from "../picture/icon_edit.jpg";
import NavbarUserComponent from '../components_user/NavbarUserComponent';



const UserDateAppointment = (props) =>{
    return (
        
        
            <div className="user">
                {/* <div className="user-DateAppointment-header_container gap-32">
                    <header className="user-DateAppointment-header">
                        <h1 className="user-DateAppointment-header_title">รายการนัดหมาย</h1>
                        <a href="/DateAppointment" className="user-DateAppointment-List_icon">
                        
                        </a>
                       
                    </header>
                    <NavbarUserComponent/>
                </div> */}
                <header className="user-header">
                    <div>
                        <h1>การนัดหมาย</h1>
                        <h2>รายการนัดหมาย</h2>
                    </div>

                    <NavbarUserComponent/>
                </header>
                <div className="user-body">
                <div className="user-DateAppointment-Date_container gap-32">
                
                    <div className="user-DateAppointment-Date_title">
                        <h2 className="colorPrimary-800">วันที่</h2>
                    </div>
                    <input type="date" className="user-Appointment-select_date"></input>
                </div>
                <div className="user-DateAppointment-AppointmentList_container ">
                    <h2 className="colorPrimary-800">นัดหมาย</h2>
                    <div className="user-DateAppointment-cardList_container">
                        <div className="user-DateAppointment-card gap-16">
                            <div className="user-DateAppointment-card_header">
                                <h3 className="user-DateAppointment-clinic gap-8">คลินิกทั่วไป</h3>
                                <div className="user-DateAppointment-icon">
                                    <a href="/DateAppointment"><img className="user-DateAppointment-icon_edit" src={Edit_icon} alt=""/></a>
                                    <a href="/DateAppointment"><img className="user-DateAppointment-icon_delete" src={Delete_icon} alt=""/></a>
                                </div>
                            </div>
                            <p className="textBody-big"> <img className="gap-8" src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                            <p className="textBody-big"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                        </div>
            
                        <div className="user-DateAppointment-card gap-16">
                            <div className="user-DateAppointment-card_header">
                                <h3 className="user-DateAppointment-clinic gap-8">คลินิกเฉพาะทาง</h3>
                                <div className="user-DateAppointment-icon">
                                    <a href="/DateAppointment"><img className="user-DateAppointment-icon_edit" src={Edit_icon} alt=""/></a>
                                    <a href="/DateAppointment"><img className="user-DateAppointment-icon_delete" src={Delete_icon} alt=""/></a>
                                </div>
                            </div>
                            <p className="textBody-big"> 
                            <img className="gap-8" src={CalendarFlat_icon} alt=""/>  14/12/2023
                            </p>
                            <p className="textBody-big"> <img src={ClockFlat_icon} alt=""/>  13:07 - 13:12</p>
                        </div>

                        <div className="user-DateAppointment-card_noAppointment gap-16">
                            <h2 className="user-DateAppointment-noAppointment center">ไม่มีนัดหมาย</h2>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        
    )
}

export default  UserDateAppointment;