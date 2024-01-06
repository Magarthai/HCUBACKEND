import React, { useEffect, useState, useRef } from "react";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminTimeTableComponent.css";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import Swal from "sweetalert2";
import { auth } from '../firebase/config';
import { doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TimetableComponent = (props) => {
    const [showTime, setShowTime] = useState(getShowTime);
    const [userData, setUserData] = useState(null);
    const animationFrameRef = useRef();
    const { user } = useUserAuth();
    const [timetable, setTimetable] = useState([])
    const { id } = useParams();
    const [state, setState] = useState({
        addDay: "",
        timeStart: "",
        timeEnd: "",
        timeAppointmentStart: "",
        timeAppointmentEnd: "",
        numberAppointment: "",
        clinic: "",
        timetableId: id || "", 
    })


    const { addDay, timeStart, timeEnd, timeAppointmentStart, timeAppointmentEnd, numberAppointment, clinic ,timetableId} = state

    const isSubmitEnabled =
        !addDay || !timeStart || !timeEnd || !timeAppointmentStart || !timeAppointmentEnd || !numberAppointment;


    const [isChecked, setIsChecked] = useState({});
    const inputValue = (name) => (event) => {
        if (name === "addDay") {
            setState({ ...state, [name]: event.target.value });
        } else {
            setState({ ...state, [name]: event.target.value });
        }
    };


    const [selectedCount, setSelectedCount] = useState(1);

    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)
    };

    const fetchTimeTableData = async () => {
        try {
            if (user) {
                const timeTableCollection = collection(db, 'timeTable');
                const timeTableSnapshot = await getDocs(timeTableCollection);

                const timeTableData = timeTableSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));




                if (timeTableData) {
                    setTimetable(timeTableData);
                    const initialIsChecked = timeTableData.reduce((acc, timetableItem) => {
                        acc[timetableItem.id] = timetableItem.status === "Enabled";
                        return acc;
                    }, {});

                    setIsChecked(initialIsChecked);

                    console.log(timeTableData);
                } else {
                    console.log("time table not found");
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        console.log(timetableId)
        const start = new Date(`2000-01-01T${timeAppointmentStart}`);
        const end = new Date(`2000-01-01T${timeAppointmentEnd}`);
        const duration = (end - start) / 60000;

        if (duration <= 0) {
            return;
        }

        const timeablelist = [];

        const interval = Math.floor(duration / numberAppointment);

        for (let i = 0; i < numberAppointment; i++) {
            const slotStart = new Date(start.getTime() + i * interval * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval * 60000);


            if (slotEnd.getTime() > end.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                break;
            }

            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }


        try {
            const additionalTImeTable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                numberAppointment: numberAppointment,
                clinic: "general",
                timeablelist: timeablelist,
                status: "Enabled",
            };

            await addDoc(collection(db, 'timeTable'), additionalTImeTable);

            Swal.fire({
                icon: "success",
                title: "Alert",
                text: "Added Time!",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchTimeTableData();
                }
            });

        } catch (firebaseError) {
            console.error('Firebase signup error:', firebaseError);
        }
    };

    const editForm = async (e) => {
        e.preventDefault();
        console.log(timetableId);
        const start = new Date(`2000-01-01T${timeAppointmentStart}`);
        const end = new Date(`2000-01-01T${timeAppointmentEnd}`);
        const duration = (end - start) / 60000;
    
        if (duration <= 0) {
            return;
        }
    
        const timeablelist = [];
    
        const interval = Math.floor(duration / numberAppointment);
    
        for (let i = 0; i < numberAppointment; i++) {
            const slotStart = new Date(start.getTime() + i * interval * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval * 60000);
    
            if (slotEnd.getTime() > end.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                break;
            }
    
            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    
        try {
            const timetableRef = doc(db, 'timeTable', timetableId);
            console.log(timetableId);  // Corrected from console.log(timetable.id)
    
            const updatedTimetable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                numberAppointment: numberAppointment,
                clinic: "general",
                timeablelist: timeablelist,
                status: "Enabled",
            };
    
            await updateDoc(timetableRef, updatedTimetable);
    
            Swal.fire({
                icon: "success",
                title: "Alert",
                text: "Time Updated!",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchTimeTableData();
                }
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
        }
    };
    






    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);

        fetchTimeTableData();
        const fetchUserData = async () => {
            try {
                if (user) {
                    const usersCollection = collection(db, 'users');
                    const usersSnapshot = await getDocs(usersCollection);

                    const usersData = usersSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    const currentUserData = usersData.find((userData) => userData.uid === user.uid);

                    if (currentUserData) {
                        setUserData(currentUserData);
                        console.log(currentUserData);
                    } else {
                        console.log("User not found");
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
        const updateShowTime = () => {
            const newTime = getShowTime();
            if (newTime !== showTime) {
                setShowTime(newTime);
            }
            animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };

        animationFrameRef.current = requestAnimationFrame(updateShowTime);


        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };

    }, [user]);




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
    const locale = 'en'
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;



    const handleToggle = async (id) => {
        setIsChecked(prevState => {
            const updatedStatus = !prevState[id];

            // อัพเดต status จาก toggle
            const docRef = doc(db, 'timeTable', id);
            updateDoc(docRef, { status: updatedStatus ? "Enabled" : "Disabled" }).catch(error => {
                console.error('Error updating timetable status:', error);
            });

            return { ...prevState, [id]: updatedStatus };
        });
    };


    const openAddtimetable = () => {
        let x = document.getElementById("Addtimetable");
        let y = document.getElementById("Edittimetable");
        let z = document.getElementById("Detailtimetable");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
        } else {
            x.style.display = "none";


        }
    }

    const navigate = useNavigate();


    const openEdittimetable = (element, timetable) => {
        let x = document.getElementById("Edittimetable");
        let y = document.getElementById("Addtimetable");
        let z = document.getElementById("Detailtimetable");
        console.log(timetable)
        if (window.getComputedStyle(x).display === "none") {
          x.style.display = "block";
          y.style.display = "none";
          z.style.display = "none";
      
          setState((prevState) => ({
            ...prevState,
            addDay: timetable.addDay,
            timeStart: timetable.timeStart,
            timeEnd: timetable.timeEnd,
            timeAppointmentStart: timetable.timeAppointmentStart,
            timeAppointmentEnd: timetable.timeAppointmentEnd,
            numberAppointment: timetable.numberAppointment,
            clinic: "general",
            timeablelist: timetable.timeablelist,
            status: "Enabled",
            timetableId: timetable.id,  // Update the id in the state
          }));

          console.log(timetable.id)
      
          window.history.replaceState({}, null, `/timeTableAdmin/${timetable.id}`);
        } else {
          x.style.display = "none";
        }
      };





    const openDetailtimetable = (element, timetable) => {
        let x = document.getElementById("Detailtimetable");
        let y = document.getElementById("Edittimetable");
        let z = document.getElementById("Addtimetable");

        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            let detailDay = timetable.addDay;
            let listtimetable = ""
            if (detailDay === "monday") {
                document.getElementById("Detailday").innerHTML = `วัน : วันจันทร์`
            } else if (detailDay === "tuesday") {
                document.getElementById("Detailday").innerHTML = `วัน : วันอังคาร`
            } else if (detailDay === "wednesday") {
                document.getElementById("Detailday").innerHTML = `วัน : วันพุธ`
            } else if (detailDay === "thursday") {
                document.getElementById("Detailday").innerHTML = `วัน : วันพฤหัสบดี`
            } else if (detailDay === "friday") {
                document.getElementById("Detailday").innerHTML = `วัน : วันศุกร์`
            }
            document.getElementById("Detailtimeall").innerHTML = `ช่วงเวลาเปิดให้บริการ : ${timetable.timeStart} - ${timetable.timeEnd} `
            document.getElementById("Detailtime").innerHTML = `ช่วงเวลาเปิดให้นัดหมาย : ${timetable.timeAppointmentStart} - ${timetable.timeAppointmentEnd} `
            document.getElementById("Detailqueue").innerHTML = `จำนวนคิวนัดหมาย : ${timetable.numberAppointment} `
            console.log(timetable.timeablelist.length)
            for (let i = 0; i < timetable.timeablelist.length; i++) {
                listtimetable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${timetable.timeablelist[i].start} - ${timetable.timeablelist[i].end}</p>`
                console.log(timetable.timeablelist[i])
            }
            document.getElementById("Detail").innerHTML = `ช่วงเวลาคิวนัดหมาย : ${listtimetable}`
            window.history.replaceState({}, null, `/timeTableAdmin/${timetable.id}`);
        } else {
            x.style.display = "none";
        }

    }

    const Deletetimetable = async(element, timetable)  => {
        let detailDay = timetable.addDay;
        if (detailDay === "monday") {
            detailDay = 'วันจันทร์'
        } else if (detailDay === "tuesday") {
            detailDay = 'วันอังคาร'
        } else if (detailDay === "wednesday") {
            detailDay = 'วันพุธ'
        } else if (detailDay === "thursday") {
            detailDay = 'วันพฤหัสบดี'
        } else if (detailDay === "friday") {
            detailDay = 'วันศุกร์'
        }
        const timetableRef = doc(db, 'timeTable', `${timetable.id}`);
        Swal.fire({
            title: 'ลบช่วงเวลา',
            text: `${detailDay} เวลา ${timetable.timeStart} - ${timetable.timeEnd}`,
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
                    deleteDoc(timetableRef,`${timetable.id}`)
                    console.log(`${timetable.id}`);
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
                        }
                        ).then((result) => {
                            if (result.isConfirmed) {
                                fetchTimeTableData();
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




    return (
        <div>
            <NavbarComponent />
            <div className="topicBox">
                <div></div>
                <div>
                    <h1 className="colorPrimary-800 center">ช่วงเเวลาเข้าทำการแพทย์</h1>
                </div>
                <div className="dateTime">
                    <p>Date : {currentDate}</p>
                    <p>Time : {showTime}</p>
                </div>
            </div>
            <div className="clinic">
                <a href="/" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/" target="_parent" >คลินิกกายภาพ</a>
                <a href="/" target="_parent" >คลินิกฝั่งเข็ม</a>
            </div>

            <div className="system">
                <div className="system-item">
                    <div className="system-top">
                        <p className="colorPrimary-800 system-top-item">ช่วงเวลาเข้าทำการแพทย์</p>
                        <button className="system-top-item" onClick={openAddtimetable}>เพิ่มเวลา +</button>
                    </div>
                    <div className="system-detail">
                        <p>วันจันทร์</p>
                        {timetable.filter((timetable) => timetable.addDay === "monday").map((timetable, index) => (
                            <div className="row" >
                                <div className="card">
                                    <a className="card-detail colorPrimary-800" onClick={() => openDetailtimetable(this, timetable)}>
                                        <p>{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked[timetable.id]}
                                                onChange={() => handleToggle(timetable.id)}
                                            />
                                            <div className="slider"></div>
                                        </label>

                                        <img src={edit} className="icon" onClick={() => openEdittimetable(this, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "monday").length === 0 && (
                            <div className="row" >
                                <div className="card">
                                    <p>ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <p>วันอังคาร</p>
                        {timetable.filter((timetable) => timetable.addDay === "tuesday").map((timetable, index) => (
                            <div className="row" >
                                <div className="card">
                                    <a className="card-detail colorPrimary-800" onClick={() => openDetailtimetable(this, timetable)}>
                                        <p>{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={() => openEdittimetable(this, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "tuesday").length === 0 && (
                            <div className="row" >
                                <div className="card">
                                    <p>ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <p>วันพุธ</p>
                        {timetable.filter((timetable) => timetable.addDay === "wednesday").map((timetable, index) => (
                            <div className="row" >
                                <div className="card">
                                    <a className="card-detail colorPrimary-800" onClick={() => openDetailtimetable(this, timetable)}>
                                        <p>{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={() => openEdittimetable(this, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "wednesday").length === 0 && (
                            <div className="row" >
                                <div className="card">
                                    <p>ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <p>วันพฤหัสบดี</p>
                        {timetable.filter((timetable) => timetable.addDay === "thursday").map((timetable, index) => (
                            <div className="row" >
                                <div className="card">
                                    <a className="card-detail colorPrimary-800" onClick={() => openDetailtimetable(this, timetable)}>
                                        <p>{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={() => openEdittimetable(this, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "thursday").length === 0 && (
                            <div className="row" >
                                <div className="card">
                                    <p>ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <p>วันศุกร์</p>
                        {timetable.filter((timetable) => timetable.addDay === "friday").map((timetable, index) => (
                            <div className="row" >
                                <div className="card">
                                    <a className="card-detail colorPrimary-800" onClick={() => openDetailtimetable(this, timetable)}>
                                        <p>{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={() => openEdittimetable(this, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "friday").length === 0 && (
                            <div className="row" >
                                <div className="card">
                                    <p>ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="system-item border-L">

                    <div id="Addtimetable">
                        <form onSubmit={submitForm}>
                            <div className="system-top">
                                <button type="button" onClick={openAddtimetable} className="colorPrimary-800 system-top-item" id="backTopic">❮ เพิ่มเวลาเข้าทำการแพทย์</button>
                            </div>
                            <p>คลินิก <p className="textBody-big">คลินิกทั่วไป</p></p>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">วัน</label>
                                <select
                                    name="Day"
                                    value={addDay}
                                    onChange={(e) => { inputValue("addDay")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled> กรุณาเลือกวัน </option>
                                    <option value="monday">วันจันทร์</option>
                                    <option value="tuesday">วันอังคาร</option>
                                    <option value="wednesday">วันพุธ</option>
                                    <option value="thursday">วันพฤหัสบดี</option>
                                    <option value="friday">วันศุกร์</option>
                                </select>
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">ช่วงเวลาเปิดให้บริการ</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeStart}
                                    onChange={inputValue("timeStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeEnd}
                                    onChange={inputValue("timeEnd")}
                                    placeholder="00:00"
                                />
                            </div>

                            <div>
                                <label className="textBody-big2 colorPrimary-800">ช่วงเวลาเปิดให้นัดหมาย</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentStart}
                                    onChange={inputValue("timeAppointmentStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentEnd}
                                    onChange={inputValue("timeAppointmentEnd")}
                                    placeholder="00:00"
                                />
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">จำนวคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberAppointment} onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <button type="button" onClick={openAddtimetable} className="btn-secondary" id="btn-systrm">กลับ</button>
                            <input type="submit" value="เพิ่มช่วงเวลา" className="btn-primary" id="btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                        </form>
                    </div>
                    <div id="Edittimetable">
                        <form onSubmit={editForm}>
                            <div className="system-top">
                                <button type="button" onClick={() => openEdittimetable()} className="colorPrimary-800 system-top-item" id="backTopic">❮ แก้ไขเวลาเข้าทำการแพทย์</button>
                            </div>
                            <p>คลินิก <p className="textBody-big">คลินิกทั่วไป</p></p>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">วัน</label>
                                <select
                                    name="Day"
                                    value={addDay}
                                    onChange={(e) => { inputValue("addDay")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled> กรุณาเลือกวัน </option>
                                    <option value="monday">วันจันทร์</option>
                                    <option value="tuesday">วันอังคาร</option>
                                    <option value="wednesday">วันพุธ</option>
                                    <option value="thursday">วันพฤหัสบดี</option>
                                    <option value="friday">วันศุกร์</option>
                                </select>
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">ช่วงเวลาเปิดให้บริการ</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeStart}
                                    onChange={inputValue("timeStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeEnd}
                                    onChange={inputValue("timeEnd")}
                                    placeholder="00:00"
                                />
                            </div>

                            <div>
                                <label className="textBody-big2 colorPrimary-800">ช่วงเวลาเปิดให้นัดหมาย</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentStart}
                                    onChange={inputValue("timeAppointmentStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentEnd}
                                    onChange={inputValue("timeAppointmentEnd")}
                                    placeholder="00:00"
                                />
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">จำนวคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberAppointment} disabled onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <button onClick={() => openEdittimetable()} className="btn-secondary" id="btn-systrm" >กลับ</button>
                            <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary" id="btn-systrm" target="_parent" />
                        </form>
                    </div>
                    <div id="Detailtimetable" className="colorPrimary-800">
                        <h3 className="center">รายละเอียด</h3>
                        <p id="Detailclinic">คลินิก : คลินิกทั่วไป</p>
                        <p id="Detailday">วัน :</p>
                        <p id="Detailtimeall">ช่วงเวลาเปิดให้บริการ :</p>
                        <p id="Detailtime">ช่วงเวลาเปิดให้นัดหมาย :</p>
                        <p id="Detailqueue">จำนวนคิวนัดหมาย :</p>
                        <p id="Detail">ช่วงเวลาคิวนัดหมาย :</p>


                    </div>

                </div>




            </div>



        </div>

    );
}

export default TimetableComponent;