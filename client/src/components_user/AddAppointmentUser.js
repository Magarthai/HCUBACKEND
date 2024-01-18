import { useEffect, useState, useRef } from "react";
import "../css/AddAppointmentUser.css";
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { fetchTimeTableDataFromBackend } from "../backend/backendGeneral";
import { useUserAuth } from "../context/UserAuthContext";
const AddAppointmentUser = () => {
    const [selectedDate, setSelectedDate] = useState();
    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setSelectedDate(selectedDate);
    };
    const { user, userData } = useUserAuth();
    const [timeOptions, setTimeOptions] = useState([]);
    const [isChecked, setIsChecked] = useState({});

    const fetchTimeTableData = async () => {
        try {

            const timeTableData = await fetchTimeTableDataFromBackend(user, selectedDate);
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
                    const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));

                    const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);

                    if (existingAppointments.length > 0) {
                       
                    } else {

                    }

                    const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
                        !existingAppointments.some(existingSlot =>
                            existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
                        )
                    );


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
    useEffect(() => {
        document.title = 'Health Care Unit';
        fetchTimeTableData();
    }, [selectedDate]);
    return(
            <div className="user">
                    <header className="user-header">
                        <div>
                        <h2>การนัดหมาย</h2>
                        <h3>ขอนัดหมาย</h3>
                        </div>

                        <NavbarUserComponent/>
                    </header>

                    <body className="user-body">
                        <h3 className="user-head-context">ปฏิทิน</h3>
                        <label className="user-head-clinicname">คลินิก</label>

                        <div className="CalendarUser">
                        <CalendarUserComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}
                        />
                        </div>
                        <div className="user-EditAppointment-Dropdown_container gap-32" style={{marginTop:36}}>
                    <div className="user-EditAppointment-Dropdown_title">
                        <h4>ช่วงเวลา</h4>
                    </div>
                        <select className="user-EditAppointment-Dropdown_time">
                            <option disabled selected hidden>กรุณาเลือกช่วงเวลา</option>
                            <option>15/12/2023</option>
                            <option>16/12/2023</option>
                            <option>20/12/2023</option>
                        </select>

                </div>

                <div className="user-EditAppointment-Reason_container gap-32">
                    <h4 className="user-EditAppointment-Reason_title">สาเหตุการนัดหมาย</h4>
                    <p className="user-EditAppointment-Reason">ตรวจรักษาโรค</p>
                </div>
            
                <div className="user-EditAppointment-Symptom_container gap-32">
                    <h4 className="user-EditAppointment-Symptom_title">อาการเบื้องต้น</h4>
                    <textarea  placeholder="อาการเบื้องต้น" className="user-EditAppointment-Symptom"></textarea>
                </div>
                <div className="user-EditAppointment-Button_container gap-32">
                    <button className="btn-primary"  >เพิ่มนัดหมาย</button>
                </div>

                    </body>
            </div>

    )
}

export default AddAppointmentUser;
