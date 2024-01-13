import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";
import LoginComponent from "./components_all/LoginComponent"
import SignupComponent from "./components_all/SignupComponent";
import AdminHomeComponent from "./components_hcu/HomeComponent"
import ProtectAdminRoute from './auth/protectAdminRoute.jsx';
import AdminAppointmentComponent from "./components_hcu/AppointmentComponent"
import GeneralTimetableComponent from "./components_hcu/TimetableGeneralComponent.js"
import SpecialTimetableComponent from "./components_hcu/TimetableSpecialComponent"
import PhysicalTimetableComponent from "./components_hcu/TimetablePhysicalComponent"
import NeedleTimetableComponent from "./components_hcu/TimetableNeedleComponent"
import AppointmentManagerComponent from './components_hcu/AppointmentManagerComponent.js';
import AppointmentDetail from './components_user/AppointmentDetail.js';
import UserChooseClinic from './components_user/UserChooseClinic.js';
import ExampleComponent from './components_user/ExampleComponent.js';
import UserAllAppointment from './components_user/UserAllAppointment.js';
import SelectDateAppointmentUser from './components_user/SelectDateAppointmentUser.js';
import ListAppointmentUser from './components_user/ListAppointmentUser.js';
import AdminAppointmentManagerPhysicalComponent from './components_hcu/AppointmentManagerPhysicalComponent.js';
import UserDateateAppointment from './components_user/DateAppointment.js';
import AddAppointmentUser from './components_user/AddAppointmentUser.js';
import AdminAppointmentRequestManagementComponent from './components_hcu/AppointmentRequestManagementComponent.js';
import AdminAppointmentRequestManagementHistoryComponent from './components_hcu/AppointmentRequestManagementHistoryComponent.js';
import AdminQueueManagementSystemComponent from './components_hcu/QueueManagementSystemComponent.js';
import UserHomeComponent from './components_user/HomeCompoment.js';
import UserEditAppointment from "./components_user/UserEditAppointment.js"
import UserHistoryAppointment from "./components_user/UserHistoryAppointment.js"
import './index.css'
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ProtectRoute from './auth/protectRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginComponent />
  },
  {
    path: "/signup",
    element: <SignupComponent />
  },
  {
    path: "/homeUser",
    element: <ProtectRoute><AdminHomeComponent /></ProtectRoute>
  },
  {
    path: "/homeAdmin",
    element: <ProtectAdminRoute><AdminHomeComponent /></ProtectAdminRoute>
  },
  {
    path: "/timeTableGeneralAdmin",
    element: <ProtectAdminRoute><GeneralTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/timeTableSpecialAdmin",
    element: <ProtectAdminRoute><SpecialTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/timeTablePhysicalAdmin",
    element: <ProtectAdminRoute><PhysicalTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/timeTableNeedleAdmin",
    element: <ProtectAdminRoute><NeedleTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/appointmentAdmin",
    element: <ProtectAdminRoute><AdminAppointmentComponent/></ProtectAdminRoute>
  },
  {
    path: "/AppointmentManagerComponent",
    element: <ProtectAdminRoute><AppointmentManagerComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentManagerPhysicalComponent",
    element: <ProtectAdminRoute><AdminAppointmentManagerPhysicalComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentRequestManagementComponent",
    element: <ProtectAdminRoute><AdminAppointmentRequestManagementComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentRequestManagementHistoryComponent",
    element: <ProtectAdminRoute><AdminAppointmentRequestManagementHistoryComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminQueueManagementSystemComponent",
    element: <ProtectAdminRoute><AdminQueueManagementSystemComponent/></ProtectAdminRoute>
  },

  {
    path: "/appointment/detail",
    element: <ProtectRoute><AppointmentDetail/></ProtectRoute>
  },
  {
    path: "/appointment",
    element: <ProtectRoute><UserAllAppointment/></ProtectRoute>
  },
  {
    path: "/appointment/clinic",
    element: <ProtectRoute><UserChooseClinic/></ProtectRoute>
  },
  {
    path: "/appointment/list",
    element: <ProtectRoute><ListAppointmentUser/></ProtectRoute>
  },
  {
    path: "/appointment/date",
    element: <ProtectRoute><UserDateateAppointment/></ProtectRoute>
  },
  {
    path: "/exampleAppointment",
    element: <ProtectRoute><ExampleComponent/></ProtectRoute>
  },
  {
    path: "/appointment/add",
    element: <ProtectRoute><AddAppointmentUser/></ProtectRoute>
  },
  {
    path: "/home",
    element: <ProtectRoute><UserHomeComponent/></ProtectRoute>
  },
  {
    path: "/apppointment/edit",
    element: <ProtectRoute><UserEditAppointment/></ProtectRoute>
  },
  {
    path: "/apppointment/history",
    element: <ProtectRoute><UserHistoryAppointment/></ProtectRoute>
  },
  {
    path: "/appointment/selectDate",
    element: <ProtectRoute><SelectDateAppointmentUser/></ProtectRoute>
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>
)