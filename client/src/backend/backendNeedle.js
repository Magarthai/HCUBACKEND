import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion ,deleteDoc,arrayRemove } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { getUserDataFromUserId } from './getDataFromUserId'
export const fetchTimeTableDataNeedle = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDate.dayName),
                where('clinic', '==', 'คลินิกฝั่งเข็ม')
            ));

            const timeTableData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return timeTableData;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

export const fetchUserDataWithAppointmentsNeedle = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const appointmentsCollection = collection(db, 'appointment');
            const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', 
            `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
            where('clinic', '==', 'คลินิกฝั่งเข็ม')));

           
            const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                const appointmentData = doc.data();
                return {
                    appointmentId: doc.id,
                    appointmentuid: doc.id,
                    ...appointmentData,
                };
            });
            
            return existingAppointments

            
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
export const fetchAppointmentUsersDataNeedle = async (existingAppointments) => {
    const timeTableCollection = collection(db, 'timeTable');
    console.log(existingAppointments,"test1")
    const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
        console.log("test2" , existingAppointments)
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

    return AppointmentUsersDataArray;
}

export const availableTimeSlotsNeedle = async (filteredTimeTableData, selectedDate, db) => {
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

    const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
        !existingAppointments.some(existingSlot =>
            existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
        )
    );

    return availableTimeSlots;
};

const DeleteAppointmentNeedle = async (appointmentuid, uid) => {
    const timetableRef = doc(db, 'appointment', appointmentuid);

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
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteDoc(timetableRef);

                console.log("Appointment deleted:", appointmentuid);

                const userRef = doc(db, "users", uid);

                await updateDoc(userRef, {
                    "appointments": arrayRemove("appointments", appointmentuid)
                });
                window.location.reload();
                Swal.fire(
                    {
                        title: 'การลบการนัดหมายสำเร็จ!',
                        text: `การนัดหมายถูกลบเรียบร้อยแล้ว!`,
                        icon: 'success',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    })
            } catch (firebaseError) {
                console.error('DeleteAppointment :', firebaseError);
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                {
                    title: 'เกิดข้อผิดพลาด!',
                    text: `ไม่สามารถลบการนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง`,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                }
            );
        }
    });
};

export default DeleteAppointmentNeedle;