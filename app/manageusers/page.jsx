'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link component from next/link

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();

  const fetchUsers = async () => {
    const fields = 'u.nom, u.prenom, u.email, u.date_fval AS date_fin_validite, u.date_dval AS date_debut_validite, u.code_user, u.codegrp_fk, g.libelle, u.is_actif';
    const table = 'user u';
    const joins = 'INNER JOIN `groupe` g ON u.codegrp_fk = g.codegrp';
  
    const query = new URLSearchParams({ fields, table, joins }).toString();
    const url = `/api/getdata?${query}`;
  
    try {
      const response = await fetch(url);
      const result = await response.json();
      setUsers(result.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    
  }, [session,status]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">User List</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-2 px-4 border-b text-center font-bold">Nom</th>
            <th className="py-2 px-4 border-b text-center font-bold">Prénom</th>
            <th className="py-2 px-4 border-b text-center font-bold">Date Début de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Date Fin de Validité</th>
            <th className="py-2 px-4 border-b text-center font-bold">Groupe</th>
            <th className="py-2 px-4 border-b text-center font-bold">Is Active</th>
            <th className="py-2 px-4 border-b text-center font-bold" >Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.code_user} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.nom}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.prenom}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{new Date(user.date_debut_validite).toLocaleDateString('fr-FR')}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{new Date(user.date_fin_validite).toLocaleDateString('fr-FR')}</td>
              <td className="py-2 px-4 border-r border-b text-center font-bold">{user.libelle}</td>
              <td className={`py-2 px-4 border-r border-b text-center font-bold ${user.is_actif ? 'text-green-500' : 'text-red-500'}`}>
                {user.is_actif ? 'Active' : 'Inactive'}
              </td>
              <td className="py-2 px-4 h-32 text-center">
                <Link href={`/manageusers/${user.code_user}`}
                className="bg-secondary text-white py-2 px-4 rounded hover:bg-purple-700">
                   
                    Modifier
                  
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
