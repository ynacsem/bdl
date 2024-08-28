//privison has the same structure of a facture with adding a checkbox with also a modify different to facture
// in the table we have the montant restant a extourner



'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { handleSubmit } from '@/utils/provision/handleSubmit';
import { uploadFile } from '@/utils/fileupload';
import { fetchLign } from '@/utils/fetch';
import {uploadFiles} from '@/utils/fileupload';
import { useSession } from 'next-auth/react';

export default function Provision() {
    const { data: session, status } = useSession();
    const [files, setFiles] = useState([]); 
  const router = useRouter()
  const [suppliers, setSuppliers] = useState([]);
  const [struct, setStruct] = useState([]);
  const [lib,setLib] = useState([])
  const [formData, setFormData] = useState({
    intitule: '',
    id_fournisseur: '',
    ref: '',
    date: new Date().toISOString().split('T')[0],
    gest: session?.user.username,
    observations: '',
    type:'',
    stru_ord: '', // New field
    stru_dest: '', // New field
    montant: '', // New field
    date_pro: '',
     // New field
    date_extourne: '',
    etat:1,
    extourne:0
  });

  const [tableData, setTableData] = useState([
    {
      codeOperation: '',
      libelle: '',
      compte: '',
      TVA: '',
      nature: '',
      montantUnitaireHT: 0,
      quantite: 0,
      montantTotal: 0,
      montantRestant: 0
    }
  ]);

  const [formError, setFormError] = useState('');
  const [tableError, setTableError] = useState('');

  const handleChange = async (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      extourne: event.target.checked ? 1 : 0
    }));
  };

  const handleTableChange = async (index, e) => {
    const { name, value } = e.target;
    const newTableData = [...tableData];
    newTableData[index] = { ...newTableData[index], [name]: value };

    if (name === 'montantUnitaireHT' || name === 'quantite') {
      newTableData[index].montantTotal = (parseFloat(newTableData[index].montantUnitaireHT || 0) * parseFloat(newTableData[index].quantite|| 0)).toFixed(2);
      newTableData[index].montantRestant=newTableData[index].montantTotal
     
    }
    if(name ==='libelle'){
      const data = await fetchLign(value,false,true);
      
      const newData = data.results[0];
      console.log(newData)
      newTableData[index] = {...newTableData[index], codeOperation: newData.cod_op,  nature: newData.type,compte:newData.compte};
    }

     setTableData(newTableData);
     setFormData({...formData,montant:calculateTotal(newTableData)})
   };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        codeOperation: '',
        libelle: '',
        compte: '',
        TVA: '',
        nature: '',
        montantUnitaireHT: 0,
        quantite: 0,
        montantTotal: 0,
        montantRestant: 0
      }
    ]);
  };

  const handleDeleteRow = (index) => {
    const newTableData = tableData.filter((_, i) => i !== index);
    setTableData(newTableData);
    setFormData({ ...formData, montant: calculateTotal(newTableData) });
  };


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
    const fetchData = async () => {
      try {
        const res = await fetchLign('','',false);
        setLib(res.results);
        console.log(res.results);
        await fetchSuppliers(); // Assuming fetchSuppliers is async and should be awaited
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

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
        console.warn('No structure found.');
      }
    } catch (error) {
      console.error('Error fetching structures:', error);
    }
  };

  useEffect(() => {
    fetchStruct();
    
      if (status === 'loading') {
        // Wait for the session status to resolve
        return;
    }
  
    if (!session) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
    }
    
  }, []);

  const onSubmit = async (e) => {//to be changed
    e.preventDefault(); // Prevent form submission

    
        // If no file is being uploaded, just submit the form
    let provisionId = await handleSubmit(e, formData, tableData, router, setFormError);
    if (files.length > 0) {
      const apiUrl = 'http://localhost:3000/api/uploadfile'; // Replace with your API endpoint

        try {
            console.log('provisionId',provisionId)
            const result = await uploadFiles(apiUrl, null,null,provisionId, files);
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
};
const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => {
        // Create a Map to handle unique files based on their names
        const fileMap = new Map(prevFiles.map((file) => [file.name, file]));
        selectedFiles.forEach((file) => fileMap.set(file.name, file));
        return Array.from(fileMap.values());
    });
    e.target.value = ''; // Reset file input value to allow re-selection of the same file
  };
  
  // Handle file removal
  const handleFileRemove = (fileName) => {
    setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName)
    );
  };
  
  // Handle file download
  const handleFileDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };


  return (
    <div className=" overlay p-4 max-w-6xl mx-auto bg-gray-100 border border-gray-300 rounded-lg m-12">
      
      
      
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Saisie Provision</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {formError && <p className="text-red-500">{formError}</p>}
        {tableError && <p className="text-red-500">{tableError}</p>}

        <div className="space-y-2">
  <div>
    <label htmlFor="intitule" className="block text-gray-800 font-semibold mb-1">Intitulé</label>
    <input
      type="text"
      id="intitule"
      name="intitule"
      required
      value={formData.intitule}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>
  <div>
    <label htmlFor="id_fournisseur" className="block text-gray-800 font-semibold mb-1">Fournisseur</label>
    <div className="flex items-center space-x-2">
      <select
        id="id_fournisseur"
        name="id_fournisseur"
        value={formData.id_fournisseur}
        onChange={handleChange}
        className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
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
        className="bg-purple-800 text-white rounded-md px-3 py-1 text-center hover:bg-purple-700"
      >
        Ajouter un fournisseur
      </Link>
    </div>
  </div>
  <div>
    <label htmlFor="ref" className="block text-gray-800 font-semibold mb-1">Référence</label>
    <input
      type="text"
      id="ref"
      name="ref"
      value={formData.ref}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>
  <div>
    <label htmlFor="date_auto" className="block text-gray-800 font-semibold mb-1">Date</label>
    <input
      type="date"
      id="date"
      name="date"
      value={formData.date}
      readOnly
      className="w-full border border-purple-800 p-2 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
    />
  </div>
  



  <div>
    <label htmlFor="observations" className="block text-gray-800 font-semibold mb-1">Pièces justificatives</label>
    <textarea
      id="observations"
      name="observations"
      value={formData.observations}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>
  <div>
    <h3 className="text-xl font-semibold mb-2 text-purple-800">Selected Files:</h3>
    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-sm">
          <th className="border-b text-left px-2 py-1">
            <button
              type="button"
              onClick={() => document.getElementById('fileInput').click()}
              className="bg-purple-800 text-white hover:bg-purple-700 py-1 px-2 rounded-md"
            >
              Add Files
            </button>
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileSelect}
              className="hidden"
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
              <td className="py-1 px-2 border-b text-gray-700">{file.name}</td>
              <td className="py-1 px-2 border-b">
                <button
                type='button'
                  onClick={() => handleFileDownload(file)}
                  className="bg-purple-800 text-white hover:bg-purple-700 py-1 px-3 rounded-md mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleFileRemove(file.name)}
                  className="bg-red-500 text-white hover:bg-red-600 py-1 px-3 rounded-md"
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
  <div>
      <label htmlFor="type" className="block text-gray-800 font-semibold mb-1">Type de Provision</label>
      <select
        id="type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 `}
        
      >
        <option value='' disabled>Sélectionner un type</option>
        <option value={1}>Provision Fournisseur</option>
        <option value={2}>Provision Salarié</option>
        <option value={3}>Provision Client</option>
      </select>
    </div>

  <div>
    <label htmlFor="structure_ord" className="block text-gray-800 font-semibold mb-1">Structure Ordonnatrice</label>
    <select
      id="structure_ordonnatrice"
      name="stru_ord"
      value={formData.stru_ord}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
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
      value={formData.stru_dest}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    >
      <option value="" disabled>Sélectionner une structure</option>
      {struct.map((s, index) => (
        <option key={index} value={s.libelle}>{s.libelle}</option>
      ))}
    </select>
  </div>
    <div>
    <label htmlFor="montant" className="block text-gray-800 font-semibold mb-1">Montant</label>
    <input
      type="number"
      id="montant"
      name="montant"
      value={formData.montant}
      onChange={handleChange} // Call the function to get the total amount
      readOnly // Make the input view-only
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>

  <div>
    <label htmlFor="date_pro" className="block text-gray-800 font-semibold mb-1">Date Provision</label>
    <input
      type="date"
      id="date_pro"
      name="date_pro"
      value={formData.date_pro}
      onChange={handleChange}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>
  <div>
    <label htmlFor="date_extourne" className="block text-gray-800 font-semibold mb-1">Date d'extourne</label>
    <input
      type="date"
      id="date_extourne"
      name="date_extourne"
      value={formData.date_extourne}
      onChange={handleChange}
      min={formData.date_pro}
      className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
    />
  </div>
</div>


  

        {/* Table Section */}
        <h2 className="text-xl font-bold mt-8 mb-4">Détails de la Facture</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-2">Code Opération</th>
              <th className="border px-8 py-2">Libellé</th>
              <th className="border px-2 py-2">Compte</th>
              <th className="border px-2 py-2">Code TVA</th>
              <th className="border px-2 py-2">Nature</th>
              <th className="border px-2 py-2">Montant Unitaire HT</th>
              <th className="border px-2 py-2">Quantité</th>
              <th className="border px-2 py-2">Montant Total</th>
              <th className="border px-2 py-2">Montant restant a extourner</th>
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
                    value={row.codeOperation||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border py-2">
                  <select
                    type="text"
                    name="libelle"
                    value={row.libelle||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  >
                    <option value="" disabled>Sélectionner un libellé</option>
                    {lib.map((libelle) => (
                      <option  value={libelle.libelle}>
                        {libelle.libelle}
                      </option>
                    ))}
                  </select>
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
                    name="nature"
                    value={row.nature||''}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="number"
                    name="montantUnitaireHT"
                    value={row.montantUnitaireHT||'0'}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="number"
                    name="quantite"
                    value={row.quantite||'0'}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="montantTotal"
                    value={row.montantTotal||'0'}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                    readOnly
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="text"
                    name="montantRestant"
                    value={row.montantRestant||'0'}
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
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
        >
          Ajouter une ligne
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}