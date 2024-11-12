import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create the context
const ClientContext = createContext();

// Create the provider component
export const ClientProvider = ({ children }) => {
    const [selectedClient, setSelectedClient] = useState();
    const [client_spoc_id, setclient_spoc_id] = useState([]);
    const [escalation_manager_id, Setescalation_manager_id] = useState([]);
    const [billing_spoc_id, setbilling_spoc_id] = useState([]);
    const [billing_escalation_id, setbilling_escalation_id] = useState([]);
    const [authorized_detail_id, setauthorized_detail_id] = useState([]);

    const fetchclient_spoc_id = useCallback(() => {
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
                const client_spoc_options = result.client_spocs.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setclient_spoc_id(client_spoc_options);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const fetchescalation_manager_id = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/escalation-manager/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const escalation_manager_idOptions = result.escalation_managers.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                Setescalation_manager_id(escalation_manager_idOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const fetchbilling_spoc_id = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/billing-spoc/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const billing_spoc_options = result.billing_spocs.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setbilling_spoc_id(billing_spoc_options);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const fetchbilling_escalation_id = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/billing-escalation/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const billing_escalation_idOptions = result.billing_escalations.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setbilling_escalation_id(billing_escalation_idOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const fetchauthorized_detail_id = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/authorized-detail/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const authorized_detail_idOptions = result.authorized_details.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setauthorized_detail_id(authorized_detail_idOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    const AllSpocs = useCallback(() => {
        fetchclient_spoc_id();
        fetchescalation_manager_id();
        fetchbilling_spoc_id();
        fetchbilling_escalation_id();
        fetchauthorized_detail_id();
    }, [
        fetchclient_spoc_id,
        fetchescalation_manager_id,
        fetchbilling_spoc_id,
        fetchbilling_escalation_id,
        fetchauthorized_detail_id,
    ]);

  
    return (
        <ClientContext.Provider
            value={{
                client_spoc_id,
                AllSpocs,
                escalation_manager_id,
                billing_spoc_id,
                billing_escalation_id,
                authorized_detail_id,
                selectedClient, setSelectedClient
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};

// Custom hook to use the context
export const useClientContext = () => {
    return useContext(ClientContext);
};
