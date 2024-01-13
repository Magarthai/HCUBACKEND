import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection ,doc} from "../firebase/config";
import { addDoc ,query, where,updateDoc,arrayUnion} from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";
import "../css/AdminAppointmentComponent.css";



const AppointmentManagerPhysicalComponent = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
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
                                    ...item.timeablelist.map((timeSlot, index) => ({ ...timeSlot, timeTableId: item.id, timeSlotIndex: index }))
                                );
                            }
                            return acc;
                        }, []);
                        setTimetable(allTimeableLists);

                        const initialIsChecked = allTimeableLists.reduce((acc, timetableItem) => {
                            acc[timetableItem.id] = timetableItem.status === "Enabled";
                            return acc;
                        }, {});

                        setIsChecked(initialIsChecked);


                        const timeOptionsFromTimetable = allTimeableLists.map((timeSlot) => ({
                            label: `${timeSlot.start} - ${timeSlot.end}`,
                            value: [timeSlot.timeTableId, timeSlot.timeSlotIndex],
                        }));
                        const sortedTimeOptions = timeOptionsFromTimetable.sort((a, b) => {
                            const timeA = new Date(`01/01/2000 ${a.value.start}`);
                            const timeB = new Date(`01/01/2000 ${b.value.start}`);
                            return timeA - timeB;
                        });

                        console.log("Before setTimeOptions", timeOptionsFromTimetable);
                        setTimeOptions(sortedTimeOptions);
                        console.log("After setTimeOptions", timeOptionsFromTimetable);

                        console.log(allTimeableLists);
                    } else {
                        console.log("Time table not found for selected day and clinic");
                    }
                } else {
                    console.log("Time table not found");
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
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
        console.log("All user Data",alluserdata)
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [user, selectedDate, alluserdata, userDataFetched]);
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
                appointmentDate: selectedDate
                    ? new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
                    : null,
                appointmentTime,
                appointmentId: appointmentId || null,
                appointmentCasue,
                appointmentSymptom,
                appointmentNotation,
                clinic: "คลินิกทั่วไป",
            };
    
            const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);

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
    const openContinueAddinAppointment = () => {
        let x = document.getElementById("admin-add-appointment-connected");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";

        } else {
            x.style.display = "none";


        }

    }
    const openContinueAddinAppointment2 = () => {
        let x = document.getElementById("admin-add-appointment-connected2");
        let y = document.getElementById("admin-add-appointment-connected");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";

        } else {
            x.style.display = "none";


        }

    }
    const submitFormAddContinue = () => {
        let x = document.getElementById("admin-add-appointment-connected2");
        let y = document.getElementById("admin-add-appointment-connected");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";


        } else {
            x.style.display = "none";


        }

    };
    const submitFormAddContinue2 = async (e) => {
      

    };

    const adminCards = document.querySelectorAll('.admin-appointment-card');

    function handleCardClick(event) {
        adminCards.forEach(card => card.classList.remove('focused'));    
        event.currentTarget.classList.add('focused');
    }

    adminCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });


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
            <div className="admin">
                <div className="admin-header">
                    <div className="admin-hearder-item">
                        <a href="/appointmentAdmin" target="_parent" >คลินิกทั่วไป</a>
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกเฉพาะทาง</a>
                        <a href="/AppointmentManagerComponent" target="_parent" id="select" >คลินิกกายภาพ</a>
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกฝั่งเข็ม</a>
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a target="_parent"  onClick={()=> openContinueAddinAppointment()} className="colorPrimary-50">เพิ่มนัดหมายต่อเนื่อง +</a>
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
                                <h2>นัดหมายคลินิกกายภาพ</h2>
                                <p className="admin-textBody-large">
                                    {selectedDate
                                        ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                        : `${date}/${month}/${year}`}
                                </p>

                            </div>
                            <button type="button" className="appointment-hearder-item" onClick={openAddAppointment}>เพิ่มนัดหมาย +</button>
                        </div>
                        <div className="admin-appointment-box-card colorPrimary-800">
                            <div className="admin-appointment-card focus">
                                <div className="admin-appointment-card-time admin-textBody-small">13:01-13:06</div>
                                <div className="admin-appointment-info admin-appointment-flex-column">
                                    <p id="student-id" className="admin-textBody-huge">64090500440</p>
                                    <p id="student-name" className="admin-textBody-small">uvuvwevwevwe onyetenyevwe</p>
                                </div>
                                <div className="admin-appointment-functon">
                                    <img src={edit} className="icon" onClick={() => openEditAppointment()}/>
                                    <img src={icon_delete} className="icon" onClick={() => DeleteAppointment()}/>
                                </div>
                                
                            
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="admin-appointment-box">
                    <div id="detail-appointment" className="colorPrimary-800">
                        <h2 className="center">รายละเอียนัดหมาย</h2>
                        <p id="detail-appointment-date" className="admin-textBody-big"><b>วันที่</b> : 13/12/2023</p>
                        <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="admin-textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="admin-textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="admin-textBody-big"><b>หมายเหตุ</b>: -</p>


                    </div>
                    <div id="add-appointment" className="colorPrimary-800">
                        <form onSubmit={submitForm}>
                            <h3 className="center">เพิ่มนัดหมาย</h3>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                <p className="admin-textBody-big">{selectedDate
                                    ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                    : "Select a date"}</p>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="time"
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        handleSelectChange();
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && Array.isArray(selectedValue)) {
                                            const [timetableId, timeSlotIndex] = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [timetableId, timeSlotIndex],
                                                },
                                            });

                                            handleSelectChange();
                                        } else if (e.target.value === "") {
                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [],
                                                },
                                            });

                                            handleSelectChange();
                                        }
                                        else {
                                            console.error("Invalid selected value:", selectedValue);
                                        }
                                    }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled>กรุณาเลือกช่วงเวลา</option>
                                    {timeOptions.map((timeOption, index) => (
                                        <option key={`${timeOption.value[0]}-${timeOption.value[1]}`} value={JSON.stringify(timeOption.value)}>
                                            {timeOption.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
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
                                <button type="button" onClick={openAddAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" />
                            </div>
                        </form>
                    </div>
                    <div id="edit-appointment" className="colorPrimary-800">
                        <form onSubmit={submitEditForm}>
                            <h2 className="center">แก้ไขนัดหมาย</h2>
                            <div className="center-container">
                                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                <br></br>
                                <input type="date"  className="form-control"></input>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
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
                                <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
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
                                <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent" />
                                </div>
                        </form>
                    </div>
                </div>

            </div>
            <div id="admin-add-appointment-connected">
                <div  className="admin-appointmemt-popup">
                    <h1 className="center colorPrimary-800">เพิ่มนัดหมายต่อเนื่อง</h1>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
                    </div>
                    <div className="center-container">
                                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                <br></br>
                                <input type="date" className="form-control"></input>
                    </div>
                    <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="time"
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        handleSelectChange();
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && Array.isArray(selectedValue)) {
                                            const [timetableId, timeSlotIndex] = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [timetableId, timeSlotIndex],
                                                },
                                            });

                                            handleSelectChange();
                                        } else if (e.target.value === "") {
                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [],
                                                },
                                            });

                                            handleSelectChange();
                                        }
                                        else {
                                            console.error("Invalid selected value:", selectedValue);
                                        }
                                    }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled>กรุณาเลือกช่วงเวลา</option>
                                    {timeOptions.map((timeOption, index) => (
                                        <option key={`${timeOption.value[0]}-${timeOption.value[1]}`} value={JSON.stringify(timeOption.value)}>
                                            {timeOption.label}
                                        </option>
                                    ))}
                                </select>

                    </div>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">จำนวนครั้ง</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="5" />
                    </div>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">ระยะห่าง(วัน)</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="7" />
                    </div>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                    </div>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                    </div>
                    <div>
                        <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                    </div>
                    <div className="admin-timetable-btn">
                        <button type="button" className="btn-secondary btn-systrm" onClick={()=> openContinueAddinAppointment()}>กลับ</button>
                        <button type="button" className="btn-primary btn-systrm" onClick={()=> submitFormAddContinue()}>ถัดไป</button>
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
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">จำนวนครั้ง</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="5" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดมหาย</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                <input type="text" className="form-control input-big" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="" />
                            </div>

                        </div>
                        <div className="admin-appointmemt-popup-item border-L">
                            <p className="admin-textBody-large">ครั้งที่ 1 สถานะ : ว่าง</p>
                            <div className="center-container">
                                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                <br></br>
                                <input type="date"  className="form-control"></input>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="time"
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        handleSelectChange();
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && Array.isArray(selectedValue)) {
                                            const [timetableId, timeSlotIndex] = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [timetableId, timeSlotIndex],
                                                },
                                            });

                                            handleSelectChange();
                                        } else if (e.target.value === "") {
                                            inputValue("appointmentTime")({
                                                target: {
                                                    value: [],
                                                },
                                            });

                                            handleSelectChange();
                                        }
                                        else {
                                            console.error("Invalid selected value:", selectedValue);
                                        }
                                    }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled>กรุณาเลือกช่วงเวลา</option>
                                    {timeOptions.map((timeOption, index) => (
                                        <option key={`${timeOption.value[0]}-${timeOption.value[1]}`} value={JSON.stringify(timeOption.value)}>
                                            {timeOption.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="admin-timetable-btn">
                        <button type="button" className="btn-secondary btn-systrm" onClick={()=>openContinueAddinAppointment2()}>กลับ</button>
                        <input type="submit" value="เพิ่มนัดหมายต่อเนื่อง" className="btn-primary btn-systrm" target="_parent" />
                    </div>
                    
                    
                </form>

            </div>
            </div>
            
            




        </div>
    );
}

export default AppointmentManagerPhysicalComponent;

