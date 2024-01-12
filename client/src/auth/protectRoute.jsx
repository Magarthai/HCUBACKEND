import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

function ProtectRoute({ children }) {
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAdminStatus = () => {
            if (userData && userData.role === 'admin') {
                console.log('User is not an admin');
                navigate('/homeAdmin');
            }

            console.log(userData);
        };

        checkUserAdminStatus();
    }, [navigate]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
export default ProtectRoute;
