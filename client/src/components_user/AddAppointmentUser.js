import { useEffect, useState } from "react";
import "../css/AddAppointmentUser.css";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";

const AddAppointmentUser = () => {
    const [selectedDate, setSelectedDate] = useState();
    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setSelectedDate(selectedDate);
    };
    return(
            <div className="user">
                    <header className="user-header">
                        <div>
                        <h2>การนัดหมาย</h2>
                        <h3>ขอนัดหมาย</h3>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="user-body">
                        <h3 className="user-head-context">ปฏิทิน</h3>
                        
                        {/* ชื่อคลินิกตามที่ต้องการนัดหมาย */}
                        <label className="user-head-clinicname">คลินิก</label>

                        <div className="CalendarUser">
                        <CalendarUserComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}
                        />
                        </div>
                        <h3 className="user-head-context">ช่วงเวลา</h3>
                        <div class="User-AddAppointment-dropdown">
                            /* Dropdown */
                        </div>

                        <h3 className="user-head-context">สาเหตุการนัด</h3>
                            <div className="user-addappointment-cause"> ตรวจรักษาโรค</div>
                            
                        <h3 className="user-head-context">อาการ</h3>
                            <div className="user-addappointment-description user-add-center">
                                <input type="text" className="UserAddAppointment-textbox" placeholder="Text..."></input>
                            </div>

                        <div className="user-add-center">
                            <button className="user-add-btn-request">ส่งคำขอ</button>
                        </div>

                    </body>
            </div>

    )
}

export default AddAppointmentUser;
