import { useEffect, useState, useRef } from "react";
import "../css/UserHistoryAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import item1 from "../picture/calendar-dark.png";
import item2 from "../picture/calen-search.png";
import item3 from "../picture/clock-dark.png";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
const UserHistoryAppointment = (prop) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    appointmentDate: "",
    userID: "",
  })
  const handleDateSelect = (selectedDate) => {
    console.log("Selected Date in AppointmentManager:", selectedDate);
    setAllAppointmentUsersData([]);
    setSelectedDate(selectedDate);
    
    if (!isInitialRender) {
        console.log("location",selectedDate)
      navigate('/appointment/date', { state: { selectedDate } });
    }
  };
  const { user, userData } = useUserAuth();

  const DeleteAppointment = async (AppointmentUserData, appointmentuid, uid) => {
    const timetableRef = doc(db, 'appointment', appointmentuid);

    Swal.fire({
      title: 'ยกเลิกสิทธิ์',
      html: `วันที่ ${AppointmentUserData.appointment.appointmentDate} </br>` + `เวลา ${AppointmentUserData.timeslot.start} - ${AppointmentUserData.timeslot.end}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยกเลิกสิทธิ์',
      cancelButtonText: '<span style="color: #444444;">ยกเลิก</span>',
      confirmButtonColor: '#DC2626',
      cancelButtonColor: `rgba(68, 68, 68, 0.13)`,
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

              title: 'ยกเลิกสิทธิ์สำเร็จ',
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
            title: 'ยกเลิกสิทธิ์ไม่สำเร็จ',
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

  const inputValue = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };
  const { appointmentDate, userID } = state
  const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
  const [timeOptionss, setTimeOptionss] = useState([]);
  const [isChecked, setIsChecked] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedDateFromLocation = location.state?.selectedDate || null;

  const getUserDataFromUserId = async (appointment, userId, timeslot, appointmentuid) => {
    const usersCollection = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

    if (userQuerySnapshot.empty) {
      console.log("No user found with id:", userId);
      return null;
    }

    <u></u>
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
  const [isAlreadyFetch, setIsAlreadyFetch] = useState(false);
  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);

    if (userData) {
      setState((prevState) => ({
        ...prevState,
        userID: userData.id,
      }));
    }

    if (!selectedDate) {
      fetchUserDataNoDateWithAppointments();
      console.log("TEST",AppointmentUsersData);
      setIsAlreadyFetch(true);
    }


  }, [userData, selectedDate]);

  useEffect(() => {
    console.log("Updated selectedDate:", selectedDate);
    fetchUserDataWithAppointments();
    console.log(selectedDate);
  }, [selectedDate, userData]);

  useEffect(() => {
    console.log("Updated Appointment:", AppointmentUsersData);
    if (!selectedDateFromLocation) {
      console.log("check");
    } else if (!isInitialRender) {
      console.log("hello world");
    } else {
      setSelectedDate(selectedDateFromLocation);
      console.log("date check", selectedDateFromLocation);
      fetchUserDataWithAppointments();
      setIsInitialRender(false);
    }
  }, [AppointmentUsersData]);

  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchUserDataNoDateWithAppointments = async () => {
    try {

        const appointmentsCollection = collection(db, 'appointment');
        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, 
          where('appointmentId', '==', userData.id)));

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
          console.log("existingAppointments", existingAppointments);

          const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
            const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
            const timeTableId = appointment.appointmentTime.timetableId;

            try {
              const timetableDocRef = doc(timeTableCollection, timeTableId);
              const timetableDocSnapshot = await getDoc(timetableDocRef);

              if (timetableDocSnapshot.exists()) {
                const timetableData = timetableDocSnapshot.data();
                console.log("Timetable Data:", timetableData);
                const timeslot = timetableData.timeablelist[timeSlotIndex];
                console.log("Timeslot info", timeslot);

                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);

                if (userDetails) {
                  console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                  return userDetails;
                } else {
                  console.log("No user details found for appointmentId", appointment.appointmentId);
                  return null;
                }
              } else {
                console.log("No such document with ID:", timeTableId);
                return null;
              }
            } catch (error) {
              console.error('Error fetching timetable data:', error);
              return null;
            }
          }));

          const filteredAppointmentUsersDataArray = AppointmentUsersDataArray.filter(userDetails => userDetails !== null);

          if (filteredAppointmentUsersDataArray.length > 0) {
            setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
            console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
          } else {
            console.log("No user details found for any appointmentId");
          }

          console.log("AppointmentUsersDataArray", filteredAppointmentUsersDataArray);
          setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
          console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
        } else {
          console.log(`No appointments found`);
        }
      
    } catch (error) {
      console.error('Error fetching user data with appointments:', error);
    }
  };

  const fetchUserDataWithAppointments = async () => {
    try {
      if (user && selectedDate && selectedDate.dayName) {
        const appointmentsCollection = collection(db, 'appointment');
        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
          `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
          where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
          where('appointmentId', '==', userData.id)));

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
          console.log("existingAppointments", existingAppointments);
          console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);

          const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
            const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
            const timeTableId = appointment.appointmentTime.timetableId;

            try {
              const timetableDocRef = doc(timeTableCollection, timeTableId);
              const timetableDocSnapshot = await getDoc(timetableDocRef);

              if (timetableDocSnapshot.exists()) {
                const timetableData = timetableDocSnapshot.data();
                console.log("Timetable Data:", timetableData);
                const timeslot = timetableData.timeablelist[timeSlotIndex];
                console.log("Timeslot info", timeslot);

                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);

                if (userDetails) {
                  console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                  return userDetails;
                } else {
                  console.log("No user details found for appointmentId", appointment.appointmentId);
                  return null;
                }
              } else {
                console.log("No such document with ID:", timeTableId);
                return null;
              }
            } catch (error) {
              console.error('Error fetching timetable data:', error);
              return null;
            }
          }));

          const filteredAppointmentUsersDataArray = AppointmentUsersDataArray.filter(userDetails => userDetails !== null);

          if (filteredAppointmentUsersDataArray.length > 0) {
            setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
            console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
          } else {
            console.log("No user details found for any appointmentId");
          }

          console.log("AppointmentUsersDataArray", filteredAppointmentUsersDataArray);
          setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
          console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
        } else {
          console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user data with appointments:', error);
    }
  };



  const renderStatusClass = (status) => {
    switch (status) {
        case 'ยืนยันสิทธิ์แล้ว':
            return 'user-appointment-status2';
        case 'เสร็จสิ้น':
            return 'user-appointment-status';
        case 'ไม่สำเร็จ':
            return 'user-appointment-status1';
        case 'ลงทะเบียนแล้ว':
            return 'user-appointment-status3';
        default:
            return 'user-appointment-status3 ';
    }
};
const getDayName = (date) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};

const formatDateForDisplay = (isoDate) => {
  const dateParts = isoDate.split("-");
  if (dateParts.length === 3) {
      setAllAppointmentUsersData([]);
      const [year, month, day] = dateParts;
      const formattedMonth = parseInt(month, 10);
      const formattedDay = parseInt(day, 10);
      const formattedYear = parseInt(year, 10);
      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

      const dayName = getDayName(new Date(isoDate)).toLowerCase();
      const formattedSelectedDate = {
          day: formattedDay,
          month: formattedMonth,
          year: formattedYear,
          dayName: dayName,
      };
      setAllAppointmentUsersData([]);
      setSelectedDate(formattedSelectedDate);
      setState({
          ...state,
          appointmentDate: `${formattedSelectedDate.day}/${formattedSelectedDate.month}/${formattedSelectedDate.year}`,
          appointmentTimes: "",
      });
      console.log("formattedSelectedDate", formattedSelectedDate);
      return formattedDate;
  }
  return isoDate;
};
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
          <label className="textBody-huge colorPrimary-800">ค้นหา</label>
          <div className="center-container">
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                    inputValue("appointmentDate")(e);
                                    const formattedDate = formatDateForDisplay(e.target.value);
                                    console.log("Formatted Date:", formattedDate);
                                }}
                            />
                        </div>
        </div>

        <div className="HistoryAppointment-body-card">

        {AppointmentUsersData.length > 0 ?
                        AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => ( 
          <div className="HistoryAppointment-body-card-item">
            <p className="HistoryAppointment-body-card-item-outDate colorPrimary-800">{AppointmentUserData.appointment.appointmentDate} </p>
            <div className="HistoryAppointment-body-card-item-innerCard">
              <div className="HistoryAppointment-body-card-item-innerCard-TypeAppAndStatus">
                <h1 className="HistoryAppointment-body-card-item-innerCard-Typeappointment">ยกเลิกนัดหมาย</h1>
                <div className={`${renderStatusClass(AppointmentUserData.appointment.status)}`}>
                                                    {AppointmentUserData.appointment.status}
                                                </div>
              </div>

              <h2 className="HistoryAppointment-body-card-item-innerCard-ClinicName">{AppointmentUserData.appointment.clinic}</h2>

              <div className="HistoryAppointment-body-card-item-innerCard-DescDate">
                <img className="mini-card-icon" src={item1} alt="icon-calen" />
                <p className="HistoryAppointment-body-card-item-innerCard-DescDate-txt">{AppointmentUserData.appointment.appointmentDate} </p>
              </div>


              <div className="HistoryAppointment-body-card-item-innerCard-DescTime">
                <img className="mini-card-icon" src={item3} alt="icon-clock" />
                <p className="HistoryAppointment-body-card-item-innerCard-DescTime-txt">10:00 - 16:00</p>
              </div>

            </div>
          </div>
          )) : (
            <div className="user-DateAppointment-card_noAppointment gap-16">
                            <h2 className="user-DateAppointment-noAppointment center">No appointments available</h2>
                        </div>
          )};             
          

        </div>


      </div>

      <div className="HistoryAppointment-body-returnButton">
        <button className="return-btn">ย้อนกลับ</button>
      </div>
    </div>


  );
}
export default UserHistoryAppointment;