import { useEffect, useState, useRef } from "react";
import "../css/UserAllAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import icon1 from '../picture/calendar-flat.png';
import icon2 from '../picture/clock-flat.png';
import Popup from 'reactjs-popup';
import { useUserAuth } from "../context/UserAuthContext";
import icon_submit from '../picture/tick-circle.png';
import icon_cancel from '../picture/close-circle.jpg';
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { startOfWeek, endOfWeek, parse ,isWithinInterval } from 'date-fns';
import Swal from 'sweetalert2';
const UserAllAppointment = () => {
    
    const { user, userData } = useUserAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);

    useEffect(() => {
        document.title = 'Health Care Unit';

        setSelectedDate(formattedSelectedDate)
        
        let statusElementDetail = document.getElementById("detail-appointment-status");

        if (statusElementDetail) {
            if (statusElementDetail.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
                console.log("Adding Class...");
                statusElementDetail.classList.add("confirmed-background");
            }
            else if (statusElementDetail.textContent.trim() === 'เสร็จสิ้น') {
                statusElementDetail.classList.add("completed-background");
            }
            else if (statusElementDetail.textContent.trim() === 'ไม่สำเร็จ') {
                statusElementDetail.classList.add("failed-background");
            }
            else if (statusElementDetail.textContent.trim() === 'รอยืนยันสิทธ์') {
                statusElementDetail.classList.add("pending-confirmation-background");
            }
        }

        fetchUserDataWithAppointments();

        console.log("AppointmentUsersData")

    }, [user,userData]);

    
    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const formattedSelectedDate = {
        day: date,
        month: month,
        year: year,
        dayName: day,
    };



    const handleApprove = async (id, AppointmentUserData) => {
        Swal.fire({
            title: 'Confirm',
            text: `ยินยันคิว ${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันสิทธ์แล้ว',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#DC2626',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const docRef = doc(db, 'appointment', id);
                    updateDoc(docRef, { status: "ยืนยันสิทธ์แล้ว" }).catch(error => {
                        console.error('Error updating timetable status:', error);
                    });

                    Swal.fire(
                        {
                            title: 'Updated!',
                            text: `อัพเดตคิวเสร็จสิ้น`,
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            fetchUserDataWithAppointments();
                        }
                    });
                } catch {

                }

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'Deleted!',
                        text: `อัพเดตคิวไม่สำเร็จ`,
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



    };



    const statusElements = document.querySelectorAll('.admin-queue-card-status p');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';
        }
        else if (element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F';
        }
        else if (element.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            element.style.color = '#D88C09';
        }
        else if (element.textContent.trim() === 'รอยืนยันสิทธ์') {
            element.style.color = '#A1A1A1';
        }
    }

    statusElements.forEach(changeStatusTextColor);

    const DeleteAppointment = async (appointmentuid, uid) => {
        const timetableRef = doc(db, 'appointment', appointmentuid);
    
        Swal.fire({
            title: 'ยกเลิกสิทธิ์',
            text: `กดยืนยันเพื่อยกเลิกสิทธิ์`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#DC2626',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await deleteDoc(timetableRef);
        
                console.log("Appointment deleted:", appointmentuid);
        
                const userRef = doc(db, "users", uid);

                await updateDoc(userRef, {
                  "appointments": arrayRemove("appointments", appointmentuid)
                });




                    console.log(appointmentuid);
                    setAllAppointmentUsersData([])
                    fetchUserDataWithAppointments();
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
                    .then((result) => {
                        if (result.isConfirmed) {
                            
                        }

                    });
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
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });  // 0 means Sunday
    const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 });

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                            
                const appointmentsCollection = collection(db, 'appointment');  
                  const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection,
                    where('clinic', '==', 'คลินิกทั่วไป'),
                    where('appointmentId', '==', userData.id),
                  ));


                  
                const timeTableCollection = collection(db, 'timeTable');
                const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                    const appointmentData = doc.data();
                    return {
                        appointmentId: doc.id,
                        appointmentuid: doc.id,
                        ...appointmentData,
                    };
                });


                if (existingAppointments.length > 0) {
                    const AppointmentUsersDataArray = [];

                    for (const appointment of existingAppointments) {
                        console.log("appointment.appointmentDate",appointment.appointmentDate)
                        const appointmentDate = parse(appointment.appointmentDate, 'd/M/yyyy', new Date());
                        console.log("appointmentDate",appointmentDate)
                        if (isWithinInterval(appointmentDate, { start: startOfWeekDate, end: endOfWeekDate })) {
                        const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
                        const timeTableId = appointment.appointmentTime.timetableId;

                        try {
                            const timetableDocRef = doc(timeTableCollection, timeTableId);
                            const timetableDocSnapshot = await getDoc(timetableDocRef);

                            if (timetableDocSnapshot.exists()) {
                                const timetableData = timetableDocSnapshot.data();
                                const timeslot = timetableData.timeablelist[timeSlotIndex];

                                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);

                                if (userDetails) {
                                    AppointmentUsersDataArray.push(userDetails);
                                
                                } else {
                                  
                                }
                            } else {

                            }
                        } catch (error) {
                            console.error('Error fetching timetable data:', error);
                        }
                           }   }

                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        
                    } else {
 
                    }

                  
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                   
                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };

    const getUserDataFromUserId = async (appointment, userId, timeslot, appointmentuid) => {
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

        if (userQuerySnapshot.empty) {
            console.log("No user found with id:", userId);
            return null;
        }

        const userUid = userQuerySnapshot.docs[0].id;
        const userDatas = userQuerySnapshot.docs[0].data();
        userDatas.timeslot = timeslot;
        userDatas.appointment = appointment;
        userDatas.appointmentuid = appointmentuid;
        userDatas.userUid = userUid;
        console.log("User Data for userId", userId, ":", userDatas);
        console.log("userDatas", userDatas)
        console.log("testxd", userDatas.timeslot.start)
        return userDatas;
    };



    return(
        <div id='user-appointment-xd'>
            <div className="UserAllAppointmetComponent">
                <div className="UserAllAppointmet">
                    <header className="UserAllAppointmet-header">
                        <div>
                        <h1>การนัดหมาย</h1>
                        <h2>รายการ</h2>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="UserAllAppointmet-body">
                        <h2 className='User-appointmentmenu-headbar'>ปฏิทิน</h2>
                        <div className="CalendarUser-appointment">
                            <CalendarUserComponent/>
                        </div>

                        <div className="user-appointment-bar-btn">
                            <h2 className='User-appointmentmenu-headbar'>นัดหมายสัปดาห์นี้</h2>
                            <button className="user-appointment-btn-add"><Link to="/appointment/clinic"><x>เพิ่มนัดหมาย +</x></Link></button>
                        </div>

                        <div className="user-appointment-funtion">
                            {/* แบบยังไม่ยืนยันสิทธิ์ */}
                            {AppointmentUsersData && AppointmentUsersData.length > 0 ? (
                AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                    <div key={index}>
                        {AppointmentUserData.appointment.status === "รอยืนยันสิทธิ์" ? (
                            <div className="user-appointment-card">
                                <label><b className='user-appointment-Bold-letter'>{AppointmentUserData.appointment.clinic}</b></label>

                                {/* ข้อมูลการนัดหมาย */}
                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                    <label>{AppointmentUserData.appointment.appointmentDate}</label>
                                </div>

                                <div className="user-appointment-description1">
                                    <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                    <label>{AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}</label>
                                </div>

                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                    <label>: {AppointmentUserData.appointment.appointmentNotation}</label>
                                </div>

                                <div className="user-appointment-description2">
                                    <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                    <label>: {AppointmentUserData.appointment.appointmentSymptom}</label>
                                </div>

                                <label className="user-appointment-warn">หมายเหตุ</label> <br></br>
                                <label className="user-appointment-warn">: กรุณายืนยันสิทธิ์ก่อน 15 นาที</label>

                                <div className="user-appointment-btn-submit-set">
                                    <button onClick={() => DeleteAppointment(AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid)} className="user-appointment-btn-cancel">ยกเลิกสิทธิ์</button>
                                    <button onClick={() => handleApprove(AppointmentUserData.appointment.appointmentuid, AppointmentUserData)} className="user-appointment-btn-submit">ยืนยันสิทธิ์</button>
                                </div>
                            </div>

                            

                        ) : (
                            <div className="user-appointment-card">

                            <div className="user-header-appointment-card">
                                <label><b className='user-appointment-Bold-letter'>คลินิก</b></label>
                                <div className="user-appointment-status">
                                    เสร็จสิ้น
                                </div>
                            </div>
                            <div className="user-appointment-description1">
                                <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                <lable>05/12/2023</lable>
                            </div>
                            
                            <div className="user-appointment-description1">
                                <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                <lable>10:01 - 10:06</lable>
                            </div>
                            
                            <div className="user-appointment-description2">
                                <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                <lable>: ตรวจรักษาโรค</lable>
                            </div>
                            
                            <div className="user-appointment-description2">
                                <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                <lable>: มีอาการปวดหัว อาเจียน</lable>
                            </div>

                            <lable className="user-appointment-warn">หมายเหตุ</lable> <br></br>
                            <lable className="user-appointment-warn">: กรุณามาก่อนเวลา 10 นาที</lable>
                        </div>
                                
                                )}
                                </div>
                            ))
                        ) : (
                            <div className="user-appointment-card"></div>
                        )}

                            

                        </div>
                    </body>
                    <footer className="UserAllAppointmet-footermenu">
                        <lable class="user-appointment-vertical"><Link to="/appointment/list"><y>นัดหมายทั้งหมด</y></Link></lable>
                        <lable><Link to="/apppointment/history"><y>ประวัติการดำเนิน<br></br>การนัดหมาย</y></Link></lable>
                    </footer>
                </div>
            </div>
        </div>

    )
}

export default UserAllAppointment;
