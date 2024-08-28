//privison has the same structure of a facture with adding a checkbox with also a modify different to facture
// in the table we have the montant restant a extourner



'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { fetchLign } from '@/utils/fetch';
import {uploadFiles} from '@/utils/fileupload';
import { useSession } from 'next-auth/react';
import { handleEdit } from '@/utils/provision/handleEdit';
import { handleModifier } from '@/utils/provision/handlePut';
import { fetchFiles } from '@/utils/provision/fetchFiles';

export default function Provision({params}) {
    const { data: session, status } = useSession();

    const [files, setFiles] = useState([]); 
    
  const [isReadOnly,setIsReadonly] = useState(false);

  const [previleges, setPrevileges] = useState(null);
    
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
    etat:1,
    extourne:0,
    date_extourne: ''
  });
  useEffect(()=>{
    if (status === 'loading') {
      // Wait for the session status to resolve
      return;
  }

  if (!session) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
  }
  },[])

  const [tableData, setTableData] = useState([
    {
      codeOperation: '',
      libelle: '',
      compte: '',
      TVA: '',
      nature: '',
      montantUnitaireHT: 0,
      qte: 0,
      montantU: 0,
      montantRestant: 0
    }
  ]);

  const [formError, setFormError] = useState('');
  const [tableError, setTableError] = useState('');
useEffect(() => {
    setSearchQuery(params.id);
    handleEdit(params.id, setFormData, setTableData);
},[params.id])
useEffect(() => {
  if (formData.etat === 2) {
    setIsReadonly(true);
  }
},[formData])
useEffect(() => {
  // Check if isReadOnly is true
  if (isReadOnly) {
    // Apply styles and disable inputs
    document.querySelectorAll('input').forEach(input => {
      input.classList.add('bg-gray-400');
      input.classList.remove('bg-white');
      input.disabled = true; // Add disabled attribute
    });

    document.querySelectorAll('select').forEach(select => {
      select.classList.add('bg-gray-400');
      select.classList.remove('bg-white');
      select.disabled = true; // Add disabled attribute
    });

    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.classList.add('bg-gray-400');
      textarea.classList.remove('bg-white');
      textarea.disabled = true; // Add disabled attribute
    });
  }
}, [isReadOnly, formData]);

useEffect(() => {
  if (status === 'authenticated') {
    setPrevileges(session?.user?.previleges || {});
  }
}, [status, session])

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

    if (name === 'montantU' || name === 'qte') {
      newTableData[index].montantTotal = (parseFloat(newTableData[index].qte || 0) * parseFloat(newTableData[index].montantU|| 0)).toFixed(2);
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
        qte: 0,
        montantU: 0,
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
  }, []);

  
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
  const handleFileRemove = async(fileName,id) => {
    if (id){
      const table = 'files';
      const resp = await fetch('/api/deletedata', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id ,table})},
      )
    }
    setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName)
    );
  };
  
  // Handle file download
  function downloadFile(file) {
    if (file.fileName) {
      const link = document.createElement('a');
    link.href = file.url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }else{
      const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
    }
    
}
  
  
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    setSearchQuery(params.id);
   handleEdit(params.id, setFormData, setTableData);
},[params.id])
const handleSubmit = async (e,validate) => {
  validate = validate || false
  if (validate){
    await handleModifier(e, formData, params.id, tableData, setFormError, router,true);
  }else{
    await handleModifier(e, formData, params.id, tableData, setFormError, router);
  }

const filesWithoutId = files.filter(file => !file.id); // Filter out files that do have an id
if (filesWithoutId.length > 0) {
  console.log(filesWithoutId);
  const apiUrl = 'http://localhost:3000/api/uploadfile';
    console.log(filesWithoutId)
    await uploadFiles(apiUrl, null, null,params.id, filesWithoutId);
}

}
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
    try {
      const res = await fetchFiles(params.id);
      console.log(res)
      setFiles(res);
    } catch (error) {
      
    }
  };

  fetchData();
}, [params.id]);
const handleValidation = async (e) => {
  e.preventDefault();

  // Your validation logic
  let emptyFormFields = [];
  for (const [key, value] of Object.entries(formData)) {
    if (value === '') {
      emptyFormFields.push(key);
    }
  }
  if (emptyFormFields.length > 0) {
    console.log("Empty form fields:", emptyFormFields);
    alert('Please fill in all the fields in the form.');
    return;
  }

  let emptyTableRows = [];
  tableData.forEach((row, index) => {
    let emptyFieldsInRow = [];
    for (const [key, value] of Object.entries(row)) {
      if (value === '') {
        emptyFieldsInRow.push(key);
      }
    }
    if (emptyFieldsInRow.length > 0) {
      emptyTableRows.push({ rowIndex: index, emptyFields: emptyFieldsInRow });
    }
  });
  if (emptyTableRows.length > 0) {
    console.log("Empty table rows:", emptyTableRows);
    alert('Please fill in all the rows in the table.');
    return;
  }

  // Confirm action with user
  const isConfirmed = window.confirm('Are you sure you want to proceed?');
  
  if (isConfirmed) {
     // Exit if user cancels
     
  
    // Wait for state to update
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 50); // Wait for state update
    });
  
    // Log updated form data
    console.log("FormData after state update:", formData);
  
    // Check if state has updated
    
      await handleSubmit(e,true);
      router.push("/facture/provision");
      // Proceed with form submission logic
      // router.push('/facture'); // Uncomment this line if navigation is needed
    
  }

  // Update form data
  
};


  return (
    <div className=" overlay p-4 max-w-6xl mx-auto bg-gray-100 border border-gray-300 rounded-lg m-12">
      
      
      
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Saisie Provision</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              <td className="py-1 px-2 border-b text-gray-700">{file.fileName ||file.name }</td>
              <td className="py-1 px-2 border-b">
                <button
                type='button'
                  onClick={() => downloadFile(file)}
                  className="bg-purple-800 text-white hover:bg-purple-700 py-1 px-3 rounded-md mr-2"
                >
                  View
                </button>
                <button
                 onClick={() => handleFileRemove(file.name, file.id)}
                  className="bg-red-500 text-white hover:bg-red-600 py-1 px-3 rounded-md"
                  disabled = {isReadOnly}
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
      <label htmlFor="type_facture" className="block text-gray-800 font-semibold mb-1">Type de Provision</label>
      <select
        id="type_facture"
        name="type_facture"
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
      min={formData.date_pro}
      onChange={handleChange}
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
                    name="montantU"
                    value={row.montantU||'0'}
                    onChange={(e) => handleTableChange(index, e)}
                    className="w-full border p-1 rounded"
                    
                  />
                </td>
                <td className="border  py-2">
                  <input
                    type="number"
                    name="qte"
                    value={row.qte||'0'}
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
                    disabled={isReadOnly}
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
        {!isReadOnly && (
  <>
    <button
      type="button"
      onClick={handleAddRow}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
    >
      Ajouter une ligne
    </button>
    <button
      type="submit"
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4 ml-4"
    >
      Modifier et Enregistrer
    </button>
    
          <button
          type="button"
          onClick={handleValidation}
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mt-4"
        >
          valider
        </button>
        
  </>
)}

      </form>
    </div>
  );
}