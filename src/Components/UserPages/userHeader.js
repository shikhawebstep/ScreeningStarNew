import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import Modal from "react-modal";
import { GrServices } from "react-icons/gr";
import { FcBriefcase, FcBarChart, FcPortraitMode, FcUpload, FcConferenceCall, FcNightPortrait, FcCustomerSupport, FcMoneyTransfer, FcBusinessman, FcFile, FcDatabase, FcFolder, FcSalesPerformance, FcInspection, FcDocument, FcServices, FcPackage, FcManager, FcApproval, FcCalendar,FcDataSheet, FcTimeline, FcKey } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { } from "react-icons/fc";
import { FaHome } from "react-icons/fa";
import { RiArrowRightWideLine } from "react-icons/ri";
import Logo from "../../imgs/track-master2.png";

import {
  FaUser,
  FaFileInvoice,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSidebarContext } from './../SidebarContext';


Modal.setAppElement("#root");
const UserHeader = () => {
  
  const { handleSectionClick, activeTab, sectionTabs, setActiveTab, setSectionTabs } = useSidebarContext();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [innerDropdowns, setInnerDropdowns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const dropdownRef = useRef(null); 

  const handleSignout = async () => {
    try {
      if (!storedToken) {
        console.error('No token found');
        return;
      }

      const response = await fetch('https://screeningstar.onrender.com/Screeningstar/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      console.log(response);

      if (response.ok) {
        localStorage.clear();
        navigate('/userLogin');
      } else {
        const errorMessage = await response.text();
        console.error('Logout failed:', errorMessage);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    if (openDropdown !== dropdown) {
      
      setInnerDropdowns({});
    }
  };

  const toggleInnerDropdown = (dropdown) => {
    setInnerDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmSignout = () => {
    handleSignout();
    closeModal();
  };

  // Handle click outside dropdown to close it
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null); // Close outer dropdown if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (

    <nav className="bg-gradient-to-l from-gray-200 to-gray-300 shadow">
      <Modal

        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Sign Out Confirmation"
        className="modal absolute bg-white p-5 border shadow-[7px_5px_32px_9px_rgba(0,0,0,0.5)] w-[40%] m-auto shadow-15 top-[200px] right-[530px] text-center"
        overlayClassName="overlay"
      >
        <h2 className="text-lg font-bold">Confirm Sign Out</h2>
        <p>Are you sure you want to sign out?</p>
        <div className="flex justify-center mt-4 w-full">
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmSignout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      </Modal>
      <div className="container flex mx-auto px-4 py-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <button onClick={() => toggleDropdown("dashboard")}>
            <Link className="textdashboard" onClick={() => handleSectionClick('Home')}>
                  <FaHome className="text-[#4d606b] text-3xl mt-2" />
                </Link>
                 </button>
          </div>

<div>
            <div className=" flex relative justify-center items-center ">
            <img src={Logo} className="w-auto  h-12 m-auto  text-center text-[#073d88]" alt="Logo" />
            <div className="absolute right-[-250px] text-lg font-bold mt-2 text-[#4d606b]">
            Hi user...
          </div>
            </div>
          </div>
          <div className="flex items-center ">
          
           
            <button onClick={openModal} type="button" class="border border-red-600 text-red-600  hover:bg-red-600 hover:text-white font-semibold py-2 px-4 rounded">
            Sign Out
             </button>

          </div>
        </div>
      </div>

      {/* Modal for Sign Out Confirmation */}

    </nav>

  );
};
export default UserHeader;
