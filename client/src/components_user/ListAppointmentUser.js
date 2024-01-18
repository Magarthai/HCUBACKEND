import React, { useState } from "react";
import "../css/UserListAppointmentUser.css";
import { Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import NavbarUserComponent from "../components_user/NavbarUserComponent";
import item1 from "../picture/calendar-dark.png";
import item2 from "../picture/calen-search.png";
import item3 from "../picture/clock-dark.png";
import item4 from "../picture/close.png";

    
const ListAppointmentUser = () => {

  const [isOpenPop, setIsOpenPop] = useState(false);

  const handleOpenPopup = () => {
      setIsOpenPop(true); // เปิด Popup 1
  };
  const handleClosePopup = () => {
      setIsOpenPop(false); // ปิด Popup 1
  };
  
  return (
    <div className="user">
      <header className="user-header">
        <div className="AppointList-header-txt">
          <h2>รายการนัดหมาย</h2>
          <h3>นัดหมายทั้งหมด</h3>
        </div>
        <div className="AppointList-header-navbar">
          <NavbarUserComponent />
        </div>
      </header>

      <div className="user-body">
        <div className="AppointList-body-searchItem">
          <p className="AppointList-body-searchItem-txt">ค้นหา</p>
          <img className="mini-card-icon" src={item2} alt="icon-search" />
        </div>

        <div className="AppointList-body-card">
          <div className="AppointList-body-card-item">
              <p className="AppointList-body-card-item-outDate">19/12/2023</p>
              <div className="AppointList-body-card-item-innerCard">
                  <p className="AppointList-body-card-item-innerCard-ClinicName">คลินิกทั่วไป</p>
                  <div className="AppointList-body-card-item-innerCard-DescDate">
                    <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                    <p className="AppointList-body-card-item-innerCard-DescDate-txt">19/12/2023</p>
                  </div>

                  <div className="AppointList-body-card-item-innerCard-TimeAndClick">
                    <div className="AppointList-body-card-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="AppointList-body-card-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>
                    <div className="AppointList-body-card-item-innerCard-DescClick" onClick={handleOpenPopup}>
                      คลิกเพื่อดูรายละเอียด
                    </div>
                    <Popup className="Popup-ListAppointment" open={isOpenPop} onClose={() => setIsOpenPop(false)}>
                                    <div className="Popup-ListAppointment-ref">
                                      <div className="Popup-ListAppointment-ref-ClinicNameAndCloseBtn">
                                        <p className="Popup-ListAppointment-ref-ClinicName">คลินิกทั่วไป</p>
                                        <img className="PopupCloseBtn" src={item4} alt="icon-close" onClick={handleClosePopup}/>
                                      </div>
                                      <div className="Popup-ListAppointment-ref-DescDate">
                                        <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                                        <p className="Popup-ListAppointment-ref-DescDate-txt">19/12/2023</p>
                                      </div>
                                      <div className="Popup-ListAppointment-ref-DescTime">
                                        <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                                        <p className="Popup-ListAppointment-ref-DescTime-txt">10:00 - 16:00</p>
                                      </div>
                                      <div className="Popup-ListAppointment-ref-CauseSympt">
                                        <p className="Popup-ListAppointment-ref-CauseSympt-Ques">สาเหตุการนัดหมาย</p>
                                        <p className="Popup-ListAppointment-ref-CauseSympt-Ans">: ตรวจรักษาโรค</p>
                                      </div>
                                      <div className="Popup-ListAppointment-ref-BasicSympt">
                                        <p className="Popup-ListAppointment-ref-BasicSympt-Ques">อาการเบื้องต้น</p>
                                        <p className="Popup-ListAppointment-ref-BasicSympt-Ans">: มีอาการปวดหัว อาเจียน</p>
                                      </div>
                                    </div>
                                </Popup>
                  </div>
              </div>
          </div>

          <div className="AppointList-body-card-item">
              <p className="AppointList-body-card-item-outDate">14/12/2023</p>
              <div className="AppointList-body-card-item-innerCard">
                  <p className="AppointList-body-card-item-innerCard-ClinicName">คลินิกทั่วไป</p>
                  <div className="AppointList-body-card-item-innerCard-DescDate">
                    <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                    <p className="AppointList-body-card-item-innerCard-DescDate-txt">14/12/2023</p>
                  </div>

                  <div className="AppointList-body-card-item-innerCard-TimeAndClick">
                    <div className="AppointList-body-card-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="AppointList-body-card-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>
                    <div className="AppointList-body-card-item-innerCard-DescClick" onClick={handleOpenPopup}>
                      คลิกเพื่อดูรายละเอียด
                    </div>
                    
                  </div>
              </div>
          </div>
          
        </div>

        <div className="AppointList-body-BetweenCard">
          <p className="AppointList-body-BetweenCard-txt">------------- ดำเนินการนัดหมายสำเร็จ -------------</p>
        </div>


        <div className="AppointList-body-cardCommited">
          <div className="AppointList-body-cardCommitted-item">
              <p className="AppointList-body-cardCommitted-item-outDate">19/12/2023</p>
              <div className="AppointList-body-cardCommitted-item-innerCard">
                <div className="AppointList-body-cardCommitted-item-innerCard-ClinicAndStatus">
                  <p className="AppointList-body-cardCommitted-item-innerCard-ClinicName">คลินิกทั่วไป</p>
                  <p className="AppointList-body-cardCommitted-item-innerCard-StatusGreen">สำเร็จ</p>
                </div>
                  <div className="AppointList-body-cardCommitted-item-innerCard-DescDate">
                    <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                    <p className="AppointList-body-cardCommitted-item-innerCard-DescDate-txt">19/12/2023</p>
                  </div>

                  <div className="AppointList-body-cardCommitted-item-innerCard-TimeAndClick">
                    <div className="AppointList-body-cardCommitted-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="AppointList-body-cardCommitted-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>
                  </div>
              </div>
          </div>

          <div className="AppointList-body-cardCommitted-item">
              <p className="AppointList-body-cardCommitted-item-outDate">19/12/2023</p>
              <div className="AppointList-body-cardCommitted-item-innerCard">
                <div className="AppointList-body-cardCommitted-item-innerCard-ClinicAndStatus">
                  <p className="AppointList-body-cardCommitted-item-innerCard-ClinicName">คลินิกทั่วไป</p>
                  <p className="AppointList-body-cardCommitted-item-innerCard-StatusRed">ยกเลิกแล้ว</p>
                </div>
                  <div className="AppointList-body-cardCommitted-item-innerCard-DescDate">
                    <img className="mini-card-icon" src={item1} alt="icon-calen"/>
                    <p className="AppointList-body-cardCommitted-item-innerCard-DescDate-txt">19/12/2023</p>
                  </div>

                  <div className="AppointList-body-cardCommitted-item-innerCard-TimeAndClick">
                    <div className="AppointList-body-cardCommitted-item-innerCard-DescTime">
                      <img className="mini-card-icon" src={item3} alt="icon-clock"/>
                      <p className="AppointList-body-cardCommitted-item-innerCard-DescTime-txt">10:00 - 16:00</p>
                    </div>
                  </div>
              </div>
          </div>

        </div>

        <div className="AppointList-body-returnButton">
          <button className="return-btn">ย้อนกลับ</button>
        </div>
      </div>
      
    </div>
  );
};

export default ListAppointmentUser;
