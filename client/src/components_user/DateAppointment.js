import React from "react";
import "../css/UserDateAppointment.css";
import "../css/Component.css";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Delete_icon from "../picture/icon_delete.jpg";
import Edit_icon from "../picture/icon_edit.jpg";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import Swal from "sweetalert2";



const UserDateAppointment = (props) => {
    const deleteAppointment = () => {
        Swal.fire({
            title: "ยกเลิกนัดหมาย",
            html: "วันที่ 14 ธันวาคม 2023 <br> เวลา 10:01 - 10:06",
            showConfirmButton: false,
            showCancelButton: true,
            showDenyButton: true,
            icon: 'warning',
            denyButtonText: "ยกเลิกนัดหมาย",
            cancelButtonText: "กลับ",
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isDenied) {
                Swal.fire({
                    title: "ยกเลิกนัดหมายสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                });
            }
        });
    }
    return (


        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>รายการนัดหมาย</h3>
                </div>

                <NavbarUserComponent />
            </header>
            <div className="user-body">
                <div className="user-DateAppointment-Date_container gap-32">

                    <div className="user-DateAppointment-Date_title">
                        <h4 className="colorPrimary-800">วันที่</h4>
                    </div>
                    <input type="date" className="user-Appointment-select_date"></input>
                </div>
                <div className="user-DateAppointment-AppointmentList_container ">
                    <h4 className="colorPrimary-800 user-DateAppointment-card-h4">นัดหมาย</h4>
                    <div className="user-DateAppointment-cardList_container">
                        <div className="user-DateAppointment-card gap-16">
                            <div className="user-DateAppointment-card_header">
                                <h4 className="user-DateAppointment-clinic">คลินิกทั่วไป</h4>
                                <div className="user-DateAppointment-icon">
                                    <a href="/appointment/edit"><img className="user-DateAppointment-icon_edit" src={Edit_icon} alt="" /></a>
                                    <a onClick={deleteAppointment}><img className="user-DateAppointment-icon_delete" src={Delete_icon} alt="" /></a>
                                </div>
                            </div>
                            <p className="textBody-big"> <img src={CalendarFlat_icon} alt="" />  14/12/2023</p>
                            <p className="textBody-big" style={{marginBottom:0}}> <img src={ClockFlat_icon} alt="" />  10:01 - 10:06</p>
                        </div>

                        <div className="user-DateAppointment-card gap-16">
                            <div className="user-DateAppointment-card_header">
                                <h4 className="user-DateAppointment-clinic gap-8">คลินิกเฉพาะทาง</h4>
                                <div className="user-DateAppointment-icon">
                                    <a href="/appointment/edit"><img className="user-DateAppointment-icon_edit" src={Edit_icon} alt="" /></a>
                                    <a onClick={deleteAppointment}><img className="user-DateAppointment-icon_delete" src={Delete_icon} alt="" /></a>
                                </div>
                            </div>
                            <p className="textBody-big">
                                <img src={CalendarFlat_icon} alt="" />  14/12/2023
                            </p>
                            <p className="textBody-big" style={{margin:0}}> <img src={ClockFlat_icon} alt="" />  13:07 - 13:12</p>
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

export default UserDateAppointment;