import React from 'react';
import '../css/UserChooseClinic.css';
import { Link } from 'react-router-dom';
import NavbarUserComponent from '../components_user/NavbarUserComponent';
import logo1 from '../picture/logo-clinic1.png';
import logo2 from '../picture/logo-clinic2.png';
import logo3 from '../picture/logo-clinic3.png';
import logo4 from '../picture/logo-clinic4.png';

const UserChooseClinic = () => {

  return (

    <div id='xd'>
    <div className="UserChooseClinicComponent">
        <div className="UserChooseClinic">
        <header className="UserChooseClinic-header">
            <div>
            <h1>การนัดหมาย</h1>
            <h2>เลือกคลินิก</h2>
            </div>

            <NavbarUserComponent/>
        </header>
        <h2 className='userrheader' style={{marginLeft:45,marginTop:20}}>คลินิก</h2>
        <div className="clinic-function">
           

                <Link to="/XD" className="clinic-card" style={{marginTop:10}}>
                    <p>
                    <b>คลินิกทั่วไป</b>
                    </p>
                    <img className="clinic" src={logo1} alt="คลินิกทั่วไป" />
                </Link>

                <Link to="#" className="clinic-card">
                    <p>
                    <b>คลินิกเฉพาะทาง</b>
                    </p>
                    <txt>(หู คอ จมูก)</txt>
                    <img className="clinic" src={logo2} alt="คลินิกเฉพาะทาง" />
                </Link>

                <Link to="#" className="clinic-card">
                    <p>
                    <b>คลินิกกายภาพ</b>
                    </p>
                    <img className="clinic" src={logo3} alt="คลินิกกายภาพ" />
                </Link>

                <Link to="#" className="clinic-card">
                    <p>
                    <b>คลินิกฝังเข็ม</b>
                    </p>
                    <img className="clinic" src={logo4} alt="คลินิกฝังเข็ม" />
                </Link>
            </div>

    </div>
    </div>
    </div>
  );
};

export default UserChooseClinic;