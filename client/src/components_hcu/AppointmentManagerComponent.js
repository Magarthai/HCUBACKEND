import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";

const AppointmentManagerComponent = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (selectedDate) => {
    console.log("Selected Date in AppointmentManager:", selectedDate);
    setSelectedDate(selectedDate); // Update the selected date state
    // You can perform any additional actions based on the selected date
  };
    const [state, setState] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentId: "",
        appointmentCasue: "",
        appointmentSymptom: "",
        appointmentNotation: "",
        clinic: ""
    })


    const {appointmentDate,appointmentTime,appointmentId,appointmentCasue,appointmentSymptom,appointmentNotation,clinic} = state
    const inputValue = (name) => (event) => {
        if (name === "addDay") {
            setState({ ...state, [name]: event.target.value });
        } else {
            setState({ ...state, [name]: event.target.value });
        }
    };

    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1); 
    const [loading, setLoading] = useState(true); // Added loading state
    const animationFrameRef = useRef();
    const { user, userData } = useUserAuth();

    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        
       
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };
        console.log(selectedDate)
        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
  
    // Fetch user data when the component mounts
    
  
        return () => {
        cancelAnimationFrame(animationFrameRef.current);
        window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user,selectedDate]); 
    const containerStyle = {
    zoom: zoomLevel,
    };


    function getShowTime() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;

    const [selectedCount, setSelectedCount] = useState(1);

    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)
    };

    const submitForm = async (e) => {
  
    };
    const submitEditForm = async (e) => {
  
    };

    const openDetailAppointment = (element) => {
        let x = document.getElementById("detail-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("edit-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";

        } else {
            x.style.display = "none";


        }
    }
    const openAddAppointment = () => {
        let x = document.getElementById("add-appointment");
        let y = document.getElementById("detail-appointment");
        let z = document.getElementById("edit-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";

        } else {
            x.style.display = "none";


        }
        
    }

    const openEditAppointment = () => {
        let x = document.getElementById("edit-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("detail-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";

        } else {
            x.style.display = "none";


        }
        
    }

    const DeleteAppointment = ()  => {
    
        Swal.fire({
            title: 'ลบนัดหมาย',
            text: `วันที่ 15/12/2023 เวลา 13:01 - 13:10`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#DC2626',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                try{
                    Swal.fire(
                        {
                            title: 'Deleted!',
                            text: `ลบนัดหมายสำเร็จ`,
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        })
                        // .then((result) => {
                        //     if (result.isConfirmed) {
                                
                        //     }
                        // });
                } catch {

                }
                
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'Deleted!',
                        text: `ลบนัดหมายไม่สำเร็จ`,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }
                )
            }
        })

    }

    

    return (
        <div className="appointment" style={containerStyle}>
            <NavbarComponent />
            <div className="topicBox">
                <div></div>
                <div>
                    <h1 className="colorPrimary-800 center">ระบบการจัดการนัดหมาย</h1>
                </div>
                <div className="dateTime">
                    <p className="textBody-large">Date : {currentDate}</p>
                    <p className="textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <div className="clinic">
                <a href="/appointmentAdmin" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกกายภาพ</a>
                <a href="/AppointmentManagerComponent" target="_parent" >คลินิกฝั่งเข็ม</a>
                <a href="/" target="_parent" id="appointment-request-list">รายการขอนัดหมาย</a>
            </div>
            <div className="flex">
            <CalendarAdminComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onDateSelect={handleDateSelect}
      />
                <div className="box">
                    <div >
                        <div className="appointment-hearder">
                            <div className="colorPrimary-800 appointment-hearder-item">
                                <h3>นัดหมายคลินิกทั่วไป</h3>
                                <p className="textBody-large">
                  {selectedDate
                    ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                    : `${date}/${month}/${year}`}
                </p>

                            </div>
                            <button type="button" className="appointment-hearder-item" onClick={openAddAppointment}>เพิ่มนัดหมาย +</button>
                        </div>
                        <div className="box-list">
                            <div className="box-userapointment" >
                                <div className="time-apppoint textBody-medium" onClick={openDetailAppointment}>13:01-13:06</div>
                                <div className="appoint-info">
                                    <div className="user-appointment-info flex-column"  onClick={openDetailAppointment}>
                                        <p id="student-id" className="textBody-huge">64090500440</p>
                                        <p id="student-name" className="textBody-medium">uvuvwevwevwe onyetenyevwe</p>
                                    </div>
                                    <div className="appointment-function">
                                        <img src={edit} className="icon"  onClick={openEditAppointment}/>
                                        <img src={icon_delete} className="icon" onClick={DeleteAppointment}/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="box">
                    <div id="detail-appointment" className="colorPrimary-800">
                        <h3 className="center">รายละเอียนัดหมาย</h3>
                        <p id="detail-appointment-date" className="textBody-big"><b>วันที่</b> : 13/12/2023</p>
                        <p id="detail-appointment-time" className="textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="textBody-big"><b>หมายเหตุ</b>: -</p>


                    </div>
                    <div id="add-appointment" className="colorPrimary-800">
                        <form onSubmit={submitEditForm}>
                            <h3 className="center">เพิ่มนัดหมาย</h3>
                            <div>
                                <label className="textBody-large colorPrimary-800">วันที่</label>
                                <p className="textBody-big">{selectedDate
                    ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                    : "Select a date"}</p>
                            </div>
                            <div>
                                <label className="textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="time"
                                    value={appointmentTime}
                                    onChange={(e) => { inputValue("appointmentTime")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                            >
                            <option value="" disabled> กรุณาเลือกช่วงเวลา </option>
                            </select>
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="64000000000" />
                        </div>
                            <button type="button" onClick={openAddAppointment} className="btn-secondary" id="btn-systrm">กลับ</button>
                            <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary" id="btn-systrm" target="_parent" />
                        </form>
                    </div>
                    <div id="edit-appointment" className="colorPrimary-800">
                    <form onSubmit={submitForm}>
                            <h3 className="center">แก้ไขนัดหมาย</h3>
                            <div className="center-container">
                                <label className="textBody-large colorPrimary-800">วันที่</label>
                                <br></br>
                                <div className="datepicker">
                                <DatePicker
                className="select-date-appointment"
                selected={selectedDate instanceof Date ? selectedDate : null}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                popperPlacement="bottom-end"
                popperModifiers={{
                  flip: {
                    behavior: ['bottom'],
                  },
                  preventOverflow: {
                    enabled: true,
                    padding: 10,
                  },
                }}
              />
            </div>
                            </div>
                            <div> 
                                <label className="textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="time"
                                    value={appointmentTime}
                                    onChange={(e) => { inputValue("appointmentTime")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                            >
                            <option value="" disabled> กรุณาเลือกช่วงเวลา </option>
                            </select>
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="64000000000" />
                        </div>
                        <div>
                            <label className="textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="64000000000" />
                        </div>
                            <button type="button" onClick={openEditAppointment} className="btn-secondary" id="btn-systrm">กลับ</button>
                            <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary" id="btn-systrm" target="_parent" />
                        
                        </form>
                    </div>
                </div>
               
            </div>





        </div>
    );
}

export default AppointmentManagerComponent;