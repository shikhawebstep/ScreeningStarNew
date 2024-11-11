import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSidebarContext } from './SidebarContext'; // Correct named import and fix typo

import { FcSalesPerformance, FcCustomerSupport, FcBarChart } from "react-icons/fc";
import {
  FaUser,
  FaFileInvoice,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { GrServices } from "react-icons/gr";

const AdminBar = () => {
  const { handleSectionClick } = useSidebarContext();
  const [activeTab, setActiveTab] = useState(''); // Track the active menu item

  const handleClick = (linkName) => {
    setActiveTab(linkName); // Set the clicked tab as active
    handleSectionClick(linkName); // Call existing function
  };

  return (
    <nav className="bg-gradient-to-r bg-white h-full">
      <div className="container flex flex-col mx-auto  py-4">
        <ul className="flex flex-col   max-w-[225px]">
          
          {/* Employee Credentials */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Employee Credentials' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/admin-createUser"
              className="block items-center p-2 "
              onClick={() => handleClick('Employee Credentials')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaUserShield className="text-4xl m-auto" />
                EMPLOYEE CREDENTIALS
              </div>
            </Link>
          </li>
          
          {/* Client Overview */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Client Overview' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/"
              className="block items-center p-2 "
              onClick={() => handleClick('Client Overview')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaUser className="text-4xl m-auto" />
                CLIENT OVERVIEW
              </div>
            </Link>
          </li>
          
          {/* Billing Dashboard */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Billing Dashboard' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/"
              className="block items-center p-2 s"
              onClick={() => handleClick('Billing Dashboard')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaFileInvoice className="text-4xl m-auto " />
                BILLING DASHBOARD
              </div>
            </Link>
          </li>
          
          {/* Report Master */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Report Master' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/"
              className="block items-center p-2 "
              onClick={() => handleClick('Report Master')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaClipboardList className="text-4xl m-auto" />
                REPORT MASTER
              </div>
            </Link>
          </li>
          
          {/* Client Credentials */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Client Credentials' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/admin-client-credentials"
              className="block items-center p-2 "
              onClick={() => handleClick('Client Credentials')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaClipboardList className="text-4xl m-auto" />
                CLIENT CREDENTIALS
              </div>
            </Link>
          </li>
          
          {/* See More */}
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'See More' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <button
              className="block m-auto items-center w-full p-2"
              onClick={() => handleClick('See More')}
            >
              <div className="p-2 m-auto text-center  " >
                <FcBarChart className="text-4xl m-auto" />
                SEE MORE
              </div>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminBar;
