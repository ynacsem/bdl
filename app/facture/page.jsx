'use client';
import Nav from "@/components/nav";
import { fetchAllFactures } from "@/utils/fetch";
import { useEffect, useState } from "react";
import FactureCard from "@/components/FactCard";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { fetchAllAcomptes } from "@/utils/acompte/fetch";
import AcompteCard from "@/components/AcompteCard";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [acomptes, setAcomptes] = useState([]);
    const [factures, setFactures] = useState([]);
    const [filteredFactures, setFilteredFactures] = useState([]);
    const [filteredAcomptes, setFilteredAcomptes] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchIntitule, setSearchIntitule] = useState('');
    const [selectedTypeFacture, setSelectedTypeFacture] = useState('');
    const [selectedTypeSaisie, setSelectedTypeSaisie] = useState('');
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
                const data = await fetchAllFactures(); // Fetch without filters
                console.log("Fetched Data:", data); // Log the fetched data
                setFactures(data);
                setFilteredFactures(data); // Initialize filteredFactures
                const acomptesData = await fetchAllAcomptes();
                setAcomptes(acomptesData);
                setFilteredAcomptes(acomptesData);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Fetch Error:', err);
            }
            
        };

        fetchData();
        setLoading(false); // Data fetching is complete
    }, [session, status, router]); // Include status in dependencies

    useEffect(() => {
        const lowercasedSearchId = searchId.toLowerCase();
        const lowercasedSearchIntitule = searchIntitule.toLowerCase();
        
        if (selectedTypeSaisie === '2') {
            const filtered = [];
            setFilteredFactures(filtered);
            const filteredAcc = acomptes.filter(acc => 
                (searchId === '' || acc.id.toString().includes(lowercasedSearchId)) &&
                (searchIntitule === '' || acc.libelle_acompte.toLowerCase().includes(lowercasedSearchIntitule)) &&
                (selectedTypeFacture === '' || acc.type_facture === parseInt(selectedTypeFacture))
            );
            filteredAcc.reverse();
            setFilteredAcomptes(filteredAcc);
        } else if (selectedTypeSaisie === '1') {
            const filtered = factures.filter(facture => 
                (searchId === '' || facture.id.toString().includes(lowercasedSearchId)) &&
                (searchIntitule === '' || facture.intitule.toLowerCase().includes(lowercasedSearchIntitule)) &&
                (selectedTypeFacture === '' || facture.type_facture === parseInt(selectedTypeFacture))
            );
            filtered.reverse();
            setFilteredFactures(filtered);
            setFilteredAcomptes([]); // Clear acomptes if not showing them
        } else {
            const filteredFactures = factures.filter(facture => 
                (searchId === '' || facture.id.toString().includes(lowercasedSearchId)) &&
                (searchIntitule === '' || facture.intitule.toLowerCase().includes(lowercasedSearchIntitule)) &&
                (selectedTypeFacture === '' || facture.type_facture === parseInt(selectedTypeFacture))
            );
            filteredFactures.reverse();
            setFilteredFactures(filteredFactures);
            
            const filteredAcomptes = acomptes.filter(acc => 
                (searchId === '' || acc.id.toString().includes(lowercasedSearchId)) &&
                (searchIntitule === '' || acc.libelle_acompte.toLowerCase().includes(lowercasedSearchIntitule)) &&
                (selectedTypeFacture === '' || acc.type_facture === parseInt(selectedTypeFacture))
            );
            filteredAcomptes.reverse();
            setFilteredAcomptes(filteredAcomptes);
        }

    }, [searchId, searchIntitule, selectedTypeFacture, factures, acomptes, selectedTypeSaisie]);
    

    const handleIdChange = (event) => {
        setSearchId(event.target.value);
    };

    const handleIntituleChange = (event) => {
        setSearchIntitule(event.target.value);
    };

    const handleTypeFactureChange = (event) => {
        setSelectedTypeFacture(event.target.value);
    };
    const handleTypeSaisieChange = (event) => {
        setSelectedTypeSaisie(event.target.value);
    };
    if (loading) {
        return <p>Loading...</p>; // Display loading indicator while waiting for session status
    }

    return (
        <>
            {/* <Nav /> */}
            
            <div className="p-4 overlay">
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-4">Search</h2>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <input
                            type="text"
                            placeholder="Search by ID"
                            value={searchId}
                            onChange={handleIdChange}
                            onFocus={(e) => e.target.classList.add('border-primary')}
                            onBlur={(e) => e.target.classList.remove('border-primary')}
                            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                        />
                        <input
                            type="text"
                            placeholder="Search by Intitule"
                            value={searchIntitule}
                            onChange={handleIntituleChange}
                            onFocus={(e) => e.target.classList.add('border-primary')}
                            onBlur={(e) => e.target.classList.remove('border-primary')}
                            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                        />
                        <select
                            value={selectedTypeFacture}
                            onChange={handleTypeFactureChange}
                            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                        >
                            <option value="">All Types</option>
                            <option value="1">Facture Fournisseur</option>
                            <option value="2">Facture Clients</option>
                            <option value="3">Facture Salariés</option>
                        </select>
                        <select 
                            value={selectedTypeSaisie}
                            onChange={handleTypeSaisieChange}
                            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
                        >
                            <option value="">All Types</option>
                            <option value="1">Facture</option>
                            <option value="2">Acompte</option>
                        </select>
                    </div>
                </div>
                <div>
                    {filteredFactures.map((facture) => (
                        <FactureCard key={facture.id} facture={facture} />
                    ))}
                </div>
                <div>
                    {filteredAcomptes.map((acompte) => (
                        <AcompteCard key={acompte.id} acompte={acompte} />
                    ))}
                </div>
            </div>
        </>
    );
    
    
    
}
