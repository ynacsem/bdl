'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditFournisseurPage = ({params}) => {
    const router = useRouter();
  const [fournisseur, setFournisseur] = useState({
    FrsName: '',
    NIF: '',
    ADRESS: '',
    CONTACT: '',
    MODRGL: 'cheque'
  });

  const fetchFournisseur = async () => {
    try {
        const response = await fetch(`/api/getdata?filters=IDfrs=${params.IDfrs}&table=frs`);


      const data = await response.json();
      console.log(data)
      setFournisseur(data.results[0]);
    } catch (error) {
      console.error('Error fetching fournisseur details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/updatedata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idField: 'IDFrs',
            id: params.IDfrs,
            table: 'frs',
            data: fournisseur
        })
      });

      if (response.ok) {
        alert('Fournisseur updated successfully');
        router.push('/managefrs'); // Redirect back to the fournisseurs list page
      } else {
        console.error('Error updating fournisseur');
      }
    } catch (error) {
      console.error('Error updating fournisseur:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFournisseur((prevFournisseur) => ({
      ...prevFournisseur,
      [name]: value
    }));
  };

  useEffect(() => {
    if (params.IDfrs) {
      fetchFournisseur();
    }
  }, [params.IDfrs]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">Modifier Fournisseur</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="FrsName" className="block font-bold mb-2">Nom du Fournisseur</label>
          <input
            type="text"
            id="FrsName"
            name="FrsName"
            value={fournisseur.FrsName}
            onChange={handleChange}
            className="w-full p-2 border-4 border-secondary rounded focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="NIF" className="block font-bold mb-2">NIF</label>
          <input
            type="text"
            id="NIF"
            name="NIF"
            value={fournisseur.NIF}
            onChange={handleChange}
            className="w-full p-2 border-4 border-secondary rounded focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ADRESS" className="block font-bold mb-2">Adresse</label>
          <input
            type="text"
            id="ADRESS"
            name="ADRESS"
            value={fournisseur.ADRESS}
            onChange={handleChange}
            className="w-full p-2 border-4 border-secondary rounded focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="CONTACT" className="block font-bold mb-2">Contact</label>
          <input
            type="text"
            id="CONTACT"
            name="CONTACT"
            value={fournisseur.CONTACT}
            onChange={handleChange}
            className="w-full p-2 border-4 border-secondary rounded focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="MODRGL" className="block font-bold mb-2">Mode de Règlement</label>
          <select
            id="MODRGL"
            name="MODRGL"
            value={fournisseur.MODRGL}
            onChange={handleChange}
            className="w-full p-2 border-4 border-secondary rounded focus:outline-none focus:border-primary"
            required
          >
            <option value="cheque">Chèque</option>
            <option value="virement">Virement</option>
            <option value="espece">Espèce</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Modifier
        </button>
      </form>
    </div>
  );
};

export default EditFournisseurPage;
