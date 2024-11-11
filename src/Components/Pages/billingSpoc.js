import React, { useEffect, useState, useCallback } from "react";
import Swal from  'sweetalert2';
const BillingSpoc = () => {
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
  
    // Construct the URL with query parameters
    const url = `https://screeningstar-new.onrender.com/billing-spoc/list?admin_id=${admin_id}&_token=${storedToken}`;
  
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
        return response.json(); // or response.json() if the response is JSON
      })
      .then((result) => {
        const newToken=result.token || result._token || ''
        if(newToken){
          localStorage.setItem("_token",newToken)
        }
        console.log('API result:', result);
        // Assuming the result is JSON, you can parse it here
        try {
         
          setSpocs(result.billing_spocs);
           // Assuming setSpocs expects a parsed object
        } catch (error) {
          console.error('Failed to parse JSON:', error);

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
      ? `https://screeningstar-new.onrender.com/billing-spoc/update`
      : `https://screeningstar-new.onrender.com/billing-spoc/create`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const newToken=response.token || response._token || ''
        if(newToken){
          localStorage.setItem("_token",newToken)
        }
        const data = await response.json(); // Extract JSON data
        Swal.fire("Success!",data.message); 
        fetchData(); // Refresh data after form submission                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        setFormData({ name: "", designation: "", phone: "", email: "" });
        setIsEditing(false);
        setCurrentSpocId(null);
      } else {
        console.error("Failed to submit form", response.statusText);
      }
    } catch (error) {
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
    const formdata = new FormData();
    const requestOptions = {
      method: "DELETE",
      body: formdata,
      redirect: "follow"
    };
  
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        fetch(`https://screeningstar-new.onrender.com/billing-spoc/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            const newToken=result.token || result._token || ''
            if(newToken){
              localStorage.setItem("_token",newToken)
            }
            Swal.fire("Deleted!", "The item has been deleted.", "success");
            fetchData(); // Refresh data
          })
          .catch((error) => console.error(error));
      }
    });
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
  console.log('spoc',spocs)

  return (
    <>
      <div className="bg-[#c1dff2] ">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">BILLING SPOC</h2>
        <div className="bg-white p-12 border w-full mx-auto">
          <div className="flex space-x-4">
            <div className="w-2/5">
              <form className="space-y-4 ps-0 py-[30px] px-[51px] bg-white rounded-md" id="client-spoc" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block mb-2">Name of the Spoc</label>
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
                  placeholder="Search by SPOC Name"
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
                      <th className="py-2 px-4 border">Name of the Spoc</th>
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
                          No SPOCs available.
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
                          <td className="py-2 px-4 border">
                            <button onClick={() => handleEdit(spoc)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                            <button onClick={() => handleDelete(spoc.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </button>
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingSpoc;
