import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../components_hcu/NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import CalendarUserComponent from "../components_user/CalendarUserComponent";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import "../css/AdminAppointmentComponent.css";
import "../css/Component.css";
import { addDoc } from 'firebase/firestore';
import Swal from "sweetalert2";

const AppointmentComponent = (props) => {
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


    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic } = state
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
    const [timetable, setTimetable] = useState([])
    const [isChecked, setIsChecked] = useState({});
    const fetchTimeTableData = async () => {
        try {
            if (user) {
                const timeTableCollection = collection(db, 'timeTable');
                const timeTableSnapshot = await getDocs(timeTableCollection);
    
                const timeTableData = timeTableSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                if (timeTableData.length > 0) {
                    // Filter timeTableData based on addDay and timeTableclinic properties
                    const filteredTimeTableData = timeTableData.filter(
                        (item) => item.addDay === selectedDate.dayName && item.clinic === "คลินิกทั่วไป"
                    );
    
                    if (filteredTimeTableData.length > 0) {
                        // Combine all timeablelists into a single array
                        const allTimeableLists = filteredTimeTableData.reduce((acc, item) => {
                            if (item.timeablelist && Array.isArray(item.timeablelist)) {
                                acc.push(...item.timeablelist);
                            }
                            return acc;
                        }, []);
    
                        setTimetable(allTimeableLists);
    
                        const initialIsChecked = allTimeableLists.reduce((acc, timetableItem) => {
                            acc[timetableItem.id] = timetableItem.status === "Enabled";
                            return acc;
                        }, {});
    
                        setIsChecked(initialIsChecked);
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

        fetchTimeTableData();
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [user, selectedDate]);
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
            <div className="admin">
                <div className="admin-header">
                    <div className="admin-hearder-item">
                        <a href="/appointmentAdmin" target="_parent" id="select">คลินิกทั่วไป</a>
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกเฉพาะทาง</a>
                        <a href="/adminAppointmentManagerPhysicalComponent" target="_parent" >คลินิกกายภาพ</a>
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกฝั่งเข็ม</a>
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a href="/adminAppointmentRequestManagementComponent" target="_parent" >รายการขอนัดหมาย</a>
                    </div>
                </div>
                <div className="flex">
                    
                <CalendarAdminComponent
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    onDateSelect={handleDateSelect}
                />
                <div className="box">
                    <div >
                        <div className="box-header-container">
                            <div className="box-header colorPrimary-800 system-top-item"><h5>นัดหมายคลินิกทั่วไป</h5></div>
                            <div className="box-date colorPrimary-800 system-top-item textBody-large">{selectedDate
                                        ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                        : `${date}/${month}/${year}`}</div>
                        </div>
                        <div className="box-list colorPrimary-800">
                            <div className="box-userapointment">
                                <div className="time-apppoint textBody-medium">13:01-13:06</div>
                                <div className="appoint-info">
                                    <div className="user-appointment-info flex-column">
                                        <p id="student-id" className="textBody-huge">64090500440</p>
                                        <p id="student-name" className="textBody-medium">uvuvwevwevwe onyetenyevwe</p>
                                    </div>
                                    <div className="appointment-status success textBody-medium">เสร็จสิ้น</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                <div className="box">
                    <div id="detail-appointment-current-date" className="colorPrimary-800">
                        <h3 className="center">รายละเอียนัดหมาย</h3>
                        <p id="detail-appointment-date" className="textBody-big"><b>วันที่</b> : 13/12/2023</p>
                        <p id="detail-appointment-time" className="textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="textBody-big"><b>สาเหตุการนัดมหาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="textBody-big"><b>หมายเหตุ</b>: -</p>


                    </div>
                </div>
               
            </div>
            </div>





        </div>
    );
}

export default AppointmentComponent;
