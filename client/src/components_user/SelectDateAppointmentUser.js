import React from "react"
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";

const SelectDateAppointmentUser = () => {

    return(
        <div id='xd'>
            <div className="SelectDateAppointmentUserComponent">
                <div className="SelectDateAppointmentUser">
                    <header className="SelectDateAppointmentUser-header">
                        <div>
                        <h1>การนัดหมาย</h1>
                        <h2>ขอนัดหมาย</h2>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="SelectDateAppointmentUser-body">
                        <h2 className='userrheader' style={{marginLeft:45,marginTop:20}}>ปฏิทิน</h2>
                        
                        {/* ชื่อคลินิกตามที่ต้องการนัดหมาย */}
                        <label className="Clinicname-data" style={{marginLeft:45,marginBottom:20}}>คลินิก</label>

                        <div className="CalendarUser">
                            <CalendarUserComponent/>
                        </div>

                    </body>
                </div>
            </div>
        </div>

    )
}

export default SelectDateAppointmentUser;