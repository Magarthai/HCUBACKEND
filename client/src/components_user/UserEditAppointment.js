import { useEffect, useState, useRef } from "react";
import "../css/UserEditAppointment.css";
import "../css/Component.css";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import Swal from "sweetalert2";

const UserEditAppointment = (props) =>{
    const [selectedDate, setSelectedDate] = useState();

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setSelectedDate(selectedDate);
    };
    const editAppointment = () => {
        Swal.fire({
            title: "ขอแก้ไขนัดหมาย",
            html: "วันที่ 14 ธันวาคม 2023 <br>เวลา 10:01-10:06<br>เป็น<br>วันที่ 25 ธันวาคม 2023<br>เวลา 10:07-10:12",
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "ส่งคำขอแก้ไขนัดหมายสำเร็จ",
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
                        <h3>แก้ไขนัดหมาย</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-EditAppointment-Calendar_container">
                    <div className="user-EditAppointment-Canlendar_title">
                        <h3>ปฏิทิน</h3>
                        <p className="textBody-huge">คลินิกทั่วไป</p>
                    </div>
                </div>
                <div className="user-EditAppointment-Calendar">
                        <CalendarUserComponent  selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}/>
                </div>

                <div className="user-EditAppointment-Dropdown_container gap-32">
                    <div className="user-EditAppointment-Dropdown_title">
                        <h4>ช่วงเวลา</h4>
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
                    <h4 className="user-EditAppointment-Reason_title">สาเหตุการนัดหมาย</h4>
                    <p className="user-EditAppointment-Reason">ตรวจรักษาโรค</p>
                </div>
            
                <div className="user-EditAppointment-Symptom_container gap-32">
                    <h4 className="user-EditAppointment-Symptom_title">อาการเบื้องต้น</h4>
                    <textarea  placeholder="อาการเบื้องต้น" className="user-EditAppointment-Symptom"></textarea>
                </div>
                <div className="user-EditAppointment-Button_container gap-32">
                    <button className="btn-primary"  onClick={()=>editAppointment()} >ส่งคำขอแก้ไข</button>
                </div>
                
            </div>

        </div>

    )
} 

export default UserEditAppointment;