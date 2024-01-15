import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';
import "../css/Component.css";
import "../css/UserProfileCompoment.css";
import { db, getDocs, collection } from "../firebase/config";
import { query, where,  } from 'firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";
import male from "../picture/male.png";
import female from "../picture/female.png";


const ProfileEditComponent = (props) => {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        id: "",
        tel: "",
        gender: "",
        password: "",
      });
    
      const {
        firstName,
        lastName,
        email,
        id,
        tel,
        gender,
        password,
      } = state;
    
      const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
      };

    const submitForm = async (e) => {
    }
    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>โปรไฟล์</h2>
                        <h3>รายละเอียดบัญชี</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-profile">
                    <div className="user-profile-info">
                        <form onSubmit={submitForm}>
                            <br></br>
                            <h2 className="colorPrimary-800">แก้ไขโปรไฟล์</h2>
                            <div>
                                <label className="textBody-big colorPrimary-800">ชื่อ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={firstName}
                                    onChange={inputValue("firstName")}
                                    placeholder="ชื่อจริง"
                                />
                            </div>

                            <div>
                                <label className="textBody-big colorPrimary-800">นามสกุล</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastName}
                                    onChange={inputValue("lastName")}
                                    placeholder="นามสกุล"
                                />
                            </div>

                            <div>
                                <label className="textBody-big colorPrimary-800">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={inputValue("email")}
                                    placeholder="karapagos@mail.kmutt.ac.th"
                                />
                            </div>

        
                            <div>
                                <label className="textBody-big colorPrimary-800">เบอร์โทร</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={tel}
                                    onChange={inputValue("tel")}
                                    placeholder="0900000000"
                                    pattern="[0-9]*"
                                />
                            </div>

                            <br/>
                            <input
                                type="submit"
                                value="แก้ไข"
                                className="btn-primary "
                                target="_parent"
                                id="edit"
                            />
                            <br/>
                        </form>
                        <br></br>
                    
                    </div>
                </div>
                
            </div>
         
           
            
        </div>

    );
}

export default ProfileEditComponent;