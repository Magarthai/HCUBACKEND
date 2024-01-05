import React from "react";
import { useEffect,useState} from "react";
import "../css/CalendarComponent.css";

const CalendarComponent = (props) => {
  
  useEffect(() => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentDateElement = document.querySelector(".current-date");
    const dayTag = document.querySelector(".days");
    const prevNextIcon = document.querySelectorAll(".icons span");

    const renderCalendar = () => {
      let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay();
      let lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      let lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay();
      let lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();
      let liTag = "";
  
      for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }

      for (let i = 1; i <= lastDateofMonth; i++) {
        if((i >= currentDate.getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) ||
        (currentMonth > new Date().getMonth() && currentYear === new Date().getFullYear()) ||
        (currentYear > new Date().getFullYear())){
          let isToday = i === currentDate.getDate() && currentMonth == new Date().getMonth() && currentYear === new Date().getFullYear() ? "active" : "";
          liTag += `<li class="${isToday}">${i}</li>`;
        }else{
          liTag += `<li class="inactive">${i}</li>`;
        }
      }

      for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i- lastDayofMonth + 1}</li>`;
      }

      
      currentDateElement.innerHTML = `${months[currentMonth]} ${currentYear}`;
      dayTag.innerHTML = liTag;
      
    };
    renderCalendar();

    prevNextIcon.forEach(icon => {
      icon.addEventListener("click", () => {
        currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;

        if(currentMonth < 0 || currentMonth >11){
          currentYear += Math.floor(currentMonth / 12);
          currentMonth = (currentMonth + 12) % 12;
        }else{
          currentDate = new Date();

        }
        renderCalendar();
      });
    });

  }, []);

      
    
    return (
      <div className="wrapper">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <header>
          <div className="icons">
            <span id="prev" className="material-symbols-outlined">chevron_left</span>
            <p className="current-date"></p>
            <span id="next" className="material-symbols-outlined">chevron_right</span>
          </div>
        </header>
        <div className="calendar">
          <ul className="weeks">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="days">
          
          </ul>
        </div>
       
      </div>
    );
  };

export default CalendarComponent;
