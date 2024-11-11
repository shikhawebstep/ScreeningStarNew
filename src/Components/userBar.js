import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaFileInvoice, FaClipboardList, FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import Modal from "react-modal";
import "../App.css";
import { useSidebarContext } from './SidebarContext'; // Correct named import and fix typo

Modal.setAppElement("#root");

const UserBar = () => {
  const { handleSectionClick } = useSidebarContext();
  const [activeTab, setActiveTab] = useState(''); // Track the active menu item

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSignout = async () => {
    try {
      if (!storedToken) {
        console.error("No token found");
        return;
      }

      const response = await fetch("https://screeningstar.onrender.com/Screeningstar/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/admin-login");
      } else {
        const errorMessage = await response.text();
        console.error("Logout failed:", errorMessage);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmSignout = () => {
    handleSignout();
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (linkName) => {
    setActiveTab(linkName); // Set the clicked tab as active
    handleSectionClick(linkName); // Call existing function
  };


  return (
    <nav className="bg-white h-full">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal absolute bg-white p-5 border shadow-lg w-[40%] m-auto text-center"
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

      <div className="container flex flex-col mx-auto py-4">
        <ul className="flex flex-col max-w-[225px] space-y-2">


          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'CLIENT MANAGER' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-ClientManager"
              className="block items-center p-2 "
              onClick={() => handleClick('CLIENT MANAGER')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaUserShield className="text-4xl m-auto" />
                CLIENT MANAGER
              </div>
            </Link>
          </li>
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'CANDIDATE MANAGER' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-candidateManager"
              className="block items-center p-2 "
              onClick={() => handleClick('CANDIDATE MANAGER')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaUserShield className="text-4xl m-auto" />
                CANDIDATE MANAGER
              </div>
            </Link>
          </li>
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'CREATE USERS' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-create"
              className="block items-center p-2 "
              onClick={() => handleClick('CREATE USERS')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaFileInvoice className="text-4xl m-auto" />
                CREATE USERS
              </div>
            </Link>
          </li>
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'Verification Status' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-verificationStatus"
              className="block items-center p-2 "
              onClick={() => handleClick('Verification Status')}
            >
              <div className="p-2 m-auto text-center  " >
                <FaClipboardList className="text-4xl m-auto" />
                VERIFICATION STATUS
              </div>
            </Link>
          </li>
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'BULK APPLICATION' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-bulkApplication"
              className="block items-center p-2 "
              onClick={() => handleClick('BULK APPLICATION')}
            >
              <div className="p-2 m-auto text-center  " >
                <GrServices className="text-4xl m-auto" />
                BULK APPLICATION
              </div>
            </Link>
          </li>
          <li className={`block mx-[30px] border border-[#7d7d7d] ${activeTab === 'SEE MORE' ? 'hover:bg-[#2c81ba] bg-[#2c81ba] text-white' : 'bg-gradient-to-b from-gray-100 to-gray-300 text-[#4d606b] hover:bg-[#2c81ba] hover:text-white'} transition duration-300`}>
            <Link
              to="/user-dashboard"
              className="block items-center p-2 "
              onClick={() => handleClick('SEE MORE')}
            >
              <div className="p-2 m-auto text-center" >
                <FaSignOutAlt  className="text-4xl m-auto" />
                SEE MORE
              </div>
            </Link>
          </li>                
          {/* Sign Out Button */}

        </ul>
      </div>
    </nav>
  );
};

export default UserBar;
