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


const ProfileUserComponent = (props) => {
    const {user} = useUserAuth();
    const [userData, setUserData] = useState(null);
    const fetchUserData = async () => {
        try {
          if (user && !userData) {
            const usersCollection = collection(db, 'users');
      
            // Create a query to get the document with the specified UID
            const q = query(usersCollection, where('uid', '==', user.uid));
      
            const usersSnapshot = await getDocs(q);
      
            if (!usersSnapshot.empty) {
              // Access the first document (assuming there's only one matching document)
              const currentUserData = usersSnapshot.docs[0].data();
              setUserData(currentUserData);
              console.log('User Data:', currentUserData);
            } else {
              console.log('User not found');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
    
        fetchUserData();
      }, [user]);

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
                        <div className="center">
                            <img className="user-profile-img" src={male} alt="logo health care unit" />
                        </div>
                        {/* <h2 className="colorPrimary-800" style={{marginTop:"-5px",marginBottom:"20px"}}>ข้อมูลทั่วไป</h2> */}
                        <p className="textButton-Normal colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.id}</p>}
                        <p className="textButton-Normal colorPrimary-800">ชื่อ</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.firstName}</p>}
                        <p className="textButton-Normal colorPrimary-800">นามสกุล</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.lastName}</p>}
                        <p className="textButton-Normal colorPrimary-800">email</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{user.email}</p>}
                        <p className="textButton-Normal colorPrimary-800">เบอร์โทร</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.tel}</p>}
                        <p className="textButton-Normal colorPrimary-800">เพศ</p>
                        {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.gender}</p>}
                        <a a className="btn btn-primary" href="/profile/edit" role="button"  target="_parent">แก้ไข</a>
                    </div>

                </div>
                
            </div>
         
           
            
        </div>

    );
}

export default ProfileUserComponent;