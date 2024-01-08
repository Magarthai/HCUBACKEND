import React, { useEffect, useState } from "react";
import "../css/CalendarComponent.css";

const CalendarUserComponent = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dateElements = document.querySelectorAll(".calendar .days li");
  dateElements.forEach((dateElement) => {
    dateElement.addEventListener("click", handleDateClick);
  });

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
      let isToday =
        i === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear()
          ? "active"
          : "";

      liTag += `<li class="${isToday}" data-day="${i}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }


    currentDateElement.innerHTML = `${months[currentMonth]} ${currentYear}`;
    dayTag.innerHTML = liTag;

    const dateElements = document.querySelectorAll(".days li");
    dateElements.forEach((dateElement) => {
      dateElement.removeEventListener("click", handleDateClick);
      dateElement.addEventListener("click", handleDateClick);
    });
  };

  const handleDateClick = (event) => {
    const selectedDate = event.currentTarget.dataset.day;
    setCurrentDate(new Date(currentYear, currentMonth, selectedDate));

    // Remove the 'selected' class from all date elements
    const dateElements = document.querySelectorAll(".days li");
    dateElements.forEach((dateElement) => {
      dateElement.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked date
    event.currentTarget.classList.add("selected");
  };

  useEffect(() => {
    renderCalendar();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    prevNextIcon.forEach((icon) => {
      icon.addEventListener("click", () => {
        setCurrentMonth((prevMonth) => (icon.id === "prev" ? (prevMonth === 0 ? 11 : prevMonth - 1) : (prevMonth === 11 ? 0 : prevMonth + 1)));
        setCurrentYear((prevYear) => (icon.id === "prev" ? (currentMonth === 0 ? prevYear - 1 : prevYear) : (currentMonth === 11 ? prevYear + 1 : prevYear)));
      });
    });
  }, []);

  return (
    <div className="wrapper" id="userCalendar">
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

export default CalendarUserComponent;
