'use client';
import Nav from "@/components/nav";
import { fetchAllFactures } from "@/utils/fetch";
import { useEffect, useState } from "react";
import FactureCard from "@/components/FactCard";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [factures, setFactures] = useState([]);
    const [filteredFactures, setFilteredFactures] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchIntitule, setSearchIntitule] = useState('');
    const [selectedTypeFacture, setSelectedTypeFacture] = useState('');
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

        const fetchData = async () => {
            try {
                const data = await fetchAllFactures(); // Fetch without filters
                console.log("Fetched Data:", data); // Log the fetched data
                setFactures(data);
                setFilteredFactures(data); // Initialize filteredFactures
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Fetch Error:', err);
            }
        };

        fetchData();
        setLoading(false); // Data fetching is complete
    }, [session, status, router]); // Include status in dependencies

    useEffect(() => {
        // Filter factures based on search inputs
        const lowercasedSearchId = searchId.toLowerCase();
        const lowercasedSearchIntitule = searchIntitule.toLowerCase();

        const filtered = factures.filter(facture => 
            (searchId === '' || facture.id.toString().includes(lowercasedSearchId)) &&
            (searchIntitule === '' || facture.intitule.toLowerCase().includes(lowercasedSearchIntitule)) &&
            (selectedTypeFacture === '' || facture.type_facture === parseInt(selectedTypeFacture))
        );
        setFilteredFactures(filtered);
    }, [searchId, searchIntitule, selectedTypeFacture, factures]);

    const handleIdChange = (event) => {
        setSearchId(event.target.value);
    };

    const handleIntituleChange = (event) => {
        setSearchIntitule(event.target.value);
    };

    const handleTypeFactureChange = (event) => {
        setSelectedTypeFacture(event.target.value);
    };

    if (loading) {
        return <p>Loading...</p>; // Display loading indicator while waiting for session status
    }

    return (
        <>
            <Nav />
            <h1 className="text-3xl font-bold mb-4">{session.user.email || 'Unknown'}</h1>
            <ul>
                <li>Admin: {previleges.admin ? 'Yes' : 'No'}</li>
                <li>Prev1: {previleges.prev1 ? 'Yes' : 'No'}</li>
                <li>Prev2: {previleges.prev2 ? 'Yes' : 'No'}</li>
            </ul>
            <div className="p-4">
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={handleIdChange}
                        className="mb-2 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Search by Intitule"
                        value={searchIntitule}
                        onChange={handleIntituleChange}
                        className="mb-2 p-2 border border-gray-300 rounded"
                    />
                    <select
                        value={selectedTypeFacture}
                        onChange={handleTypeFactureChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">All Types</option>
                        <option value="1">Facture Fournisseur</option>
                        <option value="2">Facture Salariés</option>
                        <option value="3">Facture Clients</option>
                    </select>
                </div>
                {filteredFactures.length > 0 ? (
                    <div>
                        {/* Map through filteredFactures and render FactureCard components */}
                        {filteredFactures.map((facture) => (
                            <FactureCard key={facture.id} facture={facture} />
                        ))}
                    </div>
                ) : (
                    <p>No factures found</p>
                )}
            </div>
        </>
    );
}
