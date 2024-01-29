import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import app, { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";
import "../css/AdminAppointmentComponent.css";
import { PulseLoader } from "react-spinners";
import { getUserDataFromUserId } from '../backend/getDataFromUserId'
import ClockComponent from "../utils/ClockComponent";
import { GetTimeOptionsFilterdFromTimetable, GetTimeOptionsFromTimetable } from "../backend/timeOptions";
import { availableTimeSlotsNeedle, fetchAppointmentUsersDataNeedle, fetchTimeTableDataNeedle, fetchUserDataWithAppointmentsNeedle } from "../backend/backendNeedle";
import DeleteAppointmentNeedle from "../backend/backendNeedle";
const AppointmentManagerPhysicalComponent = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const { user, userData } = useUserAuth();
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    const [timeOptionss, setTimeOptionss] = useState([]);

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
    };



    const [state, setState] = useState({
        appointmentDate: "",appointmentDates: "",appointmentTime: "",appointmentId: "",appointmentCasue: "",appointmentSymptom: "",appointmentNotation: "",
        clinic: "",time: "",appointmentTime1: "",appointmentTime2: "",appointmentTime3: "",appointmentTime4: "",
        appointmentTime5: "",appointmentTime6: "",appointmentTime7: "",appointmentTime8: "",appointmentTime9: "",
        appointmentTime10: "",appointmentDate1: "",appointmentDate2: "",appointmentDate3: "",appointmentDate4: "",
        appointmentDate5: "",appointmentDate6: "",appointmentDate7: "",appointmentDate8: "",appointmentDate9: "",
        appointmentDate10: "",selectedDate1: "",selectedDate2: "",selectedDate3: "",selectedDate4: "",selectedDate5: "",
        selectedDate6: "",selectedDate7: "",selectedDate8: "",selectedDate9: "",selectedDate10: "",timeOptions1: [],
        timeOptions2: [],timeOptions3: [],timeOptions4: [],timeOptions5: [],timeOptions6: [],timeOptions7: [],
        timeOptions8: [],timeOptions9: [],timeOptions10: [],
    })

    const {
        appointmentDate,appointmentDates,appointmentId,appointmentCasue,appointmentSymptom,
        appointmentNotation,clinic,uid,timeablelist,time,timelength,appointmentTime,appointmentTime1,
        appointmentTime2,appointmentTime3,appointmentTime4,appointmentTime5,appointmentTime6,
        appointmentTime7,appointmentTime8,appointmentTime9,appointmentTime10,appointmentDate1,
        appointmentDate2,appointmentDate3,appointmentDate4,appointmentDate5,selectedDate1,
        selectedDate2,selectedDate3,selectedDate4,selectedDate5,selectedDate6,selectedDate7,selectedDate8,
        selectedDate9,selectedDate10,timeOptions1,timeOptions2,timeOptions3,timeOptions4,
        timeOptions5,timeOptions6,timeOptions7,timeOptions8,timeOptions9,timeOptions10,

    } = state;

    const isSubmitEnabled =
        !appointmentDate || !appointmentTime || !appointmentId;

    const isAutoSubmitEnabled =
        !appointmentDate || !appointmentTime || !appointmentId || !time || !timelength;

    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };
    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)

    };

    const formatDateForDisplay = (isoDate) => {
        const dateParts = isoDate.split("-");
        if (dateParts.length === 3) {
            setAllAppointmentUsersData([]);
            const [year, month, day] = dateParts;
            const formattedMonth = parseInt(month, 10).toString();
            const formattedDate = `${day}/${formattedMonth}/${year}`;

            const dayName = getDayName(new Date(isoDate)).toLowerCase();;
            const formattedSelectedDate = {
                day: day,
                month: formattedMonth,
                year: year,
                dayName: dayName,
            };

            setAllAppointmentUsersData([]);
            setSelectedDate(formattedSelectedDate);
            setState({
                ...state,
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime: "",
            });
            return formattedDate;
        }
        return isoDate;
    }


    const formatDatesForDisplay = (isoDate) => {
        const dateParts = isoDate.split("-");
        if (dateParts.length === 3) {
            setAllAppointmentUsersData([]);
            const [year, month, day] = dateParts;
            const formattedMonth = parseInt(month, 10).toString();
            const formattedDate = `${day}/${formattedMonth}/${year}`;

            const dayName = getDayName(new Date(isoDate)).toLowerCase();;
            const formattedSelectedDate = {
                day: day,
                month: formattedMonth,
                year: year,
                dayName: dayName,
            };
            setAllAppointmentUsersData([]);
            setSelectedDates(formattedSelectedDate);
            setState({
                ...state,
                appointmentDates: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTimes: "",
            });
            return formattedDate;
        }
        return isoDate;
    }

    const fetchMainTimeTableData = async () => {
        try {

            const timeTableData = await fetchTimeTableDataNeedle(user, selectedDate);
            if (timeTableData.length > 0) {
                const filteredTimeTableData = timeTableData
                if (filteredTimeTableData.length > 0) {
                    const availableTimeSlots = await availableTimeSlotsNeedle(filteredTimeTableData, selectedDate, db);
                    console.log("availableTimeSlots",availableTimeSlots)

                    const initialIsChecked = availableTimeSlots.reduce((acc, timetableItem) => {
                        acc[timetableItem.id] = timetableItem.status === "Enabled";
                        return acc;
                    }, {});

                    setIsChecked(initialIsChecked);

                    const timeOptionsFromTimetable = GetTimeOptionsFilterdFromTimetable(availableTimeSlots);
                    setTimeOptions(timeOptionsFromTimetable);
                } else {
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                }
            } else {
                const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                setTimeOptions([noTimeSlotsAvailableOption]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchTimeTableData = async () => {
        try {

            const timeTableData = await fetchTimeTableDataNeedle(user, selectedDate);
            if (timeTableData.length > 0) {
                const filteredTimeTableData = timeTableData
                if (filteredTimeTableData.length > 0) {
                    const availableTimeSlots = await availableTimeSlotsNeedle(filteredTimeTableData, selectedDate, db);
                    console.log("availableTimeSlots",availableTimeSlots)

                    const initialIsChecked = availableTimeSlots.reduce((acc, timetableItem) => {
                        acc[timetableItem.id] = timetableItem.status === "Enabled";
                        return acc;
                    }, {});

                    setIsChecked(initialIsChecked);

                    const timeOptionsFromTimetable = GetTimeOptionsFromTimetable(availableTimeSlots);
                    setTimeOptions(timeOptionsFromTimetable);
                } else {
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                }
            } else {
                const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                setTimeOptions([noTimeSlotsAvailableOption]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const existingAppointments = await fetchUserDataWithAppointmentsNeedle(user, selectedDate);
                console.log("existingAppointments", existingAppointments);
                if (existingAppointments.length > 0) {
                    const AppointmentUsersDataArray = await fetchAppointmentUsersDataNeedle(existingAppointments);
                    console.log("AppointmentUsersDataArray",AppointmentUsersDataArray)
                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        console.log("AppointmentUsersData", AppointmentUsersDataArray);
                    } else {
                        console.log("No user details found for any appointmentId");
                    }
                    console.log("AppointmentUsersDataArray", AppointmentUsersDataArray);
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                    console.log("AppointmentUsersData", AppointmentUsersDataArray);
                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };


    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        fetchTimeTableData();
        fetchMainTimeTableData();
        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };
        console.log(selectedDate)
        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);


        fetchUserDataWithAppointments();
        console.log("AppointmentUsersData XD", AppointmentUsersData)
        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [selectedDate, selectedDates, selectedDate1, selectedDate2, selectedDate3, selectedDate4, selectedDate5, timeOptions1, timeOptions2, timeOptions3, timeOptions4, timeOptions5]);
    const containerStyle = {
        zoom: zoomLevel,
    };

    const getDayName = (date) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    };

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const DateToCheck = `${date}/${month}/${year}`
    const [selectedCount, setSelectedCount] = useState(1);



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
                clinic: "คลินิกฝั่งเข็ม",
                type: "talk",
                status: "ลงทะเบียนแล้ว",
            };

            const usersCollection = collection(db, 'users');
            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
            const userDocuments = userQuerySnapshot.docs;
            const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
            const userId = userDocuments.length > 0 ? userDocuments[0].id : null;
            if (!userQuerySnapshot.empty) {
                console.log("User's collection ID:", userId);
            } else {
                console.log("No user found with the specified appointmentId");
            }

            if (foundUser) {
                const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
                console.log('Succuessful adddoc', appointmentInfo)
                console.log(appointmentId)
                console.log(appointmentRef.id)
                console.log("Newly created appointment ID:", appointmentRef.id);
                console.log("Found user:", foundUser);

                const userDocRef = doc(db, 'users', userId);

                await updateDoc(userDocRef, {
                    appointments: arrayUnion(appointmentRef.id),
                });

                console.log("User document updated with new appointment.");
                Swal.fire({
                    icon: "success",
                    title: "การนัดหมายสำเร็จ!",
                    text: "การนัดหมายถูกสร้างเรียบร้อยแล้ว!",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "ไม่พบรหัสนักศึกษา!",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                });
                console.log("User not found in alluserdata");
            }


        } catch (firebaseError) {
            console.error('Firebase submit error:', firebaseError);

            console.error('Firebase error response:', firebaseError);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถสร้างบัญชีผู้ใช้ได้ กรุณาลองอีกครั้งในภายหลัง",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
    };


    const submitEditForm = async (e) => {
        e.preventDefault();
        try {
            const timetableRef = doc(db, 'appointment', uid);
            console.log(uid);

            const updatedTimetable = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime: appointmentTime,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasue,
                appointmentSymptom: appointmentSymptom,
                appointmentNotation: appointmentNotation,
                clinic: "คลินิกฝั่งเข็ม",
                status: "ลงทะเบียนแล้ว",
            };

            await updateDoc(timetableRef, updatedTimetable);

            Swal.fire({
                icon: "success",
                title: "การอัปเดตการนัดหมายสำเร็จ!",
                text: "การนัดหมายถูกอัปเดตเรียบร้อยแล้ว!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
        }
    };


    const [saveDetailId, setsaveDetailId] = useState([])
    const [saveEditId, setsaveEditId] = useState([])


    const openDetailAppointment = (AppointmentUsersData) => {
        let x = document.getElementById("detail-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("edit-appointment");
        setsaveEditId("")
        setsaveDetailId(AppointmentUsersData.appointmentuid)
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            console.log(AppointmentUsersData.timeslot.start)
            const statusElement = document.getElementById("detail-appointment-status");
            if (statusElement) {
                statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
            }
            document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
            document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
            document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
            document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
            document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดมหาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
            document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
            document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`

        } else {
            if (saveDetailId === AppointmentUsersData.appointmentuid) {
                x.style.display = "none";
                setsaveEditId("")
            } else {
                setsaveEditId(AppointmentUsersData.appointmentuid)
                console.log(AppointmentUsersData.timeslot.start)
                const statusElement = document.getElementById("detail-appointment-status");
                if (statusElement) {
                    statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
                }
                document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
                document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
                document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
                document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
                document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดมหาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
                document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
                document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`
            }

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
            setsaveDetailId("")
            setsaveEditId("")

        } else {
            x.style.display = "none";


        }

    }


    const openEditAppointment = (appointmentUserData) => {
        console.log("Edit appointment data:", appointmentUserData.appointmentuid);
        console.log(appointmentUserData.appointmentuid)
        let x = document.getElementById("edit-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("detail-appointment");
        setState((prevState) => ({
            ...prevState,
            appointmentDate: appointmentUserData.appointmentDate,
            appointmentTime: null,
            appointmentId: appointmentUserData.appointmentId,
            appointmentCasue: appointmentUserData.appointmentCasue,
            appointmentSymptom: appointmentUserData.appointmentSymptom,
            appointmentNotation: appointmentUserData.appointmentNotation,
            clinic: appointmentUserData.clinic,
            uid: appointmentUserData.appointmentuid
        }));
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId(appointmentUserData.appointmentuid)    
        } else {
            if (saveEditId === appointmentUserData.appointmentuid) {
                x.style.display = "none";
                setsaveEditId("")
            } else {
                setsaveEditId(appointmentUserData.appointmentuid)
            }
        }
    }

    const openContinueAddinAppointment = () => {
        let x = document.getElementById("admin-add-appointment-connected");
        fetchMainTimeTableData();
        if (window.getComputedStyle(x).display === "none") {

            x.style.display = "block";
        } else {

            x.style.display = "none";


        }
    };



    const openContinueAddinAppointment2 = () => {
        let x = document.getElementById("admin-add-appointment-connected2");
        let y = document.getElementById("admin-add-appointment-connected");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
        } else {
            x.style.display = "none";
        }
    };


    const submitFormAddContinue = async () => {
        let x = document.getElementById("admin-add-appointment-connected2");
        let y = document.getElementById("admin-add-appointment-connected");



        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            setState((prevState) => ({
                ...prevState,
                appointmentTime1: appointmentTime,
                appointmentTime2: appointmentTime,
                appointmentTime3: appointmentTime,
                appointmentTime4: appointmentTime,
                appointmentTime5: appointmentTime,
                appointmentTime6: appointmentTime,
                appointmentTime7: appointmentTime,
                appointmentTime8: appointmentTime,
                appointmentTime9: appointmentTime,
                appointmentTime10: appointmentTime,

            }));

            cleanUpOldPopups();
            const appointmentPopupItem = document.querySelector(".admin-appointmemt-popup-item.border-L");
            const formattedAppointmentDate = formatToDDMMYYYY(`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);

            const handleSelectChanges = () => {
                setSelectedCount(selectedCount + 1);
                console.log(selectedCount)

            };



            for (let i = 1; i <= time; i++) {
                const instanceDate = new Date(formattedAppointmentDate);
                instanceDate.setDate(instanceDate.getDate() + (i - 1) * timelength);
                const formatdate = covertToSubmitPopup(instanceDate)
                setState((prevState) => ({
                    ...prevState,
                    [`appointmentDate${i}`]: formatdate,
                }));
                const formatDmy = (dateString) => {
                    const [day, month, year] = dateString.split('/').map(Number);
                    const formattedMonth = month < 10 ? `${month}` : `${month}`;
                    const formattedDay = day < 10 ? `${day}` : `${day}`;
                    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
                    const dateObject = new Date(year, month - 1, day);
                    const dayName = getDayName(new Date(dateObject)).toLowerCase();;
                    const formattedSelectedDate = {
                        day: day,
                        month: formattedMonth,
                        year: year,
                        dayName: dayName,
                    };

                    return formattedSelectedDate;
                };


                const xd = formatDmy(formatdate)
                console.log("xdformat", xd)
                const divElement = document.createElement('div');
                const timeTableCollection = collection(db, 'timeTable');
                const querySnapshot = await getDocs(query(
                    timeTableCollection,
                    where('addDay', '==', xd.dayName),
                    where('clinic', '==', 'คลินิกฝั่งเข็ม')
                ));
                const timeTableData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("timeTableData selectedDate", xd)
                console.log("timeTableData", timeTableData)

                if (timeTableData.length > 0) {
                    const filteredTimeTableData = timeTableData
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
                        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${xd.day}/${xd.month}/${xd.year}`),
                            where('clinic', '==', 'คลินิกฝั่งเข็ม')));

                        const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);
                        if (existingAppointments.length > 0) {

                            console.log(`Appointments found for ${xd.day}/${xd.month}/${xd.year}:`, existingAppointments);
                        } else {
                            console.log(`No appointments found for ${xd.day}/${xd.month}/${xd.year}`);
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
                        setIsChecked();
                        setIsChecked(initialIsChecked);

                        const timeOptionsFromTimetable = [
                            { label: "กรุณาเลือกช่วงเวลา", value: "", disabled: true, hidden: true },
                            ...availableTimeSlots
                                .filter(timeSlot => timeSlot.type === 'main')
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
                        const a = timeOptionsFromTimetable
                        const timeOptionsProperty = `timeOptions${i}`;
                        const timeOptionsValue = state[timeOptionsProperty];

                        divElement.id = `admin-add-appointment-connected2-${i}`;
                        divElement.className = "auto-create";
                        divElement.addEventListener("change", (e) => {
                            handleSelectChanges();
                            fetchTimeTableData();
                            const selectedValue = JSON.parse(e.target.value);

                            if (selectedValue && typeof selectedValue === 'object') {
                                const { timetableId, timeSlotIndex } = selectedValue;
                                console.log("timetableId:", timetableId);
                                console.log("timeSlotIndex:", timeSlotIndex);
                                handleOuterChange(timeSlotIndex);
                                setState((prevState) => ({
                                    ...prevState,
                                    [`appointmentTime${i}`]: {
                                        timetableId: timetableId,
                                        timeSlotIndex: timeSlotIndex,
                                    },
                                }));
                                setState(prevState => ({
                                    ...prevState,
                                    [`timeOptions${i}`]: a,
                                }));



                                console.log(state[`appointmentTime${i}`]);
                                handleSelectChanges();
                            } else if (e.target.value === "") {
                                inputValue(`appointmentTime${i}`)({
                                    target: {
                                        value: {},
                                    },
                                });

                                handleSelectChanges();
                            } else {
                                console.error("Invalid selected value:", selectedValue);
                            }
                        });

                        const handleOuterChange = (timeSlotIndex) => {
                            console.log("Received timeSlotIndex from inner change:", timeSlotIndex);
                        };


                        divElement.innerHTML = `
                                <p class="admin-textBody-large">ครั้งที่ ${i} สถานะ : ว่าง</p>
                                <div class="center-container">
                                    <label class="admin-textBody-large colorPrimary-800">วันที่</label>
                                    <span> ${formatdate}</span>
                                </div>
                                <div class="center-container">
                                <select
                                        name="time"
                                
                                        value=""
                                        class=${selectedCount >= 2 ? 'selected' : ''}
                                    >
                                        ${timeOptionsFromTimetable.map((timeOption) =>
                            `<option key="${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}" value=${JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                                ${timeOption.label}
                                            </option>`
                        )}
                                    </select>
                                
                                    
                                </div>
                                <br>
                            `;

                        if (existingAppointments.length > 0) {

                            console.log(selectedCount, "heheboi")
                            divElement.innerHTML = `
                                <p class="admin-textBody-large">ครั้งที่ ${i} สถานะ : มีช่วงเวลาไม่ว่าง กรุณาเปลี่ยน</p>
                                <div class="center-container">
                                    <label class="admin-textBody-large colorPrimary-800">วันที่</label>
                                    <span> ${formatdate}</span>
                                </div>
                                <div class="center-container">
                                    <label class="admin-textBody-large colorPrimary-800">เลือกเวลา</label>
                                    <select
                                        name="time"
                                        value=""
                                        class=${selectedCount >= 2 ? 'selected' : ''}
                                    >
                                        ${timeOptionsFromTimetable.map((timeOption) =>
                                `<option key="${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}" value=${JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                                ${timeOption.label}
                                            </option>`
                            )}
                                    </select>
                                </div>
                                <br>
                            `;
                        }
                        appointmentPopupItem.appendChild(divElement);

                    } else {
                        console.log("Time table not found for selected day and clinic");
                        const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };

                        setState(prevState => ({
                            ...prevState,
                            [`timeOptions${i}`]: noTimeSlotsAvailableOption,
                        }));
                        const a = `timeOptions${i}`
                        console.log("state", state[a]);
                    }
                } else {
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                    console.log("Time table not found", timeOptions);
                }
            }

        }
    };

    function cleanUpOldPopups() {
        const appointmentPopupItem = document.querySelector(".admin-appointmemt-popup-item.border-L");

        while (appointmentPopupItem.firstChild) {
            appointmentPopupItem.removeChild(appointmentPopupItem.firstChild);
        }
    }

    const formatToDDMMYYYY = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
        const dateObject = new Date(year, month - 1, day);
        return dateObject;
    };

    const covertToSubmitPopup = (dateString) => {
        const inputDate = new Date(dateString);

        const day = inputDate.getDate();
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };



    const submitFormAddContinue2 = async (e) => {
        e.preventDefault();

        try {
            const usersCollection = collection(db, 'users');
            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
            const userDocuments = userQuerySnapshot.docs;
            const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
            const userId = userDocuments.length > 0 ? userDocuments[0].id : null;

            if (!userQuerySnapshot.empty) {
                console.log("User's collection ID:", userId);
            } else {
                console.log("No user found with the specified appointmentId");
            }

            if (foundUser) {
                for (let i = 1; i <= time; i++) {
                    const updatedTimetable = {
                        appointmentDate: state[`appointmentDate${i}`],
                        appointmentTime: state[`appointmentTime${i}`],
                        appointmentId: appointmentId,
                        appointmentCasue: appointmentCasue,
                        appointmentSymptom: appointmentSymptom,
                        appointmentNotation: appointmentNotation,
                        clinic: "คลินิกฝั่งเข็ม",
                        status: "ลงทะเบียนแล้ว",
                        type: "main",
                    };
                    console.log(`time`, state[`appointmentTime${i}`],)
                    const appointmentRef = await addDoc(collection(db, 'appointment'), updatedTimetable);
                    console.log('Successful adddoc', updatedTimetable);
                    console.log(appointmentId);
                    console.log(appointmentRef.id);
                    console.log("Newly created appointment ID:", appointmentRef.id);

                    const userDocRef = doc(db, 'users', userId);

                    await updateDoc(userDocRef, {
                        appointments: arrayUnion(appointmentRef.id),
                    });
                }

                Swal.fire({
                    icon: "success",
                    title: "การนัดหมายสำเร็จ!",
                    text: "การนัดหมายถูกสร้างเรียบร้อยแล้ว!",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        resetForm();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "ไม่พบรหัสนักศึกษา!",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                });
                console.log("User not found in alluserdata");
            }
        } catch (firebaseError) {
            console.error('Firebase submit error:', firebaseError);

            console.error('Firebase error response:', firebaseError);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถสร้างบัญชีผู้ใช้ได้ กรุณาลองอีกครั้งในภายหลัง",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
    };

    const resetForm = () => {
        window.location.reload();
    };



    const adminCards = document.querySelectorAll('.admin-appointment-card');

    function handleCardClick(event) {
        adminCards.forEach(card => card.classList.remove('focused'));
        event.currentTarget.classList.add('focused');
    }

    adminCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

    const statusElements = document.querySelectorAll('.admin-appointment-status');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';

        }
        else if (element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F';
        }
        else if (element.textContent.trim() === 'ยืนยันสิทธิ์แล้ว') {
            element.style.color = '#D88C09';
        }
        else if (element.textContent.trim() === 'รอยืนยันสิทธิ์') {
            element.style.color = '#A1A1A1';
        }
        else if (element.textContent.trim() === 'ลงทะเบียนแล้ว') {
            element.style.color = '#A1A1A1';
        }
    }

    statusElements.forEach(changeStatusTextColor);

    let statusElementDetail = document.getElementById("detail-appointment-status");

    if (statusElementDetail) {
        if (statusElementDetail.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            console.log("Adding Class...");

            statusElementDetail.classList.add("confirmed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'เสร็จสิ้น') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("completed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ไม่สำเร็จ') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("failed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ลงทะเบียนแล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
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
                    <p className="admin-textBody-large admin-time">Time : <ClockComponent/></p>
                </div>
            </div>
            {isLoading ? (
        <div className="loading-spinner">

          <PulseLoader size={15} color={"#54B2B0"} loading={isLoading} />
        </div>
      ) : (
            <div className="admin">
                <div className="admin-header">
                    <div className="admin-hearder-item">
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกทั่วไป</a>
                        <a href="/AppointmentManagerComponentSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                        <a href="/AdminAppointmentManagerPhysicalComponent" target="_parent" >คลินิกกายภาพ</a>
                        <a href="/adminAppointmentManagerNeedleComponent" target="_parent" id="select">คลินิกฝั่งเข็ม</a>
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a target="_parent" onClick={() => {
                            openContinueAddinAppointment();
                        }} className="colorPrimary-50">เพิ่มนัดหมายต่อเนื่อง +</a>
                        <a href="/" target="_parent" >รายการขอนัดหมาย</a>
                    </div>
                </div>
                <div className="admin-appointment-flex">
                    <CalendarAdminComponent
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onDateSelect={handleDateSelect}
                    />
                    <div className="admin-appointment-box">
                        <div >
                            <div className="appointment-hearder">
                                <div className="colorPrimary-800 appointment-hearder-item">
                                    <h2>นัดหมายคลินิกฝั่งเข็ม</h2>
                                    <p className="admin-textBody-large">
                                        {selectedDate
                                            ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                            : `${date}/${month}/${year}`}
                                    </p>

                                </div>
                                <button type="button" className="appointment-hearder-item" onClick={openAddAppointment}>เพิ่มนัดหมาย +</button>
                            </div>
                            <div className="admin-appointment-box-card colorPrimary-800">
                                {AppointmentUsersData
                                    .filter(appointmentUserData => appointmentUserData.appointment.type === "talk")
                                    .sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start))
                                    .map((AppointmentUserData, index) => (
                                        <div className="admin-appointment-card colorPrimary-800" key={index}>
                                            <div className="admin-appointment-card-time admin-textBody-small" onClick={() => openDetailAppointment(AppointmentUserData)}>
                                                {AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}
                                            </div>
                                            <div className="admin-appointment-info flex-column" onClick={() => openDetailAppointment(AppointmentUserData)}>
                                                <p id="student-id" className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                                <p id="student-name" className="admin-textBody-small">{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                            </div>
                                            <div className="admin-appointment-functon">
                                                {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                                    <p style={{ justifyContent: "center", display: "flex", alignItems: "center", margin: 0, marginRight: 10 }} className="admin-appointment-status admin-textBody-small">{`${AppointmentUserData.appointment.status}`}</p>
                                                ) : (
                                                    <>
                                                        <img src={edit} className="icon" onClick={() => openEditAppointment(AppointmentUserData.appointment)} />
                                                        <img src={icon_delete} className="icon" onClick={() => DeleteAppointmentNeedle(AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid)} />
                                                    </>
                                                )}  
                                            </div>
                                        </div>
                                    ))}
                                <div style={{ marginTop: 20, marginBottom: 10, display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}><p className="colorNeutralBlack-400">---------------- นัดหมายฝั่งเข็ม ----------------</p></div>

                                {AppointmentUsersData
                                    .filter(appointmentUserData => appointmentUserData.appointment.type === "main")
                                    .sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start))
                                    .map((AppointmentUserData, index) => (
                                        <div className="admin-appointment-card colorPrimary-800" key={index}>
                                            <div className="admin-appointment-card-time admin-textBody-small" onClick={() => openDetailAppointment(AppointmentUserData)}>
                                                {AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}
                                            </div>
                                            <div className="admin-appointment-info flex-column" onClick={() => openDetailAppointment(AppointmentUserData)}>
                                                <p id="student-id" className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                                <p id="student-name" className="admin-textBody-small">{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                            </div>
                                            <div className="admin-appointment-functon">
                                                {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                                    <p style={{ justifyContent: "center", display: "flex", alignItems: "center", margin: 0, marginRight: 10 }} className="admin-appointment-status admin-textBody-small">{`${AppointmentUserData.appointment.status}`}</p>
                                                ) : (
                                                    <>
                                                        <img src={edit} className="icon" onClick={() => openEditAppointment(AppointmentUserData.appointment)} />
                                                        <img src={icon_delete} className="icon" onClick={() => DeleteAppointmentNeedle(AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid)} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}


                            </div>
                        </div>

                    </div>
                    <div className="admin-appointment-box">
                        <div id="detail-appointment" className="colorPrimary-800">
                            {selectedDate && `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                <div className="admin-appointment-detail-header">
                                    <div className="admin-appointment-detail-header-items2"></div>
                                    <h2 className="admin-appointment-detail-header-items1 center">รายละเอียดนัดหมาย</h2>
                                    <div className="admin-appointment-detail-header-items2 admin-right" ><span id="detail-appointment-status">ยืนยันสิทธ์แล้ว</span></div>
                                </div>
                            ) : (<h2 className="center">รายละเอียดนัดหมาย</h2>)}
                            <p id="detail-appointment-date" className="admin-textBody-big"></p>
                            <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                            <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                            <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                            <p id="detail-appointment-casue" className="admin-textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                            <p id="detail-appointment-symptom" className="admin-textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                            <p id="detail-appointment-notation" className="admin-textBody-big"><b>หมายเหตุ</b>: -</p>


                        </div>
                        <div id="add-appointment" className="colorPrimary-800">
                            <form onSubmit={submitForm}>
                                <h2 className="center">เพิ่มนัดหมาย</h2>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                    <p className="admin-textBody-big">{selectedDate
                                        ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                        : "Select a date"}</p>
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา</label>
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

                                                setState((prevState) => ({
                                                    ...prevState,
                                                    "appointmentTime": {
                                                        timetableId: timetableId,
                                                        timeSlotIndex: timeSlotIndex,
                                                    },
                                                }));
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
                                    <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentId} onChange={(e) => { setState({ ...state, appointmentId: e.target.value, }); }} placeholder="64000000000" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={(e) => { setState({ ...state, appointmentCasue: e.target.value, }); }} placeholder="เป็นไข้" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={(e) => { setState({ ...state, appointmentSymptom: e.target.value, }); }} placeholder="ปวดหัว, ตัวร้อน" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={(e) => { setState({ ...state, appointmentNotation: e.target.value, }); }} placeholder="เป็นไข้หวักทั่วไป" />
                                </div>
                                <div className="admin-timetable-btn">
                                    <button type="button" onClick={openAddAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                    <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                                </div>
                            </form>
                        </div>
                        <div id="edit-appointment" className="colorPrimary-800">
                            <form onSubmit={submitEditForm}>
                                <h2 className="center">แก้ไขนัดหมาย</h2>
                                <div className="center-container">
                                    <label className="admin-textBody-large colorPrimary-800">วันที่</label>
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
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา</label>
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

                                                setState((prevState) => ({
                                                    ...prevState,
                                                    "appointmentTime": {
                                                        timetableId: timetableId,
                                                        timeSlotIndex: timeSlotIndex,
                                                    },
                                                }));
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
                                        {timeOptionss.map((timeOption, index) => (
                                            <option key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`} value={JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                                {timeOption.label}
                                            </option>
                                        ))}

                                    </select>


                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentId} disabled onChange={inputValue("appointmentId")} placeholder="64000000000" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="64000000000" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="64000000000" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="64000000000" />
                                </div>
                                <div className="admin-timetable-btn">
                                    <button type="button" onClick={openEditAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                    <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
                <div id="admin-add-appointment-connected">
                    <div className="admin-appointmemt-popup">
                        <h1 className="center colorPrimary-800">เพิ่มนัดหมายต่อเนื่อง</h1>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentId} onChange={(e) => { setState({ ...state, appointmentId: e.target.value, }); }} placeholder="64000000000" />
                        </div>
                        <div className="center-container">
                            <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                            <br></br>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                    inputValue("appointmentDates")(e);
                                    const formattedDate = formatDatesForDisplay(e.target.value);
                                    console.log("Formatted Date:", formattedDate);
                                    fetchMainTimeTableData();
                                }}
                            />
                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">วัน</label>
                            <select
                                name="time"
                                value={JSON.stringify(appointmentTime)}
                                onChange={(e) => {
                                    console.log("XXD", appointmentTime1)
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
                                {timeOptionss.map((timeOption, index) => (
                                    <option key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`} value={JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                        {timeOption.label}
                                    </option>
                                ))}

                            </select>

                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">จำนวนครั้ง</label><br></br>
                            <input type="text" className="form-control appointment-input" onChange={(e) => { inputValue("time")(e); }} placeholder="5" />
                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">ระยะห่าง(วัน)</label><br></br>
                            <input type="text" className="form-control appointment-input" onChange={(e) => { inputValue("timelength")(e); }} placeholder="7" />
                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={(e) => { setState({ ...state, appointmentCasue: e.target.value, }); }} placeholder="" />
                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={(e) => { setState({ ...state, appointmentSymptom: e.target.value, }); }} placeholder="" />
                        </div>
                        <div>
                            <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                            <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={(e) => { setState({ ...state, appointmentNotation: e.target.value, }); }} placeholder="" />
                        </div>
                        <div className="admin-timetable-btn">
                            <button type="button" className="btn-secondary btn-systrm" onClick={() => {
                                resetForm();
                                openContinueAddinAppointment();
                            }}
                            >กลับ</button>
                            <button type="button" className="btn-primary btn-systrm" onClick={() => submitFormAddContinue()} >ถัดไป</button>
                        </div>

                    </div>

                </div>
                <div id="admin-add-appointment-connected2">
                    <form onSubmit={submitFormAddContinue2} className="admin-appointmemt-popup">
                        <h1 className="center colorPrimary-800">สรุปนัดหมายต่อเนื่อง</h1>
                        <div className="admin-appointmemt-popup-flexbox">
                            <div className="admin-appointmemt-popup-item">
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentId} onChange={(e) => { setState({ ...state, appointmentId: e.target.value, }); }} placeholder="64000000000" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">จำนวนครั้ง</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={time} onChange={(e) => { setState({ ...state, time: e.target.value, }); }} placeholder="5" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={(e) => { setState({ ...state, appointmentCasue: e.target.value, }); }} placeholder="" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                    <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={(e) => { setState({ ...state, appointmentSymptom: e.target.value, }); }} placeholder="" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                    <input type="text" className="form-control input-big" value={appointmentNotation} onChange={(e) => { setState({ ...state, appointmentNotation: e.target.value, }); setState({ ...state, timeOptions1: e.target.value, }); }} placeholder="" />
                                </div>

                            </div>
                            <div className="admin-appointmemt-popup-item border-L">

                            </div>
                        </div>
                        <br></br>
                        <div className="admin-timetable-btn">
                            <button type="button" className="btn-secondary btn-systrm" onClick={() => {
                                resetForm();
                                openContinueAddinAppointment2(time);
                            }}>กลับ</button>
                            <input type="submit" value="เพิ่มนัดหมายต่อเนื่อง" className="btn-primary btn-systrm" target="_parent" disabled={isAutoSubmitEnabled} />
                        </div>


                    </form>

                </div>
            </div>
      )}





        </div>
    );
}

export default AppointmentManagerPhysicalComponent;

