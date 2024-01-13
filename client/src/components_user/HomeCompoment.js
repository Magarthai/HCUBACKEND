import { useState, useEffect } from "react";
import CalendarUserComponent from "./CalendarUserComponent";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';


const HomeComponent = (props) => {


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>Health Care Unit - HCU</h2>
                        <h3>Home</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-home">
                <a class="btn btn-primary" href="/appointment" role="button"  target="_parent">นัดหมาย</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">กิจกรรม</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">สถานะคิว</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ช่วงเวลาเข้าทําการแพทย์</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ตำแหน่งที่ตั้ง</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ข้อมูลทั่วไป</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">ประเมินความพึงพอใจ</a>
                <a class="btn btn-primary" href="/" role="button"  target="_parent">คู่มือการใช้งาน</a>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default HomeComponent;