import { useState, useEffect } from "react";
import CalendarUserComponent from "./CalendarUserComponent";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';
import NavbarComponent from '../components_user/NavbarComponent';
import function0 from "../picture/functionUser0.png";
import function1 from "../picture/functionUser1.png";
import function2 from "../picture/functionUser2.png";
import function3 from "../picture/functionUser3.png";
import function4 from "../picture/functionUser4.png";
import function5 from "../picture/functionUser5.png";
import function6 from "../picture/functionUser6.png";
import function7 from "../picture/functionUser7.png";
import function8 from "../picture/functionUser8.png";
import right from "../picture/right.png";
import home from "../picture/home-hcu.png";
import male from "../picture/male.png";
import female from "../picture/female.png";
import liff from '@line/liff';
import { useUserAuth } from "../context/UserAuthContext";
import {Link, useNavigate } from "react-router-dom";
const HomeComponent = (props) => {
    const { user,userData} = useUserAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        initLine();
      }, [user]);

      const [idToken, setIdToken] = useState("");
      const [displayName, setDisplayName] = useState("");
      const [statusMessage, setStatusMessage] = useState("");
      const [userId, setUserId] = useState("");
    
    
      const initLine = () => {
        liff.init({ liffId: '1655665373-YAopzeO6' }, () => {
        if (liff.isInClient()) {
          runApp();
        } else {
          console.log('Not running within the LINE app\'s WebViewSS');
        }
    }, err => console.error(err));
}
    
      const runApp = () => {
        const idToken = liff.getIDToken();
        setIdToken(idToken);
        liff.getProfile().then(profile => {
          console.log(profile);
          setDisplayName(profile.displayName);
          setStatusMessage(profile.statusMessage);
          setUserId(profile.userId);
        }).catch(err => console.error(err));
      }
    
      useEffect(() => {
        initLine();
      }, []);

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
                    <a href="/profile" target="_parent">
                    <div className="user-home-proflie" >
                        
                        <div className="user-home-proflie-box center" style={{width:"15%", paddingLeft:"4%"}}>
                            {userData &&<img className="user-home-profile-img" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />}
                        </div>
                        
                        <div className="user-home-proflie-box colorPrimary-800" style={{width:"70%", justifyContent:"flex-start", paddingLeft:"6%"}}>
                            {userData && <div className="admin-textBody-huge">{userData.firstName} {userData.lastName} <br></br> <div className="admin-textBody-small2">{userData.id}</div></div> }
                        </div>
                        <div className="user-home-proflie-box admin-right" style={{width:"15%"}}>
                            <img src={right} style={{width:"40px", height:"40px"}} />
                        </div>
                        <div id="profile">{userId}</div>
                        
 
                    </div>
                    </a>                 
                    <div className="user-home-list">
                    <a href="#" role="button"  target="_parent"><img src={function0}/><p>หน้าแรก</p></a>
                    <a href="/appointment" role="button"  target="_parent"><img src={function1}/><p>นัดหมาย</p></a>
                    <a href="/activitty" role="button"  target="_parent"><img src={function2}/><p>กิจกรรม</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function3}/><p>สถานะคิว</p></a>
                    <a href="/timetable" role="button"  target="_parent"><img src={function4}/><p>ช่วงเวลาเข้าทําการแพทย์</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function5}/><p>ตำแหน่งที่ตั้ง</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function6}/><p>ข้อมูลทั่วไป</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function7}/><p>ประเมินความพึงพอใจ</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function8}/><p>คู่มือการใช้งาน</p></a>
                    {/* <a href="/appointment" role="button"  target="_parent"><img src={function1}/><p>นัดหมาย</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function2} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function3} /></a>
                    <a href="/timetable" role="button"  target="_parent"><img src={function4} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function5} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function6}/></a>
                    <a href="#" role="button"  target="_parent" ><img src={function7} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function8} /></a> */}
                    </div>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default HomeComponent;