// import React, { createContext, useEffect, useState, useCallback } from 'react';
// import Swal from 'sweetalert2';

// const DropBoxContext = createContext();

// export const DropBoxProvider = ({ children }) => {
//     const [services, setServices] = useState([]);
//     const [uniquePackages, setUniquePackages] = useState([]);
//     const [listData, setListData] = useState([]);
//     const [selectedDropBox, setSelectedDropBox] = useState(null);
//     const [branchId, setBranchId] = useState(null);
//     const [customerId, setCustomerId] = useState(null);
//     const [token, setToken] = useState(null);

//     // Fetch data from localStorage once and store in state to avoid re-fetching on every render
//     useEffect(() => {
//         const branch = JSON.parse(localStorage.getItem('branch'));
//         setBranchId(branch?.id);
//         setCustomerId(branch?.customer_id);
       
//     }, []); // Empty dependency array means this runs once when the component mounts

//     const handleEditDrop = (pkg) => {
//         setSelectedDropBox(pkg);
//     };
//     const storedToken = localStorage.getItem('token');
 

 




 

//     return (
//         <DropBoxContext.Provider value={{
//             services,
//             uniquePackages,
//             handleEditDrop,
//             setServices,
//             listData,
//             setListData,
//             selectedDropBox,
//             setSelectedDropBox,
//             setUniquePackages,
//             fetchServices
//         }}>
//             {children}
//         </DropBoxContext.Provider>
//     );
// };

// export default DropBoxContext;
