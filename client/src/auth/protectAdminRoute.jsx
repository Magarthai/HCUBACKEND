import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, db } from '../firebase/config';
import Swal from "sweetalert2";

function ProtectAdminRoute({ children }) {
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
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

                        if (currentUserData.role === 'user') {
                            console.log('User is not an admin');

                            await logOut();
                            Swal.fire({
                                icon: "error",
                                title: "Alret",
                                text: "You are not ADMIN!",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate('/login');
                                }
                            });

                        }

                        console.log(currentUserData)
                    } else {
                        console.log('User not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectAdminRoute;
