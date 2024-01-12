import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";

const AppointmentManagerComponent = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
        setAllAppointmentUsersData([]);

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




    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic } = state
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [loading, setLoading] = useState(true);
    const animationFrameRef = useRef();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const { user, userData } = useUserAuth();
    const [timetable, setTimetable] = useState([])
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    const [alluserdata, setAllUserData] = useState([]);
    const [userDataFetched, setUserDataFetched] = useState(false);
    const fetchAllUserData = async () => {
        try {
            if (user && !userDataFetched) {
                const allUserCollection = collection(db, 'users');
                const allUserSnapshot = await getDocs(allUserCollection);

                const timeTableData = allUserSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (timeTableData.length > 0) {
                    setAllUserData(timeTableData);
                    setUserDataFetched(true);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    const fetchTimeTableData = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const timeTableCollection = collection(db, 'timeTable');
                const timeTableSnapshot = await getDocs(timeTableCollection);

                const timeTableData = timeTableSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (timeTableData.length > 0) {
                    const filteredTimeTableData = timeTableData.filter(
                        (item) => item.addDay === selectedDate.dayName && item.clinic === "คลินิกทั่วไป"
                    );

                    if (filteredTimeTableData.length > 0) {
                        const allTimeableLists = filteredTimeTableData.reduce((acc, item) => {
                            if (item.timeablelist && Array.isArray(item.timeablelist)) {
                                acc.push(
                                    ...item.timeablelist.map((timeSlot, index) => ({
                                        ...timeSlot,
                                        timeTableId: item.id,
                                        timeSlotIndex: index
                                    }))
                                );
                            }
                            return acc;
                        }, []);

                        const appointmentsCollection = collection(db, 'appointment');
                        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));

                        const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);

                        if (existingAppointments.length > 0) {
                            console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);
                        } else {
                            console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                        }

                        const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
                            !existingAppointments.some(existingSlot =>
                                existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
                            )
                        );



                        console.log("availableTimeSlots", availableTimeSlots)
                        const initialIsChecked = availableTimeSlots.reduce((acc, timetableItem) => {
                            acc[timetableItem.id] = timetableItem.status === "Enabled";
                            return acc;
                        }, {});

                        setIsChecked(initialIsChecked);

                        const timeOptionsFromTimetable = [
                            { label: "กรุณาเลือกช่วงเวลา", value: "", disabled: true, hidden: true },
                            ...availableTimeSlots
                                .sort((a, b) => {
                                    const timeA = new Date(`01/01/2000 ${a.start}`);
                                    const timeB = new Date(`01/01/2000 ${b.start}`);
                                    return timeA - timeB;
                                })
                                .map((timeSlot) => ({
                                    label: `${timeSlot.start} - ${timeSlot.end}`,
                                    value: { timetableId: timeSlot.timeTableId, timeSlotIndex: timeSlot.timeSlotIndex },
                                })),
                        ];

                        console.log("Before setTimeOptions", timeOptionsFromTimetable);
                        setTimeOptions(timeOptionsFromTimetable);
                        console.log("After setTimeOptions", timeOptionsFromTimetable);
                    } else {
                        console.log("Time table not found for selected day and clinic");
                        const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                        setTimeOptions([noTimeSlotsAvailableOption]);
                    }

                } else {
                    console.log("Time table not found");
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    const [userDataAppointmentFetched, setUserDataAppointmentFetched] = useState(false);

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const appointmentsCollection = collection(db, 'appointment');
                const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));

                const timeTableCollection = collection(db, 'timeTable');
                const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                    const appointmentData = doc.data();
                    return {
                        appointmentId: doc.id,
                        ...appointmentData,
                    };
                });



                console.log("existingAppointments",existingAppointments)

                if (existingAppointments.length > 0) {
                    console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);

                    const AppointmentUsersDataArray = [];

                    await Promise.all(existingAppointments.map(async (appointment) => {
                        const timeSlotIndex = appointment.appointmentTime.timeSlotIndex
                        const timeTableId = appointment.appointmentTime.timetableId
                        const timetableDocRef = doc(timeTableCollection, timeTableId);
                        const timetableDocSnapshot = await getDoc(timetableDocRef);
                        const timetableData = timetableDocSnapshot.data();
                        console.log("Timetable Data:", timetableData);
                        const timeslot = timetableData.timeablelist[timeSlotIndex]
                        console.log("Timeslot info",timeslot)
                        if (timetableDocSnapshot.exists()) {
                        // Document exists, you can access its data
                        
                        } 
                        else {
                        console.log("No such document with ID:", timeTableId);
                        }
                        const userDetails = await getUserDataFromUserId(appointment.appointmentId,timeslot);

                        if (userDetails) {
                            AppointmentUsersDataArray.push(userDetails);
                            console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                        } else {
                            console.log("No user details found for appointmentId", appointment.appointmentId);
                        }
                    }));

                    // อัปเดต state ด้วยข้อมูลผู้ใช้ทั้งหมด
                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        console.log("AppointmentUsersData", AppointmentUsersData)
                    } else {
                        console.log("No user details found for any appointmentId");
                    }

                    console.log("AppointmentUsersDataArray", AppointmentUsersDataArray)
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                    console.log("AppointmentUsersData", AppointmentUsersData)
                    fetchUserDataWithAppointments();

                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        } finally {
            setUserDataAppointmentFetched(true);
        }
    };

    const getUserDataFromUserId = async (userId,timeslot) => {
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

        if (userQuerySnapshot.empty) {
            console.log("No user found with id:", userId);
            return null;
        }
        <u></u>
        const userDatas = userQuerySnapshot.docs[0].data();
        userDatas.timeslot = timeslot;
        console.log("User Data for userId", userId, ":", userDatas);
        console.log("userDatas",userDatas)
        console.log("testxd",userDatas.timeslot.start)
        return userDatas;
    };

    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        fetchTimeTableData();
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



        if (!userDataFetched) {
            fetchAllUserData();
        }
        if (!userDataAppointmentFetched) {
            fetchUserDataWithAppointments();
        }
        console.log("AppointmentUsersData XD", AppointmentUsersData)
        console.log("All user Data", alluserdata)
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [selectedDate, alluserdata, userDataFetched]);
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
        e.preventDefault();

        try {

            const appointmentInfo = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime,
                appointmentId: appointmentId || null,
                appointmentCasue,
                appointmentSymptom,
                appointmentNotation,
                clinic: "คลินิกทั่วไป",
            };

            const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
            console.log('Succuessful adddoc', appointmentInfo)
            console.log(appointmentId)
            console.log(appointmentRef.id)
            console.log("Newly created appointment ID:", appointmentRef.id);
            const foundUser = alluserdata.find(user => user.id === appointmentId);
            const usersCollection = collection(db, 'users');


            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));

            if (!userQuerySnapshot.empty) {

                const userId = userQuerySnapshot.docs[0].id;


                console.log("User's collection ID:", userId);
            } else {
                console.log("No user found with the specified appointmentId");
            }
            if (foundUser) {
                console.log("Found user:", foundUser);

            } else {
                console.log("User not found in alluserdata");
            }
            if (foundUser) {
                console.log("Found user:", foundUser);
                const userId = userQuerySnapshot.docs[0].id;

                const userDocRef = doc(db, 'users', userId);

                await updateDoc(userDocRef, {
                    appointments: arrayUnion(appointmentRef.id),
                });

                console.log("User document updated with new appointment.");

            } else {
                console.log("User not found in alluserdata");
            }


            Swal.fire({
                icon: "success",
                title: "Appointment Successful!",
                text: "Your appointment has been successfully created!",
            });
            fetchTimeTableData();

        } catch (firebaseError) {
            console.error('Firebase signup error:', firebaseError);

            console.error('Firebase error response:', firebaseError);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create user account. Please try again later.",
            });
        }
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

    const DeleteAppointment = () => {

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
                try {
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
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการนัดหมาย</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
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
                        {AppointmentUsersData.map((AppointmentUsersData, index) => (
                            <div className="box-userapointment">

                                    <div className="time-apppoint textBody-medium" onClick={openDetailAppointment}>{AppointmentUsersData.timeslot.start}-{AppointmentUsersData.timeslot.end}</div>
                                    <div className="appoint-info">
                                        <div className="user-appointment-info flex-column" onClick={openDetailAppointment}>
                                            <p id="student-id" className="textBody-huge">{AppointmentUsersData.id}</p>
                                            <p id="student-name" className="textBody-medium">{`${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`}</p>
                                        </div>
                                        <div className="appointment-function">
                                            <img src={edit} className="icon" onClick={openEditAppointment} />
                                            <img src={icon_delete} className="icon" onClick={DeleteAppointment} />
                                        </div>
                                    </div>
                            </div>
                        ))}
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
                        <form onSubmit={submitForm}>
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
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        handleSelectChange();
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && typeof selectedValue === 'object') {
                                            const { timetableId, timeSlotIndex } = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: { timetableId, timeSlotIndex },
                                                },
                                            });

                                            handleSelectChange();
                                        } else if (e.target.value === "") {
                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: {},
                                                },
                                            });

                                            handleSelectChange();
                                        } else {
                                            console.error("Invalid selected value:", selectedValue);
                                        }
                                    }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    {timeOptions.map((timeOption, index) => (
                                        <option key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`} value={JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                            {timeOption.label}
                                        </option>
                                    ))}

                                </select>


                            </div>
                            <div>
                                <label className="textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
                            </div>
                            <div>
                                <label className="textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" />
                            </div>
                            <div>
                                <label className="textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" />
                            </div>
                            <div>
                                <label className="textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวักทั่วไป" />
                            </div>
                            <button type="button" onClick={openAddAppointment} className="btn-secondary" id="btn-systrm">กลับ</button>
                            <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary" id="btn-systrm" target="_parent" />
                        </form>
                    </div>
                    <div id="edit-appointment" className="colorPrimary-800">
                        <form onSubmit={submitEditForm}>
                            <h3 className="center">แก้ไขนัดหมาย</h3>
                            <div className="center-container">
                                <label className="textBody-large colorPrimary-800">วันที่</label>
                                <input type="date" className="form-control"></input>
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
