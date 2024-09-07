'use client';
import Nav from "@/components/nav";
import { fetchAllFactures1 } from "@/utils/fetch";
import { useEffect, useState } from "react";
import FactureCard from "@/components/FactCard";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { fetchAllAcomptes, fetchAllAcomptes1 } from "@/utils/acompte/fetch";
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
    const [selectedTypeSaisie, setSelectedTypeSaisie] = useState('1'); // Default to Facture
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const previleges = session?.user?.previleges;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }
        if (session?.user?.previleges?.admin) {
            router.push('/manageusers');
            return;
        }

        const fetchData = async () => {
            try {
                if (selectedTypeSaisie === '1') {
                  const facturesData = await fetchAllFactures1(itemsPerPage, (currentPage - 1) * itemsPerPage, searchId, searchIntitule, selectedTypeFacture, setTotalPages);
                  setFactures(facturesData);
                  setFilteredFactures(facturesData);
                }else{
                  const acomptesData = await fetchAllAcomptes1(itemsPerPage, (currentPage - 1) * itemsPerPage, searchId, searchIntitule, selectedTypeFacture, setTotalPages);
                  setAcomptes(acomptesData);
                  setFilteredAcomptes(acomptesData);
                }
                
                
                
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Fetch Error:', err);
            }
            setLoading(false);
        };

        fetchData();
    }, [session, status, router, searchId, searchIntitule, selectedTypeFacture, selectedTypeSaisie]);
    useEffect(() => {
      const fetchDataPage = async () => {
        try {
            if (selectedTypeSaisie === '1') {
              const facturesData = await fetchAllFactures1(itemsPerPage, (currentPage - 1) * itemsPerPage, searchId, searchIntitule, selectedTypeFacture);
            setFactures(facturesData);
            setFilteredFactures(facturesData);
            }else{
              const acomptesData = await fetchAllAcomptes1(itemsPerPage, (currentPage - 1) * itemsPerPage, searchId, searchIntitule, selectedTypeFacture);
            setAcomptes(acomptesData);
            setFilteredAcomptes(acomptesData);
            }
            
            
            
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Fetch Error:', err);
        }
        setLoading(false);
    };

    fetchDataPage();
    },[currentPage])

    useEffect(() => {
      const lowercasedSearchId = searchId.toLowerCase();
      const lowercasedSearchIntitule = searchIntitule.toLowerCase();
      
      const filterData = async () => {
          let data = [];
          if (selectedTypeSaisie === '1') {
              const res = await fetchAllFactures1(itemsPerPage, (currentPage - 1) * itemsPerPage, lowercasedSearchId, lowercasedSearchIntitule, selectedTypeFacture,setTotalPages);
              return res;  // Assuming `res` is an array
          } else if (selectedTypeSaisie === '2') {
              const res = await fetchAllAcomptes1(itemsPerPage, (currentPage - 1) * itemsPerPage, lowercasedSearchId, lowercasedSearchIntitule, selectedTypeFacture,setTotalPages);
              return res
          }
  
          return data;  // Ensure it returns an array
      };
  
      const fetchAndSetData = async () => {
          const filteredData = await filterData();
  
          if (selectedTypeSaisie === '1') {
              setFilteredFactures(filteredData);
          } else if (selectedTypeSaisie === '2') {
              setFilteredAcomptes(filteredData);
          }
      };
  
      fetchAndSetData(); // Call the async function
  }, [searchId, searchIntitule, selectedTypeFacture, factures, acomptes, selectedTypeSaisie]);
  useEffect(() => {
    setCurrentPage(1);
  },[searchId, searchIntitule, selectedTypeFacture]);
  

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
        setCurrentPage(1); // Reset to first page on type change
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Guard clause for page bounds
        setCurrentPage(newPage);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const currentData = selectedTypeSaisie === '1' ? filteredFactures : filteredAcomptes;

    return (
        <>
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
                            <option value="1">Facture</option>
                            <option value="2">Acompte</option>
                        </select>
                    </div>
                </div>
                <div>
                    {selectedTypeSaisie === '1' && filteredFactures.map((facture) => (
                        <FactureCard key={facture.id} facture={facture} />
                    ))}
                    {selectedTypeSaisie === '2' && filteredAcomptes.map((acompte) => (
                        <AcompteCard key={acompte.id} acompte={acompte} />
                    ))}
                </div>
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
