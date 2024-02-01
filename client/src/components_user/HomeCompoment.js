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

const HomeComponent = (props) => {


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
                {/* <a class="btn btn-primary" href="/appointment" role="button"  target="_parent">นัดหมาย</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">กิจกรรม</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">สถานะคิว</a>
                <a class="btn btn-primary" href="/timetable" role="button"  target="_parent">ช่วงเวลาเข้าทําการแพทย์</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ตำแหน่งที่ตั้ง</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ข้อมูลทั่วไป</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ประเมินความพึงพอใจ</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">คู่มือการใช้งาน</a> */}
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