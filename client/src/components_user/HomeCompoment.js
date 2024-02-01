import { useState, useEffect } from "react";
import CalendarUserComponent from "./CalendarUserComponent";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';
import NavbarComponent from '../components_user/NavbarComponent';
import function1 from "../picture/functionUser1.png";
import function2 from "../picture/functionUser2.png";
import function3 from "../picture/functionUser3.png";
import function4 from "../picture/functionUser4.png";
import function5 from "../picture/functionUser5.png";
import function6 from "../picture/functionUser6.png";
import function7 from "../picture/functionUser7.png";
import function8 from "../picture/functionUser8.png";
import home from "../picture/home-hcu.png";
import male from "../picture/male.png";
import female from "../picture/female.png";
import { useUserAuth } from "../context/UserAuthContext";
import {useNavigate } from "react-router-dom";

const HomeComponent = (props) => {
    const { user,userData} = useUserAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
      }, [user]);


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>Health Care Unit</h2>
                        <h3>Home</h3>
                    </div>
                    <NavbarComponent/>
            </header>
            <div className="user-body">
                <div className="user-home">
                    <a href="#" role="button"  target="_parent" style={{width:"100%"}}><img src={home} className="user-home-hcu"/></a>
                    <h3 className="colorPrimary-800">Welcome to HCU</h3>
                    <div className="user-home-proflie">
                        <div className="user-home-proflie-box center" style={{width:"30%"}}>
                            {userData &&<img className="user-home-profile-img" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />}
                        </div>
                        
                        <div className="user-home-proflie-box colorPrimary-800">
                            {userData && <div className="admin-textBody-huge">{userData.firstName} {userData.lastName}</div>}
                            {userData && <div className="admin-textBody-small2">{userData.id}</div>}

                        </div>
 
                    </div>
                    <a href="/appointment" role="button"  target="_parent"><img src={function1}/></a>
                    <a href="/appointment" role="button"  target="_parent"><img src={function1}  /></a>
                    <a href="#" role="button"  target="_parent"><img src={function2} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function3} /></a>
                    <a href="/timetable" role="button"  target="_parent"><img src={function4} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function5} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function6}/></a>
                    <a href="#" role="button"  target="_parent" ><img src={function7} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function8} /></a>

                </div>
            </div>
         
           
            
        </div>

    );
}

export default HomeComponent;