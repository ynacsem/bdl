'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link component from next/link

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isActif, setIsActif] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [groupe, setGroupe] = useState('');
  const [email, setEmail] = useState('');
  const [codeUser, setCodeUser] = useState(''); // Added filter for code_user
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession();

  const fetchUsers = async () => {
    const fields = 'u.nom, u.prenom, u.email, u.date_fval AS date_fin_validite, u.date_dval AS date_debut_validite, u.code_user, u.codegrp_fk, g.libelle, u.is_actif';
    const table = 'user u';
    const joins = 'INNER JOIN `groupe` g ON u.codegrp_fk = g.codegrp';

    let filters = [];
    if (isActif) filters.push(`u.is_actif = ${parseInt(isActif)}`);
    if (nom) filters.push(`u.nom LIKE '%${nom}%'`);
    if (prenom) filters.push(`u.prenom LIKE '%${prenom}%'`);
    if (groupe) filters.push(`g.libelle LIKE '%${groupe}%'`);
    if (email) filters.push(`u.email LIKE '%${email}%'`);
    if (codeUser) filters.push(`u.code_user LIKE '%${codeUser}%'`); // Added filter for code_user

    const filterString = filters.length ? filters.join(' AND ') : '';
    const offset = (currentPage - 1) * itemsPerPage;

    const query = new URLSearchParams({
      fields,
      table,
      joins,
      filters: filterString,
      limit: itemsPerPage,
      offset
    }).toString();
    const url = `/api/getdatapage?${query}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      setUsers(result.results);
      setFilteredUsers(result.results);
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    
    fetchUsers();
  }, [session, status, isActif, nom, prenom, groupe, email, codeUser, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [isActif, nom, prenom, groupe, email, codeUser]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Guard clause for page bounds
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">User List</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Groupe"
            value={groupe}
            onChange={(e) => setGroupe(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Code User"
            value={codeUser}
            onChange={(e) => setCodeUser(e.target.value)}
            className="flex-1 p-2 border-4 border-secondary rounded transition-colors duration-300 focus:outline-none focus:border-primary"
          />
          <select
            value={isActif}
            onChange={(e) => setIsActif(e.target.value)}
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
            <th className="py-2 px-4 border-b text-center font-bold">Code User</th> {/* Added column for code_user */}
            <th className="py-2 px-4 border-b text-center font-bold">Nom</th>
            <th className="py-2 px-4 border-b text-center font-bold">Prénom</th>
            <th className="py-2 px-4 border-b text-center font-bold">Email</th> {/* Added column for email */}
            <th className="py-2 px-4 border-b text-center font-bold">Date Début de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Date Fin de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Groupe</th>
            <th className="py-2 px-4 border-b text-center font-bold">Is Active</th>
            <th className="py-2 px-4 border-b text-center font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user, index) => (
            <tr key={user.code_user} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.code_user}</td> {/* Added cell for code_user */}
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.nom}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.prenom}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.email}</td> {/* Added cell for email */}
              <td className="py-2 px-4 border-r border-b text-center font-bold">{new Date(user.date_debut_validite).toLocaleDateString('fr-FR')}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{new Date(user.date_fin_validite).toLocaleDateString('fr-FR')}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.libelle}</td>
              <td className={`py-2 px-4 border-r border-b text-center font-bold ${user.is_actif ? 'text-green-500' : 'text-red-500'}`}>
                {user.is_actif ? 'Active' : 'Inactive'}
              </td>
              <td className="py-2 px-4 h-32 text-center">
                <Link href={`/manageusers/${user.code_user}`} className="bg-secondary text-white py-2 px-4 rounded hover:bg-purple-700">
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

export default UsersTable;
