import React, { useState, useEffect } from "react";
import logo from "../picture/LogoHCU.png";
import "../css/Login&SignupComponent.css";
import Swal from "sweetalert2";
import { auth } from '../firebase/config';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import HCU from "../picture/HCU.jpg";
import { getDocs, query, where } from 'firebase/firestore';
import "../css/Component.css";



const SignupComponent = (props) => {
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
  
    const isSubmitEnabled =
      !firstName || !lastName || !email || !id || !tel || !gender || !password;
  
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const db = getFirestore();
  
    const validateInput = () => {
      if (!email.includes('@')) {
        alert('Please enter a valid email.');
        return false;
      }
      if (password.length < 8) {
        alert('Password must be at least 8 characters.');
        return false;
      }
      return true;
    };
    const isStudentIdAlreadyUsed = async (studentId) => {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollection, where('id', '==', studentId)));
      
        return !querySnapshot.empty;
      };
    
      
      const submitForm = async (e) => {
        e.preventDefault();
      
        if (!validateInput()) {
          return;
        }
      
        try {
      
          const isIdAlreadyUsed = await isStudentIdAlreadyUsed(id);
          if (isIdAlreadyUsed) {
            throw new Error("Student ID already in use");
          }
      
      
          const userCredential = await createUserWithEmailAndPassword(email, password);
          if (!userCredential || !userCredential.user) {
            throw new Error("Failed to create user account.");
          }
      
          const { user } = userCredential;
      
          const additionalUserInfo = {
            uid: user.uid,
            firstName,
            lastName,
            tel,
            id,
            gender,
            role: "user",
          };
      
          await addDoc(collection(db, 'users'), additionalUserInfo);
      
          Swal.fire({
            icon: "success",
            title: "Account Created",
            text: "Your account has been successfully created!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/home';
            }
          });
      
        } catch (firebaseError) {
          console.error('Firebase signup error:', firebaseError);
        
          if (firebaseError.message === "Failed to create user account.") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Invalid Email or Email already in use",
            });
          } else if (firebaseError.message === "Student ID already in use") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Student ID already in use",
            });
          } else {
            console.error('Firebase error response:', firebaseError);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to create user account. Please try again later.",
            });
          }
        }
        
      };
      
      const [selectedCount, setSelectedCount] = useState(1);

      const handleSelectChange = () => {
          setSelectedCount(selectedCount + 1);
          console.log(selectedCount)
      };
  
    useEffect(() => {
      document.title = 'Health Care Unit';
    }, []);
 
    return(
        <div>
            <div className="login-flexbox">
                <div className="login-flexbox-item">
                    <header className="signup-hearder">
                        <img className="logo" src={logo} alt="logo health care unit" />
                        <h3 className="colorPrimary-800">Health Care Unit</h3>
                        <p className="textBody-medium colorPrimary-800">กลุ่มงานบริการสุขภาพและอนามัย</p>
                        <hr></hr>
                    
                    </header>
            
        <form onSubmit={submitForm}>
        <h2 className="colorPrimary-800">Sign up</h2>
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
          <label className="textBody-big colorPrimary-800">
            Student ID/Personnel ID
          </label>
          <input
            type="text"
            className="form-control"
            value={id}
            onChange={inputValue("id")}
            pattern="[0-9]*"
            placeholder="64000000000"
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

        <div>
          <label className="textBody-big colorPrimary-800">เพศ</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => {
              inputValue("gender")(e);
              handleSelectChange();

            }}
             className={selectedCount >= 2 ? 'selected' : ''}
          >
            <option value="" disabled>
              กรุณาเลือกเพศ
            </option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        <div>
          <label className="textBody-big colorPrimary-800">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={inputValue("password")}
            placeholder="password"
          />
        </div>

        <br />
        <input
          type="submit"
          value="SIGNUP"
          className="btn-primary "
          target="_parent"
          disabled={isSubmitEnabled}
          id="signup"
        />
        <br />
      </form>

      <div className="center">
        <a href="/" role="button" className="colorPrimary-800 " target="_parent" style={{textDecoration:"underline"}}>
          มีบัญชีแล้ว Log in
        </a>
        <p className="textBody-small singup-kmutt">
          King Mongkut's University of Technology Thonburi
        </p>
        {error && <p className="text-red-500 text-center mt-2">{error.message}</p>}
      </div>
                </div>
                <img className="login-hcu-image" src={HCU} alt="health care unit" />
            </div>
                
       
        </div>
    );
}

export default SignupComponent;