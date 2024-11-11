import React, { createContext, useState, useContext } from "react";
import {
  FcUpload,
  FcConferenceCall,
  FcCustomerSupport,
  FcManager,
  FcMoneyTransfer,
  FcBusinessman,
  FcApproval,
  FcSalesPerformance,
  FcFile,
  FcDatabase,
  FcInspection,
  FcDocument,
  FcServices,
  FcPackage,
  FcCalendar,
  FcDataSheet,
  FcKey,
  FcTimeline,
  FcBriefcase,
  FcBarChart,
  FcPortraitMode,
  FcNightPortrait,
  
} from "react-icons/fc"; // Added icons

// Create a context for managing sidebar state
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(null); // To manage active tab sections
  const [sectionTabs, setSectionTabs] = useState([]); // Tabs shown based on selected section

  // Section configuration for "Employee Credentials"
  const employeeTabs = [
    { name: "Create User", icon: <FcUpload />, key: "createUser", href: "/admin-createUser" },
    { name: "Existing User", icon: <FcConferenceCall />, key: "existingUser", href: "/admin-existing-users" },
  ];

  // Section configuration for "Client Overview"
  const  clientTabs = [
    {
      name: "Client Onboarding",
      icon: <FcBriefcase />,
      key: "clientOnboarding",
      href: "/admin-add-new-client",
    },
    {
      name: "Account Management",
      icon: <FcBarChart />,
      key: "accountManagement",
      subMenu: [
        {
          name: "Client Spoc",
          icon: <FcCustomerSupport />,
          key: "clientSpoc",
          href: "/admin-client-spoc",
        },
        {
          name: "Escalation Manager",
          icon: <FcManager />,
          key: "escalationManager",
          href: "/admin-escalation-manager",
        },
        {
          name: "Billing Spoc",
          icon: <FcMoneyTransfer />,
          key: "billingSpoc",
          href: "/admin-billing-spoc",
        },
        {
          name: "Billing Escalation",
          icon: <FcBusinessman />,
          key: "billingEscalation",
          href: "/admin-billing-esclation",
        },
        {
          name: "Authorized Details",
          icon: <FcApproval />,
          key: "authorizedDetails",
          href: "/admin-authorized-details",
        },
      ],
    },
    {
      name: "Active Accounts",
      icon: <FcPortraitMode />,
      key: "activeAccounts",
      href: "/admin-active-account",
    },
    {
      name: "Inactive Clients",
      icon: <FcNightPortrait />,
      key: "inactiveClients",
      href: "/admin-inactive-clients",
    },
  ];
  

  const invoiceTabs = [
    {
      name: "Enter Sale Data",
      icon: <FcSalesPerformance className="inline-block text-blue-500" />,
      key: "enterSaleData",
      href: "/admin-invoice-master"
    },
    {
      name: "Generate Invoice",
      icon: <FcFile className="inline-block" />,
      key: "generateInvoice",
      href: "/admin-generate-invoice"
    },
    {
      name: "Records & Trackers",
      icon: <FcDatabase className="inline-block" />,
      key: "recordsAndTrackers",
      href: "/admin-records-and-trackers"
    }
  ];
  const clientCredential = [
    {
      name: "Client Credentials",
      icon: <FcSalesPerformance className="inline-block text-blue-500" />,
      key: "enterSaleData",
      href: "/admin-client-credentials"
    }
  ];

  const adminTabs = [
    {
      name: "Application Status",
      icon: <FcInspection className="inline-block" />,
      key: "applicationStatus",
      href: "/admin-application-status"
    },
    {
      name: "Report Generation",
      icon: <FcDocument className="inline-block" />,
      key: "reportGeneration",
      href: "/admin-prepare-report"
    },
    {
      name: "QC STATUS",
      icon: <FcDocument className="inline-block" />,
      key: "qcStatus",
      href: "/"
    }
  ];
  const seeMore = [
    {
      name: "Service Management",
      icon: <FcServices className="mr-2 text-xl" />,
      key: "serviceManagement",
      href: "/admin-service-management"
    },
    {
      name: "Package Management",
      icon: <FcPackage className="mr-2 text-xl" />,
      key: "packageManagement",
      href: "/admin-package-management"
    },
    {
      name: "Admin Manager",
      icon: <FcManager className="mr-2 text-xl" />,
      key: "adminManager",
      href: "/admin-admin-manager"
    },
    {
      name: "TAT Reminder",
      icon: <FcCalendar className="mr-2 text-xl" />,
      key: "tatReminder",
      href: "/admin-tat-reminder"
    },
    {
      name: "Acknowledgement",
      icon: <FcApproval className="mr-2 text-xl" />,
      key: "acknowledgement",
      href: "/admin-acknowledgement"
    },
    {
      name: "Data Management",
      icon: <FcDataSheet className="mr-2 text-xl" />,
      key: "dataManagement",
      href: "/admin-data-management"
    },
    {
      name: "Team Management",
      icon: <FcBusinessman className="mr-2 text-xl" />,
      key: "teamManagement",
      href: "/admin-team-management"
    },
    {
      name: "User History",
      icon: <FcTimeline className="mr-2 text-xl" />,
      key: "userHistory",
      href: "/admin-user-history"
    },
    {
      name: "Reset Password",
      icon: <FcKey className="mr-2 text-xl" />,
      key: "resetPassword",
      href: "/admin-update-password"
    }
  ];



  const clientManagerTabs = [
    {
      name: "CLIENT MANAGER",
      icon: <FcUpload className="inline-block" />,
      key: "clientManager",
      href: "/user-ClientManager"
    }
  ];
  const clientMasterTabs = [
    {
      name: "CANDIDATE MANAGER",
      icon: <FcBriefcase className="inline-block" />,
      key: "candidateManager",
      href: "/user-candidateManager"
    }
  ];
  const createInvoiceTabs = [
    {
      name: "CREATE USERS",
      icon: <FcSalesPerformance className="inline-block text-blue-500" />,
      key: "createUsers",
      href: "/user-create"
    }
  ];
  const reportMasterTabs = [
    {
      name: "Verification Status",
      icon: <FcInspection className="inline-block" />,
      key: "verificationStatus",
      href: "/user-verificationStatus"
    }
  ];
  const bulkApplicationTabs = [
    {
      name: "BULK APPLICATION",
      key: "bulkApplication",
      href: "/user-bulkApplication",
      button: true // Indicating that this tab is rendered as a button
    }
  ];
    
  const seeMoreTabs = [
    {
      name: "CHECKLIST AND ESCALATION MATRIX",
      icon: <FcServices className="mr-2 text-xl" />,
      key: "checklistAndEscalation",
      href: "/user-checklistAndEscalation"
    },
    {
      name: "MASTER DASHBOARD",
      icon: <FcPackage className="mr-2 text-xl" />,
      key: "masterDashboard",
      href: "/user-MasterDashboard"
    },
    {
      name: "CREATE TICKETS",
      icon: <FcManager className="mr-2 text-xl" />,
      key: "createTickets",
      href: "/user-createTickets"
    },
    {
      name: "API INTEGRATION",
      icon: <FcCalendar className="mr-2 text-xl" />,
      key: "apiIntegration",
      href: "/user-ApiIntegration"
    },
    {
      name: "User History",
      icon: <FcTimeline className="mr-2 text-xl" />,
      key: "userHistory",
      href: "user-dashboard" // Placeholder link
    },
    {
      name: "RESET PASSWORD",
      icon: <FcKey className="mr-2 text-xl" />,
      key: "RESET PASSWORD",
      href: "/user-update-password" 
    }
  ];
  

  // Handle section click and load appropriate tabs
  const handleSectionClick = (section) => {
    if (section === "Employee Credentials") {
      setSectionTabs(employeeTabs);
    } else if (section === "Client Overview") {
      setSectionTabs(clientTabs);
    } else if (section === "Billing Dashboard") {
      setSectionTabs(invoiceTabs);
    } else if (section === "Report Master") {
      setSectionTabs(adminTabs);
    }else if (section === "Client Credentials") {
      setSectionTabs(clientCredential);
    } else if (section === "See More") {
      setSectionTabs(seeMore);
    } else if (section === "CLIENT MANAGER") {
      setSectionTabs(clientManagerTabs);
    }else if (section === "CANDIDATE MANAGER") {
      setSectionTabs(clientMasterTabs);
    }else if (section === "CREATE USERS") {
      setSectionTabs(createInvoiceTabs);
    }else if (section === "Verification Status") {
      setSectionTabs(reportMasterTabs);
    }else if (section === "BULK APPLICATION") {
      setSectionTabs(bulkApplicationTabs);
    }else if (section === "SEE MORE") {
      setSectionTabs(seeMoreTabs);
    }
    setActiveTab(section); // Set the active tab (section) clicked
  };

  return (
    <SidebarContext.Provider value={{ handleSectionClick, activeTab, sectionTabs }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to access the SidebarContext
export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
