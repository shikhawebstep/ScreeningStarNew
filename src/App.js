import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { SidebarProvider } from './Components/SidebarContext'; // Corrected named import
import Submenu from './Components/Submenu.js';
import AdminBar from "./Components/adminBar";
import UserBar from "./Components/userBar.js";
import AdminHeader from "./Components/adminHeader.js"
import AdminLogin from "./Components/admin-Login";
import UserLogin from "./Components/userLogin";
import Dashboard from "./Components/Pages/dashboard";
import AddClient from "./Components/Pages/addClient";
import ScreeningstarAdmin from "./Components/Pages/screeningstarAdmin";
import CreateInvoice from "./Components/Pages/createInvoice";
import AdminManager from "./Components/Pages/adminManager";
import ReportMaster from "./Components/Pages/reportMaster";
import ClientCredentials from "./Components/Pages/clientCredentials";
import TATReminder from "./Components/Pages/tatReminder";
import Acknowledgement from "./Components/Pages/acknowledgement";
import CreateUser from "./Components/Pages/createUser";
import ClientSpoc from "./Components/Pages/clientSpoc";
import ActiveAccounts from "./Components/Pages/activeAccounts";
import InactiveClients from "./Components/Pages/inactiveClients";
import GenerateInvoice from "./Components/Pages/generateInvoice";
import RecordTrackers from "./Components/Pages/recordsTrackers";
import InvoiceMaster from "./Components/Pages/invoiceMaster";
import EscalationManager from "./Components/Pages/escalationManager";
import BillingSpoc from "./Components/Pages/billingSpoc";
import BillingEscalation from "./Components/Pages/billingEscalation";
import AuthorizedDetails from "./Components/Pages/authorizedDetails";
import ExistingUsers from "./Components/Pages/existingUsers";
import ApplicationStatus from "./Components/Pages/applicationStatus";
import AdminChekin from "./Components/Pages/adminChekin";
import GenerateReport from "./Components/Pages/generateReport.js";
import Form1 from "./Components/Pages/CandidateApplication/form1.js";
import Form2 from "./Components/Pages/CandidateApplication/form2.js";
import Form3 from "./Components/Pages/CandidateApplication/form3.js";
import EditUser from "./Components/Pages/editUser.js";
import PrepareReport from "./Components/Pages/prepareReport.js";
import ServiceManagement from "./Components/Pages/serviceManagment.js";
import PackageManagement from "./Components/Pages/packageManagment.js";
import LoginCheck from './Components/Pages/LoginCheck.js';
import IsNotLogin from './Components/Pages/isNotLogin.js';
import DataManagement from "./Components/Pages/dataManagment.js";
import TeamManagment from "./Components/Pages/teamManagment.js";
import ClientManagementData from "./Components/Pages/admin-clienttable.js";
import 'react-select-search/style.css'
import SelectSearch from 'react-select-search';
import AdminForgotPassword from './Components/Pages/Admin-Forgot-Password';
import AdminSetPassword from './Components/Pages/Admin-Set-Password';
import AdminUpdatePassword from "./Components/Pages/Admin-Update-Password.js"
import BranchLoginCheck from './Components/Pages/Branch-LoginCheck.js';


import UserDashboard from "./Components/UserPages/userDashboard.js"
import UserCreate from "./Components/UserPages/createUser.js";
import VerificationStatus from "./Components/UserPages/VerificationStatus.js";
import BulkApplication from "./Components/UserPages/BulkApplication.js";
import ChecklistAndEscalation from "./Components/UserPages/ChecklistAndEscalation.js";
import MasterDashboard from "./Components/UserPages/MasterDashboard.js";
import CreateTickets from "./Components/UserPages/CreateTickets.js";
import ApiIntegration from "./Components/UserPages/ApiIntegration.js";
import CandidateManager from "./Components/UserPages/CandidateManager.js";
import ClientManager from "./Components/UserPages/ClientManager.js";
import DataTable from "./Components/UserPages/innerpages/MasterTable.js";
import UserHeader from "./Components/UserPages/userHeader.js";
import UserForgotPassword from './Components/UserPages/User-Forgot-Password';
import UserSetPassword from "./Components/UserPages/User-reset-password";
import UserUpdatePassword from "./Components/UserPages/User-Update-Password";
import { ClientProvider } from "./Components/Pages/ClientContext.js";
import EditClient from "./Components/Pages/EditClient.js";

const Layout = () => {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith("/user");
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/";
  const hideSidebarAndHeader =
    location.pathname === "/admin-login" ||
    location.pathname === "/admin-forgot-password" ||
    location.pathname === "/user-forgot-password" ||
    location.pathname === "/admin-set-password" ||
    location.pathname === "/branch/reset-password" ||
    location.pathname === "/userLogin";


  return (
    <div className="">
      <div className="flex flex-col h-screen">
        {!hideSidebarAndHeader && (
          <>
            {isUserRoute && !isAdminRoute && <UserHeader />}
            {isAdminRoute && !isUserRoute && <AdminHeader />}
          </>
        )}
        <div className="flex flex-grow">
          {!hideSidebarAndHeader && (
            <>
              {isUserRoute && <UserBar />}
              {isAdminRoute && !isUserRoute && <AdminBar />}
            </>
          )}
          <div className="flex-grow w-full overflow-hidden mr-[20px]">
            {!hideSidebarAndHeader && <Submenu />}
            <Routes>


              <Route path="/userLogin" element={<UserLogin />} />
              <Route path="/" element={<LoginCheck><Dashboard /></LoginCheck>} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-forgot-password" element={<IsNotLogin><AdminForgotPassword /></IsNotLogin>} />
              <Route path="/reset-password" element={<IsNotLogin><AdminSetPassword /></IsNotLogin>} />
              <Route path="/admin-update-password" element={<LoginCheck><AdminUpdatePassword /></LoginCheck>} />
              <Route path="/admin-add-new-client" element={<LoginCheck><AddClient /></LoginCheck>} />
              <Route path="/admin-editclient" element={<LoginCheck><EditClient /></LoginCheck>} />
              <Route path="/admin-screeningstar-admin" element={<LoginCheck><ScreeningstarAdmin /></LoginCheck>} />
              <Route path="/admin-create-invoice" element={<LoginCheck><CreateInvoice /></LoginCheck>} />
              <Route path="/admin-admin-manager" element={<LoginCheck><AdminManager /></LoginCheck>} />
              <Route path="/admin-report-master" element={<LoginCheck><ReportMaster /></LoginCheck>} />
              <Route path="/admin-client-credentials" element={<LoginCheck><ClientCredentials /></LoginCheck>} />
              <Route path="/admin-tat-reminder" element={<LoginCheck><TATReminder /></LoginCheck>} />
              <Route path="/admin-acknowledgement" element={<LoginCheck><Acknowledgement /></LoginCheck>} />
              <Route path="/admin-createUser" element={<LoginCheck><CreateUser /></LoginCheck>} />
              <Route path="/admin-client-spoc" element={<LoginCheck><ClientSpoc /></LoginCheck>} />
              <Route path="/admin-escalation-manager" element={<LoginCheck><EscalationManager /></LoginCheck>} />
              <Route path="/admin-billing-spoc" element={<LoginCheck><BillingSpoc /></LoginCheck>} />
              <Route path="/admin-billing-esclation" element={<LoginCheck><BillingEscalation /></LoginCheck>} />
              <Route path="/admin-authorized-details" element={<LoginCheck><AuthorizedDetails /></LoginCheck>} />
              <Route path="/admin-active-account" element={<LoginCheck><ActiveAccounts /></LoginCheck>} />
              <Route path="/admin-inactive-clients" element={<LoginCheck><InactiveClients /></LoginCheck>} />
              <Route path="/admin-generate-invoice" element={<LoginCheck><GenerateInvoice /></LoginCheck>} />
              <Route path="/admin-records-and-trackers" element={<LoginCheck><RecordTrackers /></LoginCheck>} />
              <Route path="/admin-invoice-master" element={<LoginCheck><InvoiceMaster /></LoginCheck>} />
              <Route path="/admin-existing-users" element={<LoginCheck><ExistingUsers /></LoginCheck>} />
              <Route path="/admin-application-status" element={<LoginCheck><ApplicationStatus /></LoginCheck>} />
              <Route path="/admin-chekin" element={<LoginCheck><AdminChekin /></LoginCheck>} />
              <Route path="/admin-generate-report" element={<LoginCheck><GenerateReport /></LoginCheck>} />
              <Route path="/form1" element={<LoginCheck><Form1 /></LoginCheck>} />
              <Route path="/form2" element={<LoginCheck><Form2 /></LoginCheck>} />
              <Route path="/form3" element={<LoginCheck><Form3 /></LoginCheck>} />
              <Route path="/admin-editUser/:userId" element={<LoginCheck><EditUser /></LoginCheck>} />
              <Route path="/admin-prepare-report" element={<LoginCheck><PrepareReport /></LoginCheck>} />
              <Route path="/admin-service-management" element={<LoginCheck><ServiceManagement /></LoginCheck>} />
              <Route path="/admin-package-management" element={<LoginCheck><PackageManagement /></LoginCheck>} />
              <Route path="/admin-data-management" element={<LoginCheck><DataManagement /></LoginCheck>} />
              <Route path="/admin-team-management" element={<LoginCheck><TeamManagment /></LoginCheck>} />
              <Route path="/admin-clienttable" element={<LoginCheck><ClientManagementData /></LoginCheck>} />


              <Route path="/user-dashboard" element={<BranchLoginCheck><UserDashboard /></BranchLoginCheck>} />

              <Route path="/user-create" element={<BranchLoginCheck> <UserCreate /></BranchLoginCheck>} />
              <Route path="/user-candidateManager" element={<BranchLoginCheck><CandidateManager /></BranchLoginCheck>} />
              <Route path="/user-verificationStatus" element={<BranchLoginCheck><VerificationStatus /></BranchLoginCheck>} />
              <Route path="/user-bulkApplication" element={<BranchLoginCheck><BulkApplication /></BranchLoginCheck>} />
              <Route path="/user-checklistAndEscalation" element={<BranchLoginCheck><ChecklistAndEscalation /></BranchLoginCheck>} />
              <Route path="/user-MasterDashboard" element={<BranchLoginCheck><MasterDashboard /> </BranchLoginCheck>} />
              <Route path="/user-createTickets" element={<BranchLoginCheck><CreateTickets /></BranchLoginCheck>} />
              <Route path="/user-ApiIntegration" element={<BranchLoginCheck><ApiIntegration /></BranchLoginCheck>} />
              <Route path="/user-ClientManager" element={<BranchLoginCheck><ClientManager /></BranchLoginCheck>} />
              <Route path="/user-DataTable" element={<BranchLoginCheck><DataTable /></BranchLoginCheck>} />
              <Route path="/user-forgot-password" element={<UserForgotPassword />} />
              <Route path="/branch/reset-password" element={<UserSetPassword />} />
              <Route path="/user-update-password" element={<BranchLoginCheck><UserUpdatePassword /></BranchLoginCheck>} />




            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (

    <SidebarProvider>
      <ClientProvider>
        <Router basename="/demo/screening">
          <Layout />
        </Router>
      </ClientProvider>
    </SidebarProvider>
  );
};

export default App;
