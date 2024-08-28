'use client';
import React, { useState, useEffect } from 'react';
import {fetchFrsAcompte} from '@/utils/backend';

export default function SaisieAcompte({ formData, onChange, files, handleFileSelect, handleFileRemove, downloadFile,isReadOnly }) {
  const [suppliers, setSuppliers] = useState([]);
  const [struct, setStruct] = useState([]);
  isReadOnly = isReadOnly || false;
  
  // Handle file removal
 ;
  
  
  // Handle file download
  

  // Handle field changes in a way that preserves the rest of the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value }; 

    // Vérification pour date_echeance et dateacmpt
    if (name === 'date_echeance') {
        // Vérifie si date_echeance est inférieur ou égal à dateacmpt
        if (new Date(value) <= new Date(formData.dateacmpt)) {
            alert('La date d\'échéance doit être supérieure à la date d\'acompte.');
            updatedFormData[name] = '0000-00-00'; // Réinitialiser à la valeur par défaut
        }
    }
    if ( name === 'dateacmpt') {
        // Vérifie si date_echeance est inférieur ou égal à dateacmpt
        if (new Date(value) >= new Date(formData.date_echeance)) {
            alert('La date d\'acompte doit être inférieure à la date d\'écheance.');
            updatedFormData[name] = '0000-00-00'; // Réinitialiser à la valeur par défaut
        }
    }
    
    if (name === 'id_fournisseur') {
        fetchFrsAcompte(value);
    }

    // Copier les données existantes et mettre à jour le champ spécifique
    onChange(updatedFormData); // Appeler le gestionnaire onChange du parent avec les données mises à jour
};

 useEffect(() => {
  // Select all input elements and set their className to 'bg-gray-400'
  if (isReadOnly) {
    document.querySelectorAll('input').forEach(input => {
      input.classList.add('bg-gray-400');
      input.classList.remove('bg-white');
  });
  document.querySelectorAll('select').forEach(input => {
    input.classList.add('bg-gray-400');
    input.classList.remove('bg-white');
})

 document.querySelectorAll('textarea').forEach(input => {
  input.classList.add('bg-gray-400');
  input.classList.remove('bg-white');
 })

  }
  
}, [isReadOnly]);
  const fetchSuppliers = async () => {
    const fields = 'FrsName,IDfrs';
    const table = 'frs';
    const filters = '';
  
    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;
  
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.results && result.results.length > 0) {
        
        setSuppliers(result.results);
      } else {
        console.warn('No suppliers found.');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

 

  const fetchStruct = async () => {
    const fields = 'libelle';
    const table = 'structure';
    const filters = '';

    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.results && result.results.length > 0) {
        setStruct(result.results);
      } else {
        console.warn('No structures found.');
      }
    } catch (error) {
      console.error('Error fetching structures:', error);
    }
  };

  useEffect(() => {
    fetchStruct();
    fetchSuppliers();
  }, []);
  useEffect(() => {
      if (isReadOnly===true){

      }
  },[isReadOnly])

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-100 border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Saisie Acompte</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <label htmlFor="type_facture" className="block text-gray-800 font-semibold mb-1">Type de Facture</label>
            <select
              id="type_facture"
              name="type_facture"
              value={formData.type_facture || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            >
              <option value="" disabled>Sélectionner un type</option>
              <option value={1}>Fournisseur</option>
              <option value={2}>Client</option>
            </select>
          </div>
          <div>
            <label htmlFor="stru_ord" className="block text-gray-800 font-semibold mb-1">Structure Ordonnatrice</label>
            <select
              id="stru_ord"
              name="stru_ord"
              value={formData.stru_ord || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            >
              <option value="" disabled>Sélectionner une structure</option>
              {struct.map((s, index) => (
                <option key={index} value={s.libelle}>{s.libelle}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stru_dest" className="block text-gray-800 font-semibold mb-1">Structure Destinataire</label>
            <select
              id="stru_dest"
              name="stru_dest"
              value={formData.stru_dest || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            >
              <option value="" disabled>Sélectionner une structure</option>
              {struct.map((s, index) => (
                <option key={index} value={s.libelle}>{s.libelle}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="libelle_acompte" className="block text-gray-800 font-semibold mb-1">Libellé d'Acompte</label>
            <input
              type="text"
              id="libelle_acompte"
              name="libelle_acompte"
              value={formData.libelle_acompte || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md  text-gray-800"
              required
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="montant" className="block text-gray-800 font-semibold mb-1">Le Montant</label>
            <input
              type="number"
              id="montant"
              name="montant"
              value={formData.montant || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="id_fournisseur" className="block text-gray-800 font-semibold mb-1">Fournisseur</label>
            <select
              id="id_fournisseur"
              name="id_fournisseur"
              value={formData.id_fournisseur || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            >
              <option value="" disabled>Sélectionner un fournisseur</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier.IDfrs}>
                  {supplier.FrsName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-800 font-semibold mb-1">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              disabled
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="dateacmpt" className="block text-gray-800 font-semibold mb-1">Date d'Acompte</label>
            <input
              type="date"
              id="dateacmpt"
              name="dateacmpt"
              value={formData.dateacmpt || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="date_echeance" className="block text-gray-800 font-semibold mb-1">Date d'échéance</label>
            <input
              type="date"
              id="date_echeance"
              name="date_echeance"
              value={formData.date_echeance || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-purple-800">Selected Files:</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border-b text-left px-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById('fileInput').click()}
                      className={`bg-purple-800 text-white hover:bg-purple-700 py-1 px-2 rounded-md`}
                      disabled={isReadOnly}
                      hidden={isReadOnly}
                    >
                      Add Files
                    </button>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isReadOnly}
                    />
                  </th>
                  <th className="py-1 px-2 border-b text-left">File Name</th>
                  <th className="py-1 px-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file) => (
                    <tr key={file.name}>
                      <td className="py-1 px-2 border-b text-gray-700">{file.fileName || file.name}</td>
                      <td className="py-1 px-2 border-b">
                        <button
                          type='button'
                          onClick={() => downloadFile(file)}
                          className={`bg-purple-800 text-white hover:bg-purple-700 py-1 px-3 rounded-md mr-2`}
                          
                        >
                          View
                        </button>
                        <button
                          type='button'
                          onClick={() => handleFileRemove(file.name, file.id)}
                          className={`bg-red-500 text-white hover:bg-red-600 py-1 px-3 rounded-md`}
                          disabled={isReadOnly}
                          hidden={isReadOnly}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-gray-500 text-center">
                      No files selected
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


  );
}
