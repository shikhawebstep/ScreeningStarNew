import React, { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';

import { useClientContext } from "./ClientContext";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
Modal.setAppElement('#root'); // Make sure to set the app element for accessibility

const ActiveAccounts = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [activeList, setActiveList] = useState([]);
  const { selectedClient, setSelectedClient } = useClientContext();
  const [expandedServices, setExpandedServices] = useState({});
  const [errors, setErrors] = useState({});
  const [viewBranchesRow, setViewBranchesRow] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const storedToken = localStorage.getItem('_token'); // Ensure the token is stored correctly
  const maxVisibleServices = 1;
  const [showModal, setShowModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const handleEditClick = (branch) => {
    setCurrentBranch(branch);
    setUpdatedName(branch.name);
    setUpdatedEmail(branch.email);
    setShowModal(true); // Open the modal when edit is clicked
  };



  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");
    const raw = JSON.stringify({
      "id": currentBranch.id,
      "name": updatedName,
      "email": updatedEmail,
      "admin_id": admin_id,
      "_token": storedToken
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://screeningstar-new.onrender.com/branch/update", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        // Check if the result contains an error status
        if (!result.status) {
          Swal.fire('Error', result.message || 'An unknown error occurred', 'error');
        } else {
          // Success case
          Swal.fire('Success', result.message || 'Operation was successful', 'success');
          const newToken = result.token || result._token;
          if (newToken) {
            localStorage.setItem("_token", newToken);
          }
          handleViewBranchesClick();
        }
      })
      .catch((error) => {
        // This handles both fetch errors and result.errors
        console.error(error);
        Swal.fire('An error occurred', error.message, 'error');
      });
  };

  const toggleExpanded = (serviceIndex) => {
    setExpandedServices((prevState) => ({
      ...prevState,
      [serviceIndex]: !prevState[serviceIndex], // Toggle the expansion for this specific serviceIndex
    }));
  };
  const fetchActiveAccounts = useCallback(async () => {
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");

    if (!admin_id || !storedToken) {
      console.error("Admin ID or token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://screeningstar-new.onrender.com/customer/list?admin_id=${admin_id}&_token=${storedToken}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const newToken = result.token || result._token;
      if (newToken) {
        localStorage.setItem("_token", newToken);
      }
      setActiveList(result.customers);
    } catch (error) {
      console.error("Failed to fetch active accounts:", error);
    }
  }, []); // Empty dependency array to memoize the function only once

  useEffect(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);


  const handleBlock = async (id) => {
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");

    // Check if admin_id or storedToken is missing
    if (!admin_id || !storedToken) {
      console.error("Missing admin_id or _token");
      return;
    }

    // Show confirmation alert
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, block it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(
          `https://screeningstar-new.onrender.com/customer/inactive?customer_id=${id}&admin_id=${admin_id}&_token=${storedToken}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const newToken = result.token || result._token;
        if (newToken) {
          localStorage.setItem("_token", newToken);
        }

        Swal.fire("Blocked!", "The customer has been blocked successfully.", "success");

        fetchActiveAccounts(); // Refresh active accounts
      } catch (error) {
        console.error("Failed to block customer:", error);
      }
    }
  };




  const handleDelete = useCallback((id) => {
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `This action will delete the customer. You can't undo this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Get admin ID and token from localStorage
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        const formdata = new FormData();
  
        const requestOptions = {
          method: "DELETE",
          body: formdata,
          redirect: "follow"
        };
  
        // Perform the DELETE request to delete the customer
        fetch(`https://screeningstar-new.onrender.com/customer/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            const newToken = result.token || result._token || '';
            if (newToken) {
              localStorage.setItem("_token", newToken);
            }
            fetchActiveAccounts();  // Refresh the list of active accounts
            Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', 'There was an issue deleting the customer.', 'error');
          });
      } else {
        Swal.fire('Cancelled', 'The customer deletion was cancelled.', 'info');
      }
    });
  }, [fetchActiveAccounts]);
  

  const handleViewBranchesClick = async (clientId) => {
    if (viewBranchesRow === clientId) {
      setViewBranchesRow(null);
      setBranchesData([]);  // Clear branches data when hiding
      return;
    }

    try {
      // Retrieve admin_id and token from localStorage
      const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
      const token = localStorage.getItem('_token');

      if (!adminId || !token) {
        throw new Error('Admin ID or Token not found in localStorage');
      }

      const url = `https://screeningstar-new.onrender.com/branch/list-by-customer?customer_id=${clientId}&admin_id=${adminId}&_token=${token}`;

      // Use the GET method with the new API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const newToken = response.token || response._token || '';
      if (newToken) {
        localStorage.setItem("_token", newToken);
      }


      const data = await response.json();

      if (data.status && data.branches) {
        setViewBranchesRow(clientId);
        setBranchesData(data.branches);  // Set the correct branch data here
      } else {

      }
    } catch (error) {
      console.error(error);  // Log error for debugging

    }
  };

  const handleEdit = (client) => {
    navigate('/admin-editclient');
    setSelectedClient(client);
  };






  const handleDeleteBranch = useCallback((branch) => {
    Swal.fire({
      title: `Are you sure you want to delete the ${branch.name} branch?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        const formdata = new FormData();

        const requestOptions = {
          method: "DELETE",
          body: formdata,
          redirect: "follow"
        };

        fetch(`https://screeningstar-new.onrender.com/branch/delete?id=${branch.id}&admin_id=${adminId}&_token=${token}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            const newToken = result.token || result._token || '';
            if (newToken) {
              localStorage.setItem("_token", newToken);
            }
            Swal.fire('Deleted!', `${branch.name} branch has been deleted.`, 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', `There was an issue deleting the ${branch.name}  branch.`, 'error');
          });
      } else {
        Swal.fire('Cancelled', `${branch.name} branch deletion was cancelled.`, 'info');
      }
    });
  }, []);


  return (
    <div className="w-full bg-[#c1dff2] overflow-hidden">
      <div className="text-left">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 borde">ACTIVE CLIENTS</h2>
      </div>

      <div className="border space-y-4 py-[30px] px-[51px] bg-white">
        <div className="rounded-lg overflow-scroll">
          <table className="min-w-full border-collapse border rounded-lg">
            <thead className='rounded-lg'>
              <tr className="bg-[#c1dff2] text-[#4d606b] whitespace-nowrap">
                <th className="border px-4 py-2">SL</th>
                <th className="border px-4 py-2">Client ID</th>
                <th className="border px-4 py-2">Company Name</th>
                <th className="border px-4 py-2">Registered Address</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">State Code</th>
                <th className="border px-4 py-2">GST Number</th>
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">TAT</th>
                <th className="border px-4 py-2">Date of Service Agreement</th>
                <th className="border px-4 py-2">Standard Process</th>
                <th className="border px-4 py-2">Agreement Period</th>
                <th className="border px-4 py-2">Custom Template</th>
                <th className="border px-4 py-2">Upload Client logo</th>
                <th className="border px-4 py-2">Scope of Services</th>
                <th className="border px-4 py-2">Additional login required?</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Updated At</th>
                <th className="border px-4 py-2" colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan="21" className="text-center py-4 text-gray-500">
                    You have no data.
                  </td>
                </tr>
              ) : (
                activeList.map((client, index) => {
                  const services = client.services ? JSON.parse(client.services).flatMap(group => group.services) : [];

                  return (
                    <>
                      <tr key={client.clientId} className="text-center border-b border-gray-300">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{client.client_unique_id}</td>
                        <td className="border px-4 py-2 min-w-[200px]">{client.name}</td>
                        <td className="border px-4 py-2">{client.address}</td>
                        <td className="border px-4 py-2">{client.emails ? JSON.parse(client.emails).join(', ') : 'NIL'}</td>
                        <td className="border px-4 py-2">{client.state}</td>
                        <td className="border px-4 py-2">{client.state_code}</td>
                        <td className="border px-4 py-2 min-w-[200px]">{client.gst_number}</td>
                        <td className="border px-4 py-2 min-w-[200px]">{client.mobile}</td>
                        <td className="border px-4 py-2">{client.tat_days}</td>

                        {/* Agreement date */}
                        <td className="border px-4 py-2 min-w-[300px]">
                          {client.agreement
                            ? new Date(client.agreement).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'NIL'}
                        </td>

                        <td className="border px-4 py-2 min-w-[300px]">{client.client_standard}</td>
                        <td className="border px-4 py-2">{new Date(client.agreement_date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{client.custom_template || 'NIL'}</td>

                        {/* Client logo */}
                        <td className="border px-4 py-2">
                          {client.logo ? (
                            <img src={`https://screeningstar-new.onrender.com/${client.logo}`} alt="Client Logo" />
                          ) : (
                            'No Logo'
                          )}
                        </td>

                        <td className="border px-4 py-2">
                          {services.length > 0 ? (
                            services.slice(0, expandedServices[index] ? services.length : maxVisibleServices).map((service, i) => (
                              <div key={i} className="flex flex-col text-left border-b border-gray-300 pb-2 last:border-0">
                                <span className="font-semibold text-gray-700">Service: {service.serviceTitle || 'N/A'}</span>
                                <span className="text-gray-600">Price: {service.price || 'N/A'}</span>
                                <span className="text-gray-600">
                                  Packages: {service.packages?.length > 0
                                    ? service.packages.map((pkg, pkgIndex) => (
                                      <span key={pkgIndex}>
                                        {pkg.name}{pkgIndex < service.packages.length - 1 ? ', ' : ''}
                                      </span>
                                    ))
                                    : 'No Packages'}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-center text-gray-500">No Services Available</span>
                          )}

                          {services.length > maxVisibleServices && (
                            <button
                              onClick={() => toggleExpanded(index)}
                              className="text-blue-500 underline text-sm mt-2"
                            >
                              {expandedServices[index] ? 'View Less' : 'View More'}
                            </button>
                          )}
                        </td>

                        {/* Additional login */}
                        <td className="border px-4 py-2">{client.additional_login == 1 ? 'Yes' : 'No'}</td>

                        <td className="border px-4 py-2">{new Date(client.created_at).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{new Date(client.updated_at).toLocaleDateString()}</td>

                        {/* Action buttons */}
                        <td className="border px-4 py-2 flex flex-col gap-3 whites">
                          {client.branch_count > 1 && (
                            <button
                              onClick={() => handleViewBranchesClick(client.main_id)}
                              className="bg-green-500 text-white px-4 py-2 rounded mr-3"
                            >
                              {viewBranchesRow === client.main_id ? 'Less' : 'View Branches'}
                            </button>
                          )}

                          {/* First div with action buttons */}
                          <div className="flex gap-3">
                            <button onClick={() => handleEdit(client)} className="bg-green-500 text-white px-4 py-2 rounded mr-3">
                              Edit
                            </button>
                            <button onClick={() => handleBlock(client.id)} className="bg-red-500 text-white px-4 py-2 rounded mr-3">
                              Block
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="bg-[#073d88] text-white px-4 py-2 rounded">
                              Delete
                            </button>
                          </div>

                          {/* Second div with branches table */}
                          {viewBranchesRow && viewBranchesRow == client.main_id && (
                            <div>
                              <table className="min-w-full border-collapse border">
                                <thead>
                                  <tr className="bg-[#c1dff2] whitespace-nowrap text-[#4d606b]">
                                    <th className="border px-4 py-2">Branch ID</th>
                                    <th className="border px-4 py-2">Branch Name</th>
                                    <th className="border px-4 py-2">Branch Email</th>
                                    <th className="border px-4 py-2">Link</th>
                                  </tr>
                                </thead>
                                <tbody className="text-center">
                                  {branchesData.length > 0 ? (
                                    branchesData
                                      .filter(branch => branch.id_head !== 1) // Filter branches with id_head not equal to 1
                                      .map((branch, index) => (
                                        <tr key={branch.id}>
                                          <td className="border px-4 py-2 font-light">{index + 1}</td>
                                          <td className="border px-4 py-2 font-light">{branch.name}</td>
                                          <td className="border px-4 py-2 font-light">{branch.email}</td>
                                          <td className="border px-4 py-2 flex items-start gap-3">
                                            <button
                                              className="bg-green-500 text-white px-4 py-2 rounded mr-3"
                                              onClick={() => handleEditClick(branch)}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              className="bg-red-500 text-white px-4 py-2 rounded mr-3"
                                              onClick={() => handleDeleteBranch(branch)}
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="border px-4 py-2 font-light">
                                        You have no branches.
                                      </td>
                                    </tr>
                                  )}

                                </tbody>

                                <Modal
                                  isOpen={showModal}
                                  onRequestClose={handleCloseModal}
                                  contentLabel="Edit Branch"
                                  className="modal-content"
                                  overlayClassName="modal-overlay"
                                >
                                  <h2>Edit Branch</h2>
                                  <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                      <label htmlFor="name">Branch Name</label>
                                      <input
                                        type="text"
                                        id="name"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        className="border px-4 py-2 w-full"
                                      />
                                    </div>
                                    <div className="mb-4">
                                      <label htmlFor="email">Email</label>
                                      <input
                                        type="email"
                                        id="email"
                                        value={updatedEmail}
                                        onChange={(e) => setUpdatedEmail(e.target.value)}
                                        className="border px-4 py-2 w-full"
                                      />
                                    </div>
                                    <div className="mb-4">
                                      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-3">
                                        Save
                                      </button>
                                      <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                                        Cancel
                                      </button>
                                    </div>
                                  </form>
                                </Modal>
                              </table>
                            </div>
                          )}
                        </td>

                      </tr>

                    </>
                  );
                })
              )}


            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccounts;
