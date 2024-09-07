'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const FournisseursTable = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterIDFrs, setFilterIDFrs] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterNIF, setFilterNIF] = useState('');

  const fetchFournisseurs = async () => {
    const fields = 'IDFrs, FrsName, NIF, ADRESS, CONTACT, MODRGL';
    const table = 'frs';
    let filters = [];
    
    if (filterIDFrs) filters.push(`IDFrs = ${filterIDFrs}`);
    if (filterName) filters.push(`FrsName LIKE '%${filterName}%'`);
    if (filterNIF) filters.push(`NIF LIKE '%${filterNIF}%'`);

    const filterString = filters.length ? filters.join(' AND ') : '';
    const offset = (currentPage - 1) * itemsPerPage;
    const query = new URLSearchParams({
      fields,
      table,
      filters: filterString,
      limit: itemsPerPage,
      offset
    }).toString();
    const url = `/api/getdatapage?${query}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      setFournisseurs(result.results);
      setFilteredFournisseurs(result.results);
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching fournisseurs:', error);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, [currentPage, filterIDFrs, filterName, filterNIF]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterIDFrs, filterName, filterNIF]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">Fournisseur List</h1>

      {/* Filters Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="number"
            placeholder="ID Fournisseur"
            value={filterIDFrs}
            onChange={(e) => setFilterIDFrs(e.target.value)}
            className="flex-1 p-3 border-4 border-secondary rounded-lg transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Nom Fournisseur"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 p-3 border-4 border-secondary rounded-lg transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="NIF"
            value={filterNIF}
            onChange={(e) => setFilterNIF(e.target.value)}
            className="flex-1 p-3 border-4 border-secondary rounded-lg transition-colors duration-300 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-6 px-6 border-b text-center font-bold">ID du Fournisseur</th>
            <th className="py-6 px-6 border-b text-center font-bold">Nom du Fournisseur</th>
            <th className="py-6 px-6 border-b text-center font-bold">NIF</th>
            <th className="py-6 px-6 border-b text-center font-bold">Adresse</th>
            <th className="py-6 px-6 border-b text-center font-bold">Contact</th>
            <th className="py-6 px-6 border-b text-center font-bold">Mode de Règlement</th>
            <th className="py-6 px-6 border-b text-center font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFournisseurs?.map((fournisseur, index) => (
            <tr key={fournisseur.IDFrs} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.IDFrs}</td>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.FrsName}</td>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.NIF}</td>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.ADRESS}</td>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.CONTACT}</td>
              <td className="py-6 px-6 border-r border-b text-center font-bold">{fournisseur.MODRGL}</td>
              <td className="py-6 px-6 text-center">
                <Link href={`/managefrs/${fournisseur.IDFrs}`} className="bg-secondary text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 border-4 border-secondary rounded-lg transition-colors duration-300 focus:outline-none focus:border-primary"
        >
          Previous
        </button>
        <span className="mx-4 text-lg">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 border-4 border-secondary rounded-lg transition-colors duration-300 focus:outline-none focus:border-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FournisseursTable;
