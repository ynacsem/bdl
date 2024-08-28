'use client';
import { fetchAllProvision } from "@/utils/fetch"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProvisionCard from "@/components/ProvisionCard";
import { calculateRest } from "@/utils/provision/calculateRest"; 
export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [provisions, setProvisions] = useState([]);
    const [filteredProvisions, setFilteredProvisions] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchIntitule, setSearchIntitule] = useState('');
    const [selectedTypeFacture, setSelectedTypeFacture] = useState('');const [extourneState, setExtourneState] = useState('');

    const [error, setError] = useState(null);
    const previleges = session?.user?.previleges;

    // Loading state to handle session check delay
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') {
            // Wait for the session status to resolve
            return;
        }

        if (!session) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
        }
        if (session?.user?.previleges?.admin) {
            router.push('/manageusers');
            return
        }

        const fetchData = async () => {
            try {
                const data = await fetchAllProvision(); // Fetch without filters
                console.log("Fetched Data:", data); // Log the fetched data
                setProvisions(data);
                console.log("Provisions:", provisions);
                setFilteredProvisions(data);
                console.log("Filtered Provisions:", filteredProvisions);

            } catch (err) {
                setError('Failed to fetch data');
                console.error('Fetch Error:', err);
            }
            
        };

        fetchData();
        setLoading(false); // Data fetching is complete
    }, [session, status, router]); // Include status in dependencies

    useEffect(() => {
        console.log(provisions);
        const lowercasedSearchId = searchId.toLowerCase();
        const lowercasedSearchIntitule = searchIntitule.toLowerCase();
        
        if (Array.isArray(provisions)) {
            console.log("Provisions:", provisions);
            const filteredProvisions = provisions.filter(prov => 
                (searchId === '' || prov.id.toString().includes(lowercasedSearchId)) &&
                (searchIntitule === '' || prov.libelle.toLowerCase().includes(lowercasedSearchIntitule)) &&
                (selectedTypeFacture === '' || prov.type === parseInt(selectedTypeFacture)) &&
                (extourneState === '' || prov.extourne === parseInt(extourneState))
            );
            filteredProvisions.reverse();
            setFilteredProvisions(filteredProvisions);
        }
    }, [searchId, searchIntitule, selectedTypeFacture, extourneState, provisions]);
    
    

    const handleIdChange = (event) => {
        setSearchId(event.target.value);
    };

    const handleIntituleChange = (event) => {
        setSearchIntitule(event.target.value);
    };

    const handleTypeFactureChange = (event) => {
        setSelectedTypeFacture(event.target.value);
    };
    const handleExtourneChange = (event) => {
        setExtourneState(event.target.value);
    };
    
    
    if (loading) {
        return <p>Loading...</p>; // Display loading indicator while waiting for session status
    }
    

    return (
        <>
            {/* <Nav /> */}
            <div className="p-4 overlay">
                {error && <p className="text-red-500">{error}</p>}
                
                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="mb-4 w-full flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={handleIdChange}
                        onFocus={(e) => e.target.classList.add('border-primary')}
                        onBlur={(e) => e.target.classList.remove('border-primary')}
                        className="flex-grow p-2 border-4 rounded border-secondary focus:border-primary focus:outline-none  transition-colors duration-300"
                    />
                    <input
                        type="text"
                        placeholder="Search by Intitule"
                        value={searchIntitule}
                        onChange={handleIntituleChange}
                        onFocus={(e) => e.target.classList.add('border-primary')}
                        onBlur={(e) => e.target.classList.remove('border-primary')}
                        className="flex-grow p-2 border-4 border-secondary focus:border-primary focus:outline-none rounded transition-colors duration-300"
                    />
                    <select
                        value={selectedTypeFacture}
                        onChange={handleTypeFactureChange}
                        className="flex-grow p-2 border-4 border-secondary focus:border-primary focus:outline-none rounded transition-colors duration-300"
                    >
                        <option value="">Type de Provision</option>
                        <option value="1">Facture Fournisseur</option>
                        <option value="2">Facture Clients</option>
                        <option value="3">Facture Salariés</option>
                    </select>
                    <select
                        value={extourneState}
                        onChange={handleExtourneChange}
                        className="flex-grow p-2 border-4 border-secondary focus:border-primary focus:outline-none rounded transition-colors duration-300"
                    >
                        <option value="" >Status d'Extourne</option>
                        <option value='1'>Extourner Totalement</option>
                        <option value='0'>Pas Extourner</option>
                    </select>
                </div>
                <div>
                    {/* Map through filteredProvisions and render ProvisionCard components */}
                    {filteredProvisions.map((provision) => (
                        <ProvisionCard key={provision.id} provision={provision} />
                    ))}
                </div>
            </div>
        </>
    );
    
}
