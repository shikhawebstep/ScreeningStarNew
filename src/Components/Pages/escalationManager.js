import React, { useEffect, useState, useCallback } from "react";
import swal from 'sweetalert';
const EscalationManager = () => {
  const [spocs, setSpocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpocId, setCurrentSpocId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  const fetchData = useCallback(() => {
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");

    // Check if admin_id or storedToken is missing
    if (!admin_id || !storedToken) {
      console.error('Missing admin_id or _token');
      return;
    }

    const url = `https://screeningstar-new.onrender.com/escalation-manager/list?admin_id=${admin_id}&_token=${storedToken}`;

    // Request options for GET request (no body required)
    const requestOptions = {
      method: "GET", // GET method does not need a body
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming the response is in JSON format
      })
      .then((result) => {
        console.log('API result:', result);
        setSpocs(result.escalation_managers);
        console.log(`Main spocs - `, result.escalation_managers); 
        const newToken=result.token || result._token || ''
        if(newToken){
          localStorage.setItem("_token",newToken)
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");

    const raw = JSON.stringify({
      
      ...formData,
      admin_id,
      _token: storedToken,
    });

    const requestOptions = {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    const url = isEditing
      ? `https://screeningstar-new.onrender.com/escalation-manager/update`
      : `https://screeningstar-new.onrender.com/escalation-manager/create`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        fetchData(); // Refresh data after form submission                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        setFormData({ name: "", designation: "", phone: "", email: "" });
        setIsEditing(false);
        setCurrentSpocId(null);
         // Display different success messages for add and edit actions
         if (isEditing) {
          swal("Success!", "Successfully updated!", "success");
        } else {
          swal("Success!", "Successfully added!", "success");
        }
        const result = await response.text();
        const newToken=result.token || result._token || ''
          if(newToken){
            localStorage.setItem("_token",newToken)
          }
        
      } else {
        swal("Failed!", "Failed to submit form", "error");
        console.error("Failed to submit form", response.statusText);
      }
    } catch (error) {
      swal("Failed!", "Failed to submit form", "error");
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (spoc) => {
    setFormData(spoc);
    setIsEditing(true);
    setCurrentSpocId(spoc.id);
  };

  const handleDelete = async (id) => {
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`https://screeningstar-new.onrender.com/escalation-manager/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`, requestOptions);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Remove the deleted spoc from the state immediately
      setSpocs((prevSpocs) => prevSpocs.filter((spoc) => spoc.id !== id));
      swal("Deleted!", "The data has been deleted successfully.", "success");
      const result = await response.text();
      const newToken=result.token || result._token || ''
        if(newToken){
          localStorage.setItem("_token",newToken)
        }
    } catch (error) {
      swal("Failed!", "There was an error deleting the data.", "error");
      console.error('Delete request failed:', error);
    }
  };
  
  

  console.log(` spocs - `, spocs);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSpocs = spocs
    .filter((spoc) => spoc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(spocs.length / itemsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-[#c1dff2]">
      <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">Escalation Manager</h2>
      <div className="bg-white p-12 border w-full mx-auto">
        <div className="flex space-x-4">

          <div className="w-2/5">
            <form className="space-y-4 ps-0 py-[30px] px-[51px] bg-white rounded-md" id="client-spoc" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2">Name of the Escalation</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="designation" className="block mb-2">Designation</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2">Contact Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">Email ID</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="bg-[#c1dff2] text-[#4d606b] font-bold px-4 py-2 rounded">Submit</button>
            </form>
          </div>

          <div className="w-3/5 overflow-x-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Escalation Name"
                className="w-full rounded-md p-2.5 border border-gray-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="overflow-auto">
              <table className="min-w-full border-collapse border border-black rounded-lg">
                <thead className="rounded-lg">
                  <tr className="bg-[#c1dff2] text-[#4d606b] rounded-lg whitespace-nowrap">
                    <th className="py-2 px-4 border">No.</th>
                    <th className="py-2 px-4 border">Name of the Escalation</th>
                    <th className="py-2 px-4 border">Designation</th>
                    <th className="py-2 px-4 border">Contact Number</th>
                    <th className="py-2 px-4 border">Email ID</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSpocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        Your table is empty.
                      </td>
                    </tr>
                  ) : (
                    currentSpocs.map((spoc, index) => (
                      <tr key={spoc.id} className="hover:bg-gray-200">
                        <td className="py-2 px-4 border">{index + 1 + indexOfFirstItem}</td>
                        <td className="py-2 px-4 border">{spoc.name}</td>
                        <td className="py-2 px-4 border">{spoc.designation}</td>
                        <td className="py-2 px-4 border">{spoc.phone}</td>
                        <td className="py-2 px-4 border">{spoc.email}</td>
                        <td className="py-2 px-4 border whitespace-nowrap">
                          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleEdit(spoc)}>Edit</button>
                          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(spoc.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default EscalationManager;