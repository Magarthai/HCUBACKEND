import React from 'react';
import "../css/UserHistoryAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import item1 from "../picture/calendar-dark.png";
import item2 from "../picture/calen-search.png";
import item3 from "../picture/clock-dark.png";


const UserHistoryAppointment = () => {
    return (
        
        <div className="user">
      <header className="user-header">
       
          <h2 >รายการนัดหมาย</h2>
          <h3 >การดำเนินการนัดหมาย</h3>
      
        <div className="HistoryAppointment-header-navbar">
          <NavbarUserComponent />
        </div>
      </header>

      <div className="user-body">
        <div className="HistoryAppointment-body-searchItem">
          {/* <p className="HistoryAppointment-body-searchItem-txt">ค้นหา</p>
          <img className="mini-card-icon" src={item2} alt="icon-search" /> */}
          <label className="textBody-huge colorPrimary-800">ค้นหา</label>
          <input type="date" className="form-control" placeholder="dd/mm/yyyy" />
        </div>

        <div className="HistoryAppointment-body-card">
            <div className="HistoryAppointment-body-card-item">
              <p className="HistoryAppointment-body-card-item-outDate colorPrimary-800">19/12/2023</p>
              <div className="HistoryAppointment-body-card-item-innerCard">
                    <div className="HistoryAppointment-body-card-item-innerCard-TypeAppAndStatus">
                        <h1 className="HistoryAppointment-body-card-item-innerCard-Typeappointment">ยกเลิกนัดหมาย</h1>
                        <p className="HistoryAppointment-body-card-item-innerCard-StatusGreen">เสร็จสิ้น</p>
                    </div>
                    
                    <h2 className="HistoryAppointment-body-card-item-innerCard-ClinicName">คลินิกทั่วไป</h2>
                    
                    <div className="HistoryAppointment-body-card-item-innerCard-DescDate">
                        <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                        <p className="HistoryAppointment-body-card-item-innerCard-DescDate-txt">19/12/2023</p>
                    </div>


                    <div className="HistoryAppointment-body-card-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="HistoryAppointment-body-card-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>

              </div>
            </div>

            <div className="HistoryAppointment-body-card-item">
              <p className="HistoryAppointment-body-card-item-outDate colorPrimary-800">19/12/2023</p>
              <div className="HistoryAppointment-body-card-item-innerCard">
                    <div className="HistoryAppointment-body-card-item-innerCard-TypeAppAndStatus">
                        <h1 className="HistoryAppointment-body-card-item-innerCard-Typeappointment">ขอเลื่อนนัดหมาย</h1>
                        <p className="HistoryAppointment-body-card-item-innerCard-StatusYellow">กำลังดำเนินการ</p>
                    </div>
                    
                    <h2 className="HistoryAppointment-body-card-item-innerCard-ClinicName">คลินิกทั่วไป</h2>
                    
                    <div className="HistoryAppointment-body-card-item-innerCard-DescDate">
                        <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                        <p className="HistoryAppointment-body-card-item-innerCard-DescDate-txt">7/10/2023 - 18/10/2023</p>
                    </div>


                    <div className="HistoryAppointment-body-card-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="HistoryAppointment-body-card-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>

              </div>
            </div>

        </div>


        </div>

        <div className="HistoryAppointment-body-returnButton">
          <button className="return-btn">ย้อนกลับ</button>
        </div>
      </div>
      

    );
}
export default UserHistoryAppointment;