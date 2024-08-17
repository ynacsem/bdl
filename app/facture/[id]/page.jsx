'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { handleEdit, handleedit } from '@/utils/handleEdit';
import { handleModifier } from '@/utils/handlePut';

export default function ModifierFacture({params}) {
  const router = useRouter();
  
    
  const [suppliers, setSuppliers] = useState([]);
  const [gest, setGest] = useState([]);
  const [formData, setFormData] = useState({
    intitule: '',
    id_fournisseur: '',
    reference_facture: '',

    date:'',
    gest: '',
    observations: '',
    type_facture: '', // New field
    type_saisie:'', // New field
    stru_ord: '', // New field
    stru_dest: '', // New field
    mod_reg: '', // New field
    montant: '', // New field
    date_facture: '',
    rip:'',
    num_cheq:'' // New field
     // New field for current date
  });

  const [tableData, setTableData] = useState([
    {
      codeOperation: '',
      libelle: '',
      compte: '',
      codeTVA: '',
      ligneBudgetaire: '',
      nature: '',
      montantUnitaireHT: 0,
      quantite: 0,
      montantTotal: 0
    }
  ]);
  
  const [formError, setFormError] = useState('');
  const [tableError, setTableError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files });
    } else {
      
      const newValue = name === 'frs_id' ? parseInt(value, 10) : value;
      
      setFormData({ ...formData, [name]: newValue });
    }
  };
  
  


  const handleTableChange = async (index, e) => {
    const { name, value } = e.target;
    const newTableData = [...tableData];
    
    // Update the specific row in the table data
    newTableData[index] = { ...newTableData[index], [name]: value };
  
    // Recalculate montantTotal if montantU or qte are changed
    if (name === 'montantU' || name === 'qte') {
      newTableData[index].montantTotal = (parseFloat(newTableData[index].montantU || 0) * parseFloat(newTableData[index].qte || 0)).toFixed(2);
      setFormData({ ...formData, montant: calculateTotal(newTableData) });
    }
  
    // Update the state with the new table data
    setTableData(newTableData);
    
    // Recalculate and update the formData with the total montant
    
  };
  

  const handleAddRow = () => {
    console.log(tableData)
    // Update tableData state and calculate the new total amount
    setTableData(prevTableData => {
      // Create the new table data with the added row
      const newTableData = [
        ...prevTableData,
        {
          id: 0,
          codeOperation: '',
          libelle: '',
          compte: '',
          TVA: '',
          ligneBudgetaire: '',
          nature: '',
          amputationComplementaire1: '',
          amputationComplementaire2: '',
          destination: '',
          montantU: 0,
          qte: 0,
          montantTotal: 0
        }
      ];
  
      // Update formData with the new total amount
      setFormData(prevFormData => ({
        ...prevFormData,
        montant: calculateTotal(newTableData) // Calculate total based on the new data
      }));
      console.log(formData.montant)
  
      return newTableData;
    });
  };
  

  const handleDeleteRow = async(index) => {
    if(tableData[index].id){
    const response = await fetch('/api/deletedata', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'ligne_fact',
          id: tableData[index].id,  // The id of the row you want to delete
        }),
      });
    } 
    const newTableData = tableData.filter((_, i) => i !== index);

    setTableData(newTableData);
    setFormData({ ...formData, montant: calculateTotal(newTableData) });
  };

  const handleSubmit = async (e) => {
    
    await handleModifier(e, formData, params.id, tableData, setFormError, router);
  }
      
  
  
  

      const calculateTotal = (data) => {
        return data.reduce((acc, row) => {
          return acc + parseFloat(row.montantTotal || 0);
        }, 0).toFixed(2);
      };
      

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

  useEffect(() => {
    fetchSuppliers();
  }, []);

  
  const [searchQuery, setSearchQuery] = useState('');
useEffect(() => {
     setSearchQuery(params.id);
    handleEdit(params.id, setFormData, setTableData);

},[params.id])
     // Update search query on input change
  

  

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <>
      
      <h1 className="text-2xl font-bold mb-4">Modifier une facture</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && <p className="text-red-500">{formError}</p>}
        {tableError && <p className="text-red-500">{tableError}</p>}

        <div className="space-y-2">
          <div>
            <label htmlFor="intitule" className="block">Intitulé</label>
            <input
              type="text"
              id="intitule"
              name="intitule"
              value={formData.intitule}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="id_fournisseur">Fournisseur</label>
            <div className="flex items-center space-x-2">
              <select
                id="id_fournisseur"
                name="id_fournisseur"
                value={formData.id_fournisseur}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>Sélectionner un fournisseur</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={supplier.IDfrs}>
                    {supplier.FrsName}
                  </option>
                ))}
              </select>
              <Link
                href="/facture/ajouterFrs"
                className="bg-blue-500 text-white text-center rounded"
              >
                Ajouter un fournisseur
              </Link>
            </div>
          </div>
          <div>
            <label htmlFor="reference_facture" className="block">Référence</label>
            <input
              type="text"
              id="reference_facture"
              name="reference_facture"
              value={formData.reference_facture}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="date" className="block">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="gest">Bon à valider</label>
            <select
              id="gest"
              name="gest"
              value={formData.gest}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner un gestionnaire</option>
              {gest
                .map((g, index) => (
                  <option key={index} value={g.nom}>
                    {g.nom}
                  </option>
                ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="observations" className="block">Pièces justificatives</label>
            <textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="files" className="block">Scannez ou chargez vos fichiers</label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div>
    <label htmlFor="type_facture" className="block">Type de Facture</label>
    <select
      id="type_facture"
      name="type_facture"
      value={formData.type_facture}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="" disabled>Sélectionner un type</option>
      <option value={1}>Facture Fournisseur</option>
      <option value={2}>Facture Salarié</option>
      <option value={3}>Facture Client</option>
    </select>
  </div>

  <div>
    <label htmlFor="type_saisie" className="block">Type de Saisie</label>
    <select
      id="type_saisie"
      name="type_saisie"
      value={formData.type_saisie}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="" disabled>Sélectionner un type</option>
      <option value={1}>Facture</option>
      <option value={2}>Facture Non Comptable</option>
      <option value={3}>Acompte</option>
      <option value={4}>Avoir</option>
      <option value={4}>Avoir Non Comptable</option>
    </select>
  </div>

  <div>
    <label htmlFor="stru_ord" className="block">Structure Ordonnatrice</label>
    <select
      id="stru_ord"
      name="stru_ord"
      value={formData.stru_ord}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="" disabled>Sélectionner une structure</option>
      {/* Populate options from your database */}
    </select>
  </div>

  <div>
    <label htmlFor="stru_dest" className="block">Structure Destinataire</label>
    <select
      id="stru_dest"
      name="stru_dest"
      value={formData.stru_dest}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="" disabled>Sélectionner une structure</option>
      {/* Populate options from your database */}
    </select>
  </div>

  <div>
    <label htmlFor="mod_reg" className="block">Mode de Règlement</label>
    <select
      id="mod_reg"
      name="mod_reg"
      value={formData.mod_reg}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="" disabled>Sélectionner un mode</option>
      <option value="cheque">Chèque</option>
      <option value="virement">Virement</option>
      <option value="espece">Espèce</option>
    </select>
  </div>
  {formData.mod_reg === 'cheque' && (
            <div>
              <label htmlFor="num_cheq" className="block">Numéro de Chèque</label>
              <input
                type="text"
                id="num_cheq"
                name="num_cheq"
                value={formData.num_cheq}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
  {formData.mod_reg === 'virement' && (
            <div>
              <label htmlFor="rip" className="block">RIP</label>
              <input
                type="text"
                id="rip"
                name="rip"
                value={formData.rip}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          )}


  <div>
  <label htmlFor="montant" className="block">Montant</label>
<input
  type="number"
  id="montant"
  name="montant"
  value={formData.montant}
  onChange={handleChange} // Call the function to get the total amount
  readOnly // Make the input view-only
  className="w-full border p-2 rounded"
/>

  </div>

  <div>
    <label htmlFor="date_facture" className="block">Date Facture</label>
    <input
      type="date"
      id="date_facture"
      name="date_facture"
      value={formData.date_facture}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    />
  </div>

        {/* Table Section */}
        <h2 className="text-xl font-bold mt-8 mb-4">Détails de la Facture</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-2">Code Opération</th>
              <th className="border px-2 py-2">Libellé</th>
              <th className="border px-2 py-2">Compte</th>
              <th className="border px-2 py-2">Code TVA</th>
              <th className="border px-2 py-2">Ligne Budgétaire</th>
              <th className="border px-2 py-2">Nature</th>
              <th className="border px-2 py-2">Montant Unitaire HT</th>
              <th className="border px-2 py-2">Quantité</th>
              <th className="border px-2 py-2">Montant Total</th>
              <th className="border px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="codeOperation"
                    value={row.codeOperation|''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border py-2">
                  <input
                    type="text"
                    name="libelle"
                    value={row.libelle|''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border py-2">
                  <input
                    type="text"
                    name="compte"
                    value={row.compte||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="TVA"
                    value={row.TVA||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="ligneBudgetaire"
                    value={row.ligneBudgetaire||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="nature"
                    value={row.nature||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                
                
                <td className="border  py-2">
                  <input
                    type="number"
                    name="montantU"
                    value={row.montantU||0}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="number"
                    name="qte"
                    value={row.qte||0}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="montantTotal"
                    value={(parseFloat(row.montantU || 0) * parseFloat(row.qte|| 0)).toFixed(2)}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                    readOnly
                  />
                </td>
                <td className="border py-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {/* Row for Total */}
           
          </tbody>
        </table>
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
        >
          Ajouter une ligne
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Modifier et Enregistrer
        </button>
      </form>
      </>
    </div>
  )
  }
