import React from "react";
import "../css/UserEditAppointment.css";
import "../css/Component.css";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Delete_icon from "../picture/icon_delete.jpg";
import Edit_icon from "../picture/icon_edit.jpg";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";

const UserEditAppointment = (props) =>{

    return (

        <div className="user">
            <header className="user-header">
                    <div>
                        <h1>การนัดหมาย</h1>
                        <h2>แก้ไขนัดหมาย</h2>
                    </div>

                    <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-EditAppointment-Calendar_container">
                    <div className="user-EditAppointment-Canlendar_title">
                        <h2>ปฏิทิน</h2>
                        <p className="textBody-huge">คลินิกทั่วไป</p>
                    </div>
                </div>
                <div className="user-EditAppointment-Calendar">
                        <CalendarUserComponent/>
                </div>

                <div className="user-EditAppointment-Dropdown_container gap-32">
                    <div className="user-EditAppointment-Dropdown_title">
                        <h2>ช่วงเวลา</h2>
                    </div>
                    <dropdown>
                        <select className="user-EditAppointment-Dropdown_time">
                            <option disabled selected hidden>กรุณาเลือกช่วงเวลา</option>
                            <option>15/12/2023</option>
                            <option>16/12/2023</option>
                            <option>20/12/2023</option>
                        </select>
                    </dropdown>

                </div>

                <div className="user-EditAppointment-Reason_container gap-32">
                    <h2 className="user-EditAppointment-Reason_title">สาเหตุการนัดหมาย</h2>
                    <p className="user-EditAppointment-Reason">ตรวจรักษาโรค</p>
                </div>
            
                <div className="user-EditAppointment-Symptom_container gap-32">
                    <h2 className="user-EditAppointment-Symptom_title">อาการเบื้องต้น</h2>
                    <textarea  placeholder="อาการเบื้องต้น" className="user-EditAppointment-Symptom"></textarea>
                </div>
                <div className="user-EditAppointment-Button_container gap-32">
                    <button className="btn-primary">ส่งคำขอแก้ไข</button>
                </div>
                
            </div>

        </div>

    )
} 

export default UserEditAppointment;