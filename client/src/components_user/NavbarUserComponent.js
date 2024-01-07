import React from "react";
import "../css/NavbarUserComponent.css";
import { Link, useNavigate } from "react-router-dom"; // นำเข้า useNavigate มาด้วย
import { useUserAuth } from "../context/UserAuthContext";

const NavbarUserComponent = () => {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="navbaruser">
        <div className="navbar">
      <input className="menu-icons" type="checkbox" id="menu-icons" name="menu-icons" />
      <label htmlFor="menu-icons"></label>

      <div className="navs">
          <ul>
            <li><a><Link to="/">นัดหมาย</Link></a></li>
            <li><a><Link to="/">กิจกรรม</Link></a></li>
            <li><a><Link to="/">สถานะคิว</Link></a></li>
            <li><a><Link to="/">ช่วงเวลาเข้าทําการแพทย์</Link></a></li>
            <li><a><Link to="/">ตำแหน่งที่ตั้ง</Link></a></li>
            <li><a><Link to="/">ข้อมูลทั่วไป</Link></a></li>
            <li><a><Link to="/">ประเมินความพึงพอใจ</Link></a></li>
            <li><a><Link to="/">คู่มือการใช้งาน</Link></a></li>
            <li><a><button onClick={handleLogout}>LOG OUT</button></a></li>
          </ul>
        </div>
    </div>
    </div>
    
      
  );
};

export default NavbarUserComponent;
