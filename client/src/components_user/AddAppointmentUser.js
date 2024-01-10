import React from "react"
import "../css/AddAppointmentUser.css";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";

const AddAppointmentUser = () => {

    return(
        <div id='xd'>
            <div className="AddAppointmentUserComponent">
                <div className="AddAppointmentUser">
                    <header className="AddAppointmentUser-header">
                        <div>
                        <h1>การนัดหมาย</h1>
                        <h2>ขอนัดหมาย</h2>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="AddAppointmentUser-body">
                        <h2 className='userrheader' style={{marginLeft:45,marginTop:20}}>ปฏิทิน</h2>
                        
                        {/* ชื่อคลินิกตามที่ต้องการนัดหมาย */}
                        <label className="Clinicname-data" style={{marginLeft:45,marginBottom:20}}>คลินิก</label>

                        <div className="CalendarUser">
                            <CalendarUserComponent/>
                        </div>
                            <p>ช่วงเวลา</p>
                            <div class="UserAddAppointment-dropdown">
                                <button class="dropbtn">ตารางนัดหมาย</button>
                                <div class="UserAddAppointment-dropdown-content">
                                    <a href="#">10:00 - 10:30</a>
                                    <a href="#">12:00 - 12:30</a>
                                </div>
                            </div>

                            <p>สาเหตุการนัด</p>
                                <p> ตรวจรักษาโรค</p>
                            
                            <p>อาการ</p>
                                <input type="text" className="UserAddAppointment-textbox"></input>

                            <button className="UserAddAppointment-btn-request">ส่งคำขอ</button>

                        <div className="User-AddAppointment-Description"></div>

                    </body>
                </div>
            </div>
        </div>

    )
}

export default AddAppointmentUser;