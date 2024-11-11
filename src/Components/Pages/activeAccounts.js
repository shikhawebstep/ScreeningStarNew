import React, { useEffect, useState } from 'react';
import axios from 'axios';
const ActiveAccounts = () => {
  const [activeList, setActiveList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const storedToken = localStorage.getItem('token');
  useEffect(() => {
    const fetchActiveAccounts = async () => {
      const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
      const storedToken = localStorage.getItem("_token");
    
      if (!storedToken) {
        console.error("No token found. Please log in.");
        return;
      }
    
      try {
        const response = await fetch(`https://screeningstar-new.onrender.com/customer/list?admin_id=${admin_id}&_token=${storedToken}`, {
          method: "GET",
          redirect: "follow"
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const result = await response.text();
        console.log(result);
      } catch (error) {
        console.error("Failed to fetch active accounts:", error);
      }
    };
    

    fetchActiveAccounts();
  }, [storedToken]);


  const handleBlock = async (id) => {
    if (window.confirm('Are you sure you want to block this client?')) {
      try {
        await axios.put(
          `https://screeningstar.onrender.com/Screeningstar/clients/status/${id}`,
          { status: 'inactive' },

          {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setActiveList((prevList) => prevList.filter(client => client.id !== id));
        alert('Client successfully blocked.');
      } catch (error) {
        console.error('Error blocking client:', error);
        alert('An error occurred while trying to block the client.');
      }
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/clients/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        });

        if (response.ok) {
          setActiveList(prevList => prevList.filter(client => client.id !== id));
          alert("Client successfully deleted.");
        } else {
          const errorText = await response.text();
          console.error("Error deleting client:", errorText);
          alert("Failed to delete the client. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("An error occurred while trying to delete the client.");
      }
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditing(true);
  };

  const handleFormSubmit = async (updatedClient) => {
    try {
      const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/clients/${updatedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(updatedClient),
      });

      if (response.ok) {
        setActiveList(prevList => prevList.map(client =>
          client.id === updatedClient.id ? updatedClient : client
        ));
        alert("Client successfully updated.");
      } else {
        const errorText = await response.text();
        console.error("Failed to update client:", errorText);
        alert("Failed to update client. Please try again.");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      alert("An error occurred while trying to update the client.");
    } finally {
      setIsEditing(false);
      setSelectedClient(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedClient(null);
  };

  return (
    <div className="w-full bg-[#c1dff2] overflow-hidden">
      <div className="text-left">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 borde">ACTIVE CLIENTS</h2>
      </div>

      {isEditing ? (
        <EditForm client={selectedClient} onSubmit={handleFormSubmit} onCancel={handleCancelEdit} />
      ) : (
        <div className=" border space-y-4 py-[30px] px-[51px] bg-white">
          <div className="rounded-lg overflow-scroll">
            <table className="min-w-full border-collapse border  rounded-lg ">
              <thead className='rounded-lg'>
                <tr className="bg-[#c1dff2] text-[#4d606b]  whitespace-nowrap">
                  <th className="border  px-4 py-2">SL</th>
                  <th className="border  px-4 py-2">Client ID</th>
                  <th className="border  px-4 py-2">Organization Name</th>
                  <th className="border  px-4 py-2">Registered Address</th>
                  <th className="border  px-4 py-2">Email</th>
                  <th className="border  px-4 py-2">State</th>
                  <th className="border  px-4 py-2">State Code</th>
                  <th className="border  px-4 py-2">GST Number</th>
                  <th className="border  px-4 py-2">Mobile Number</th>
                  <th className="border  px-4 py-2">TAT</th>
                  <th className="border  px-4 py-2">Date of Service Agreement</th>
                  <th className="border  px-4 py-2">Standard Process</th>
                  <th className="border  px-4 py-2">Agreement Period</th>
                  <th className="border  px-4 py-2">Custom Template</th>
                  <th className="border  px-4 py-2">Upload Client logo</th>
                  <th className="border  px-4 py-2">Account Management</th>
                  <th className="border  px-4 py-2">Package Options</th>
                  <th className="border  px-4 py-2">Scope of Services</th>
                  <th className="border  px-4 py-2">Pricing Packages</th>
                  <th className="border  px-4 py-2">Additional login required?</th>
                  <th className="border  px-4 py-2">Created At</th>
                  <th className="border  px-4 py-2">Updated At</th>
                  <th className="border  px-4 py-2" colSpan={2}>Action</th>
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
                  activeList.map((client, index) => (
                    <tr key={client.clientId} className='text-center'>
                      <td className="border  px-4 py-2">{index + 1}</td>
                      <td className="border  px-4 py-2">{client.clientId}</td>
                      <td className="border  px-4 py-2 min-w-[200px]">{client.organizationName}</td>
                      <td className="border  px-4 py-2">{client.registeredAddress}</td>
                      <td className="border  px-4 py-2">{client.email}</td>
                      <td className="border  px-4 py-2">{client.state}</td>
                      <td className="border  px-4 py-2">{client.stateCode}</td>
                      <td className="border  px-4 py-2 min-w-[200px]">{client.gstNumber}</td>
                      <td className="border  px-4 py-2 min-w-[200px]">{client.mobileNumber}</td>
                      <td className="border  px-4 py-2">{client.tat}</td>
                      <td className="border  px-4 py-2 min-w-[300px]">{client.serviceAgreementDate}</td>
                      <td className="border  px-4 py-2 min-w-[300px]">{client.clientProcedure}</td>
                      <td className="border  px-4 py-2">{client.agreementPeriod}</td>
                      <td className="border  px-4 py-2">{client.customTemplate}</td>
                      <td className="border  px-4 py-2">
                        <img src={`../../imgs/${client.clientLogo}`} alt="Client Logo" />
                      </td>
                      <td className="border  px-4 py-2">{client.accountManagement}</td>
                      <td className="border  px-4 py-2">{client.packageOptions}</td>
                      <td className="border  px-4 py-2">{client.scopeOfServices}</td>
                      <td className="border  px-4 py-2">{client.pricingPackages}</td>
                      <td className="border  px-4 py-2">{client.loginRequired}</td>
                      <td className="border  px-4 py-2">{client.createdAt}</td>
                      <td className="border  px-4 py-2">{client.updatedAt}</td>
                      <td className="border  px-4 py-2 min-w-[300px]">
                        <button onClick={() => handleEdit(client)} className="bg-green-500 text-white px-4 py-2 rounded mr-3">Edit</button>
                        <button onClick={() => handleBlock(client.id)} className="bg-red-500 text-white px-4 py-2 rounded mr-3">Block</button>
                        <button onClick={() => handleDelete(client.id)} className="bg-[#073d88] text-white px-4 py-2 rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// EditForm component to handle the editing of client details
const EditForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...client });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Client</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          placeholder="Organization Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="registeredAddress"
          value={formData.registeredAddress}
          onChange={handleChange}
          placeholder="Registered Address"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="stateCode"
          value={formData.stateCode}
          onChange={handleChange}
          placeholder="State Code"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="GST Number"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="tat"
          value={formData.tat}
          onChange={handleChange}
          placeholder="TAT"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="standardProcess"
          value={formData.standardProcess}
          onChange={handleChange}
          placeholder="Standard Process"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          name="clientLogo"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div>
          <div><h4>{formData.clientLogo}</h4></div>
        </div>
        <input
          type="text"
          name="accountManagement"
          value={formData.accountManagement}
          onChange={handleChange}
          placeholder="Account Management"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="packageOptions"
          value={formData.packageOptions}
          onChange={handleChange}
          placeholder="Package Options"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="scopeOfServices"
          value={formData.scopeOfServices}
          onChange={handleChange}
          placeholder="Scope of Services"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="pricingPackages"
          value={formData.pricingPackages}
          onChange={handleChange}
          placeholder="Pricing Packages"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          name="loginRequired"
          value={formData.loginRequired}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Additional login required?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>


      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ActiveAccounts;
