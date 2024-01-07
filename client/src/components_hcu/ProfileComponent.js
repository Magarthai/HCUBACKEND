import { useState, useEffect } from "react";
import CalendarUserComponent from "../components_user/CalendarUserComponent";
import "../css/Login&SignupComponent.css";

const ProfileComponent = (props) => {


    return (
        <div className="profile">
           <CalendarUserComponent/>
            
        </div>

    );
}

export default ProfileComponent;