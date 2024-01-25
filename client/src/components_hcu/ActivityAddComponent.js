import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import img_activity from "../picture/img-activity.png";


const ActivityAddComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();

    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",

    })

    const {activityName, activityDetail, activityType} = state
    
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

  
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };

        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
    
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

    function getShowTime() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;

    const submitForm = async (e) => {

    }

    return (
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ระบบการจัดการกิจกรรม</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
            
            <div className="admin-body">
                <form onSubmit={submitForm}>
                    <div className="admin-activity-add">
                        <div className="admin-activity-add-hearder-flexbox">
                            <div className="admin-activity-today-hearder-box">
                                <img src={img_activity} className="admin-img-activity"/>
                                <br></br>
                                <br></br>
                                <div className="admin-right">
                                    <input type="file" className="form-control input-activity-img" accept="image/png, image/jpeg" />
                                </div>
                            </div>
                            <div className="admin-activity-today-hearder-box admin-activity-form">
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800">ชื่อกิจกรรม</label>
                                    <input type="text" className="form-control" value={activityName} onChange={inputValue("activityName")} placeholder="Activity" />
                                </div>
                                <div>
                                    <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด</label>
                                    <textarea value={activityDetail} onChange={inputValue("activityDetail")} className="acivity-detail" rows="18"></textarea>
                                </div>
                            </div>
                            <div>
                                    <label className="admin-textBody-large colorPrimary-800">รูปแบบกิจกรรม</label>
                                    <input type="text" className="form-control" value={activityName} onChange={inputValue("activityName")} placeholder="Activity" />
                                </div>
                            
                        </div>
                    </div>
                </form>
                
            </div>
           
        </div>
        
    </div>

    );
}

export default ActivityAddComponent;