import React, { useState, useEffect, useCallback } from "react";
import Swal from 'sweetalert2';

const ClientSpoc = () => {
  const [spocs, setSpocs] = useState([]);
  const [error, setError] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    email1: "",
    email2: "",
    email3: "",
    email4: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpocId, setCurrentSpocId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const validateForm = () => {
    const errors = {};
  
    if (!formData.name.trim()) {
      errors.name = "SPOC Name is required";
    }
    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Contact Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
  
    const validateEmail = (email) =>
      email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Invalid email format"
        : null;
  
    // Handle main email and email1 to email4 separately
    if (!formData.email) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }
  
    // For email1 to email4, check if any field has an email and validate accordingly
    ["email1", "email2", "email3", "email4"].forEach((field) => {
      if (formData[field]) {
        const emailError = validateEmail(formData[field]);
        if (emailError) errors[field] = emailError;
      }
    });
  
    setError(errors);
    return Object.keys(errors).length === 0;
  };
  

  const fetchData = useCallback(() => {
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");

    if (!admin_id || !storedToken) {
      console.error('Missing admin_id or _token');
      return;
    }

    const url = `https://screeningstar-new.onrender.com/client-spoc/list?admin_id=${admin_id}&_token=${storedToken}`;

    fetch(url, { method: "GET", redirect: "follow" })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((result) => {
        const newToken = result.token || result._token || '';
        if (newToken) localStorage.setItem("_token", newToken);
        setSpocs(result.client_spocs);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      // Clear specific error for the field if valid input
      if (value.trim() && error[name]) {
        setError((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
      return newFormData;
    });
  };

  const handleBlur = (emailField) => {
    const email = formData[emailField];
    const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
    const storedToken = localStorage.getItem("_token");
  
    if (email) {
      // Clear previous errors for the current email field
      setError((prevErrors) => ({ ...prevErrors, [emailField]: null }));
  
      // Make the API call to check if the email exists
      fetch("https://screeningstar-new.onrender.com/client-spoc/check-email-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, admin_id, _token: storedToken }),
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.exists) {
            // Update the error state if the email already exists
            setError((prevErrors) => ({
              ...prevErrors,
              [emailField]: "Email already exists",
            }));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError((prevErrors) => ({
            ...prevErrors,
            [emailField]: "An error occurred while checking email",
          }));
        });
    }
  };
  

  const handleSubmit = async (e) => {
    alert('start')
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    alert('end')

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
      ? `https://screeningstar-new.onrender.com/client-spoc/update`
      : `https://screeningstar-new.onrender.com/client-spoc/create`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const newToken = response.token || response._token || "";
        if (newToken) localStorage.setItem("_token", newToken);
        const data = await response.json();
        Swal.fire("Success!", data.message);
        fetchData();
        setFormData({ name: "", designation: "", phone: "", email: "", email1: "", email2: "", email3: "", email4: "" });
        setIsEditing(false);
        setCurrentSpocId(null);
        setError({});
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

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://screeningstar-new.onrender.com/client-spoc/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`, {
          method: "DELETE",
          redirect: "follow"
        })
          .then((response) => response.json())
          .then((result) => {
            const newToken = result.token || result._token || '';
            if (newToken) localStorage.setItem("_token", newToken);
            Swal.fire("Deleted!", "The item has been deleted.", "success");
            fetchData();
          })
          .catch((error) => console.error(error));
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSpocs = spocs
    .filter((spoc) =>
      spoc.name && spoc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(spocs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <>
      <div className="bg-[#c1dff2] ">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">Client Spoc</h2>
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
                   
                  />
                  {error.name && <p className="text-red-500">{error.name}</p>}
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
                   
                  />
                  {error.designation && <p className="text-red-500">{error.designation}</p>}
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
                   
                  />
                  {error.phone && <p className="text-red-500">{error.phone}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">Email ID</label>
                  <input
                    type="email"
                    onBlur={() => handleBlur(formData.email)}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  
                  />
                  {error.email && <p className="text-red-500">{error.email}</p>}
                </div>
                <div>
                  <label htmlFor="email1" className="block mb-2">Email ID 1</label>
                  <input
                    type="email"
                    onBlur={() => handleBlur(formData.email1)}
                    id="email1"
                    name="email1"
                    value={formData.email1}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                  {error.email1 && <p className="text-red-500">{error.email1}</p>}
                </div>
                <div>
                  <label htmlFor="email2" className="block mb-2">Email ID 2</label>
                  <input
                    type="email"
                    onBlur={() => handleBlur(formData.email2)}
                    id="email2"
                    name="email2"
                    value={formData.email2}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                  {error.email2 && <p className="text-red-500">{error.email2}</p>}
                </div>
                <div>
                  <label htmlFor="email3" className="block mb-2">Email ID 3</label>
                  <input
                    type="email"
                    onBlur={() => handleBlur(formData.email3)}
                    id="email3"
                    name="email3"
                    value={formData.email3}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                  {error.email3 && <p className="text-red-500">{error.email3}</p>}
                </div>
                <div>
                  <label htmlFor="email4" className="block mb-2">Email ID 4</label>
                  <input
                    type="email"
                    onBlur={() => handleBlur(formData.email4)}
                    id="email4"
                    name="email4"
                    value={formData.email4}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                  {error.email4 && <p className="text-red-500">{error.email4}</p>}
                </div>
                <button type="submit" className="bg-[#c1dff2] text-[#4d606b] font-bold px-4 py-2 rounded">Submit</button>
              </form>
            </div>
            <div className="w-3/5 overflow-x-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by Spoc Name"
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
                      <th className="py-2 px-4 border">SPOC Name</th>
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
                          <td className="py-2 px-4 border">{index + 1}</td>
                          <td className="py-2 px-4 border">{spoc.name}</td>
                          <td className="py-2 px-4 border">{spoc.designation}</td>
                          <td className="py-2 px-4 border">{spoc.phone}</td>
                          <td className="py-2 px-4 border">
                            {/* Only display non-empty email IDs, joined by commas */}
                            {[
                              spoc.email,
                              spoc.email1,
                              spoc.email2,
                              spoc.email3,
                              spoc.email4
                            ]
                              .filter(email => email) // Filter out empty emails
                              .join(', ') // Join with commas
                            }
                          </td>
                          <td className="py-2 px-4 border">
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
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-[#073d88] text-white" : "bg-gray-200"}`}
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

    </>
  );
};

export default ClientSpoc;
