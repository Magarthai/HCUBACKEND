import { useState, useEffect } from "react";
import "../css/UserTimetableComponent.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarUserComponent';


const TimetableComponet = (props) => {

    const [clinic, setClinic] = useState({

    })

    const changeClinic = (e) =>{
        setClinic(e.target.value);
    }


    return (
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ตารางเข้าทำการแพทย์</h2>
                        <h3>เวลาเปิด-ปิดทำการ</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-timetable">
                    <div style={{marginBottom:"10px"}}>
                        <label className="textBody-huge colorPrimary-800" style={{marginBottom:"15px"}}>คลินิก</label>
                        <select
                            name="clinic"
                            value={clinic}
                            onChange={(e) => {changeClinic(e);}}
                            className="colorPrimary-800"
                        >
                            <option value="คลินิกทั่วไป">คลินิกทั่วไป</option>
                            <option value="คลินิกเฉพาะทาง">คลินิกเฉพาะทาง</option>
                            <option value="คลินิกกายภาพ">คลินิกกายภาพ</option>
                            <option value="คลินิกฝั่งเข็ม">คลินิกฝั่งเข็ม</option>
                        </select>
                    </div>
                    <div className="colorPrimary-800">
                        <p>วันจันทร์</p>
                        <div className="user-timetable-detail">
                            <p>เวลา : 09:00 - 12:00</p>
                            <p>เวลา : 09:00 - 12:00</p>
                        </div>

                        <p>วันอังคาร</p>
                        <div className="user-timetable-detail">
                            <p>เวลา : 09:00 - 12:00</p>
                            <p>เวลา : 09:00 - 12:00</p>
                        </div>
                        <p>วันพุธ</p>
                        <div className="user-timetable-detail">
                            <p>เวลา : 09:00 - 12:00</p>
                            <p>เวลา : 09:00 - 12:00</p>
                        </div>
                        <p>วันพฤหัสบดี</p>
                        <div className="user-timetable-detail">
                            <p>เวลา : 09:00 - 12:00</p>
                            <p>เวลา : 09:00 - 12:00</p>
                        </div>
                        <p>วันศุกร์</p>
                        <div className="user-timetable-detail">
                            <p>เวลา : 09:00 - 12:00</p>
                            <p>เวลา : 09:00 - 12:00</p>
                        </div>
                    </div>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default TimetableComponet;