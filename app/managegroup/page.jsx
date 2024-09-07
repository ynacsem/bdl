'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const GroupsTable = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterName, setFilterName] = useState(''); // Filter for name
  const [filterStatus, setFilterStatus] = useState(''); // Filter for status
  const [filterCodegrp, setFilterCodegrp] = useState(''); // Added filter for codegrp
  const { data: session, status } = useSession();

  const fetchGroups = async () => {
    const fields = 'codegrp, libelle, date_dval, is_actif, date_fval';
    const table = 'groupe';
    let filters = [];
    if (filterName) filters.push(`libelle LIKE '%${filterName}%'`);
    if (filterStatus) filters.push(`is_actif = ${filterStatus}`);
    if (filterCodegrp) filters.push(`codegrp LIKE '%${filterCodegrp}%'`); // Added filter for codegrp

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
      setGroups(result.results);
      setFilteredGroups(result.results);
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [session, status, currentPage, filterName, filterStatus, filterCodegrp]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterStatus, filterCodegrp]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Guard clause for page bounds
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">Group List</h1>

      {/* Filters Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="text"
            placeholder="Group Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Group Code"
            value={filterCodegrp}
            onChange={(e) => setFilterCodegrp(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-2 px-4 border-b text-center font-bold">Group Code</th> {/* Added column for codegrp */}
            <th className="py-2 px-4 border-b text-center font-bold">Group Name</th>
            <th className="py-2 px-4 border-b text-center font-bold">Date Début de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Date Fin de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Is Active</th>
            <th className="py-2 px-4 border-b text-center font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group, index) => (
            <tr key={group.codegrp} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="py-4 px-4 border-r border-b text-center font-bold">{group.codegrp}</td> {/* Added cell for codegrp */}
              <td className="py-4 px-4 border-r border-b text-center font-bold">{group.libelle}</td>
              <td className="py-4 px-4 border-r border-b text-center font-bold">{new Date(group.date_dval).toLocaleDateString('fr-FR')}</td>
              <td className="py-4 px-4 border-r border-b text-center font-bold">{new Date(group.date_fval).toLocaleDateString('fr-FR')}</td>
              <td className={`py-4 px-4 border-r border-b text-center font-bold ${group.is_actif ? 'text-green-500' : 'text-red-500'}`}>
                {group.is_actif ? 'Active' : 'Inactive'}
              </td>
              <td className="py-2 px-4 h-32 text-center">
                <Link href={`/managegroup/${group.codegrp}`} className="bg-secondary text-white py-2 px-4 rounded hover:bg-purple-700">
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
  );
};

export default GroupsTable;
