'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProvisionCard from "@/components/ProvisionCard";
import { fetchAllProvision1 } from "@/utils/provision/fetch"; // Update this to include pagination and filters

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [provisions, setProvisions] = useState([]);
    const [filteredProvisions, setFilteredProvisions] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchIntitule, setSearchIntitule] = useState('');
    const [selectedTypeFacture, setSelectedTypeFacture] = useState('');
    const [extourneState, setExtourneState] = useState('');

    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);  // Total number of pages
    const limit = 10; // Number of provisions per page

    // Loading state to handle session check delay

    useEffect(() => {
        if (status === 'loading') {
            // Wait for the session status to resolve
            return;
        }

        if (!session) {
            router.push('/login');
            return;
        }

        if (session?.user?.previleges?.admin) {
            router.push('/manageusers');
            return;
        }
        fetchData(); // Fetch data when the component mounts
    }, [session, status, currentPage, searchId, searchIntitule, selectedTypeFacture, extourneState]); // Refetch data when filters or page changes

    const fetchData = async () => {
        try {
            const limit = 10;  // Set default limit
            // Pass filters and pagination params to fetch function
            const data = await fetchAllProvision1(
                limit,
                (currentPage - 1) * limit,
                searchId,
                searchIntitule,
                selectedTypeFacture,
                extourneState,
                setTotalPages
            );
            setProvisions(data);
            setFilteredProvisions(data); // Apply same data to filtered provisions initially
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Fetch Error:', err);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleIdChange = (event) => {
        setSearchId(event.target.value);
        console.log(searchId)
        setCurrentPage(1); // Reset to first page when search criteria change
    };

    const handleIntituleChange = (event) => {
        setSearchIntitule(event.target.value);
        setCurrentPage(1);
    };

    const handleTypeFactureChange = (event) => {
        setSelectedTypeFacture(event.target.value);
        setCurrentPage(1);
    };

    const handleExtourneChange = (event) => {
        setExtourneState(event.target.value);
        setCurrentPage(1);
    };

    

    return (
        <>
            <div className="p-4 overlay">
                {error && <p className="text-red-500">{error}</p>}

                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="mb-4 w-full flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={handleIdChange}
                        className="flex-grow p-2 border-4 rounded border-secondary"
                    />
                    <input
                        type="text"
                        placeholder="Search by Intitule"
                        value={searchIntitule}
                        onChange={handleIntituleChange}
                        className="flex-grow p-2 border-4 rounded border-secondary"
                    />
                    <select
                        value={selectedTypeFacture}
                        onChange={handleTypeFactureChange}
                        className="flex-grow p-2 border-4 rounded border-secondary"
                    >
                        <option value="">Type de Provision</option>
                        <option value="1">Facture Fournisseur</option>
                        <option value="2">Facture Clients</option>
                        <option value="3">Facture Salariés</option>
                    </select>
                    <select
                        value={extourneState}
                        onChange={handleExtourneChange}
                        className="flex-grow p-2 border-4 rounded border-secondary"
                    >
                        <option value="">Status d'Extourne</option>
                        <option value='1'>Extourner Totalement</option>
                        <option value='0'>Pas Extourner</option>
                    </select>
                </div>

                {/* Display provision cards */}
                <div>
                    {filteredProvisions.map((provision) => (
                        <ProvisionCard key={provision.id} provision={provision} />
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                    >
                        Previous
                    </button>
                    <span className="mx-2">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
