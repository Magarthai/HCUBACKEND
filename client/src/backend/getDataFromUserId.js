import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion ,deleteDoc,arrayRemove } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const getUserDataFromUserId = async (appointment, userId, timeslot, appointmentuid) => {
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