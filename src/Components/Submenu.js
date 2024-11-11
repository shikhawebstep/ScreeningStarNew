import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { useSidebarContext } from './SidebarContext';
import Modal from "react-modal";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowRightWideLine } from "react-icons/ri";

Modal.setAppElement("#root");

const Submenu = () => {
  const { handleSectionClick, sectionTabs } = useSidebarContext();
  const [animateTabs, setAnimateTabs] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Set the activeTab state based on localStorage or default to first tab
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || sectionTabs[0]?.key);

  // Set openDropdown from localStorage if available
  useEffect(() => {
    const storedDropdown = localStorage.getItem('openDropdown');
    if (storedDropdown) {
      setOpenDropdown(parseInt(storedDropdown)); // Convert to integer
    }
    setAnimateTabs(true);
  }, []);

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
      if (response.ok) {
        localStorage.clear();
        navigate('/admin-login');
      } else {
        const errorMessage = await response.text();
        console.error('Logout failed:', errorMessage);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmSignout = () => {
    handleSignout();
    closeModal();
  };

  const toggleDropdown = (index, hasSubMenu, tabKey) => {
    if (hasSubMenu) {
      const newIndex = openDropdown === index ? null : index;
      setOpenDropdown(newIndex);
      localStorage.setItem('openDropdown', newIndex); // Save the dropdown index in localStorage
    }
    // Update the active tab and save it to localStorage
    setActiveTab(tabKey);
    localStorage.setItem('activeTab', tabKey);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        localStorage.removeItem('openDropdown'); // Clear the dropdown index if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`w-full mx-auto ${sectionTabs.length === 0 ? "bg-white" : ""}`}>
        {/* Section Buttons */}
        <div className="bg-white">
          <div className={`container m-auto flex items-center justify-between ${openDropdown !== null ? "mb-12" : ""}`}>
            <div className={`tab-container flex-wrap gap-y-2.5 flex items-center`}>
              {/* Home Tab */}
              <div className={`tab relative ${sectionTabs.length === 0 ? "py-1.5 px-4 rounded-full hidden" : "px-6 py-[7px] tab relative"}`}>
                <Link className="text-lg font-bold text-white" to="/">
                  <FaHome className="text-[rgb(44,129,186)] text-3xl" />
                </Link>
                {sectionTabs.length > 0 && (
                  <RiArrowRightWideLine className="absolute right-[-30px] top-[-9px] text-[63px] text-white z-999" />
                )}
              </div>

              {/* Other Tabs */}
              {sectionTabs.map((tab, index) => (
                <div
                  key={tab.key}
                  className={`tab relative ${index === sectionTabs.length - 1 ? "polygon" : ""} ${tab.subMenu ? "" : ""}`}
                  style={index === sectionTabs.length - 1 ? { borderRadius: '40px' } : {}}
                >
                  <Link
                    to={tab.href}
                    className={`tab-link ${activeTab === tab.key ? "text-black font-bold" : "text-[#2c81ba]"}`}
                    onClick={() => toggleDropdown(index, tab.subMenu, tab.key)}
                  >
                    {tab.name}
                  </Link>

                  {openDropdown === index && tab.subMenu && (
                    <div
                      ref={dropdownRef}
                      className="submenu dropdownmargin flex absolute left-[-280px] gap-5 pl-8 "
                    >
                      {tab.subMenu.map((subItem) => (
                        <Link
                          key={subItem.key}
                          to={subItem.href}
                          className="block m-2.5 whitespace-nowrap bg-gray-300 py-1.5 px-2.5 rounded-full text-gray-600"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {index !== sectionTabs.length - 1 && (
                    <RiArrowRightWideLine className="absolute right-[-30px] top-[-9px] text-[63px] text-white z-999" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Signout */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Signout"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Are you sure you want to sign out?</h2>
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2">Cancel</button>
          <button onClick={confirmSignout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Signout</button>
        </div>
      </Modal>
    </>
  );
};

export default Submenu;
