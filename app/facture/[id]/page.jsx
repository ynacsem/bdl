'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { handleEdit } from '@/utils/handleEdit';
import { handleModifier } from '@/utils/handlePut';
import { fetchLign } from '@/utils/fetch';
import { handleDownloadFiles } from '@/utils/handleDownloadFiles';
import { fetchFiles } from '@/utils/fetchFiles';

import { useSession } from 'next-auth/react';
import {uploadFiles} from '@/utils/fileupload';
import { fetchBudgetDetails } from '@/utils/fetch';
export default function ModifierFacture({params}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lib,setLib] = useState([])
  const [files, setFiles] = useState([]);   
  const [suppliers, setSuppliers] = useState([]);
  const [struct, setStruct] = useState([]);
  const [previleges, setPrevileges] = useState(null);
  const [isReadOnly,setIsReadonly] = useState(false);
  const [struDestID, setStruDestID] = useState(null);
  
  const [formData, setFormData] = useState({
    intitule: '',
    id_fournisseur: '',
    reference_facture: '',
    etat: '',
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
    num_cheq:'',
    BAC :0,
    BAP :0,
    BAPT :0

     // New field for current date
  });

  const [tableData, setTableData] = useState([
    {
      codeOperation: '',
      libelle: '',
      compte: '',
      codeTVA: '',
      nature: '',
      montantUnitaireHT: 0,
      quantite: 0,
      montantTotal: 0
    }
  ]);
  
  const [formError, setFormError] = useState('');
  const [tableError, setTableError] = useState('');

  const handleChange = async(e) => {
    
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files });
    } else {
      
      const newValue = name === 'frs_id' ? parseInt(value, 10) : value;
      
      setFormData({ ...formData, [name]: newValue });
    }
  };
  
  useEffect(() => {
    // Select all input elements and set their className to 'bg-gray-400'
    if (isReadOnly) {
      document.querySelectorAll('input').forEach(input => {
        input.classList.add('bg-gray-300');
        input.classList.remove('bg-white');
    });
    document.querySelectorAll('select').forEach(input => {
      input.classList.add('bg-gray-300');
      input.classList.remove('bg-white');
  })
  
   document.querySelectorAll('textarea').forEach(input => {
    input.classList.add('bg-gray-300');
    input.classList.remove('bg-white');
   })
  
    }
    
  }, [isReadOnly,formData]);


  const handleTableChange = async (index, e) => {
    const { name, value } = e.target;
    const newTableData = [...tableData];
    newTableData[index] = { ...newTableData[index], [name]: value };

    if (name === 'montantU' || name === 'qte') {
      newTableData[index].montantTotal = (parseFloat(newTableData[index].montantU || 0) * parseFloat(newTableData[index].qte|| 0)).toFixed(2);
     
    }
    if(name ==='libelle'){
      const data = await fetchLign(value,false,true);
      
      const newData = data.results[0];
      newTableData[index] = {...newTableData[index], codeOperation: newData.cod_op,  nature: newData.type,compte:newData.compte};
    }
     setTableData(newTableData);
     setFormData({...formData,montant:calculateTotal(newTableData)})
   };
  

  const handleAddRow = () => {
    // Update tableData state and calculate the new total amount
    setTableData(prevTableData => {
      // Create the new table data with the added row
      const newTableData = [
        ...prevTableData,
        {
          codeOperation: '',
          libelle: '',
          compte: '',
          codeTVA: '',
          nature: '',
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
    
      // Check if state has updated
      //here we work on our budget thing 
        await handleSubmit(e,true);
        // Proceed with form submission logic
        // router.push('/facture'); // Uncomment this line if navigation is needed
      
    }
  
    // Update form data
    
  };
  
  

  const handleSubmit = async (e, validate) => {
    validate = validate || false;
    
    let isValid = true; // Flag to track if validation passes
  
    if (validate) {
      if (validerText === 'Valider BAC') {
        // Loop through all lines of the table
        for (let i=0 ; i < tableData.length; i++) {
          // Get the IDs based on the current line's libelle and formData's stru_dest
          const line = tableData[i];
          const IDlin = await getLigneID(line.libelle);
          const IDStru = await getStruDestID(formData.stru_dest);
          console.log('id structure', IDStru);
          
          // Fetch budget details for the current IDlin and IDStru
          const budget = await fetchBudgetDetails(IDlin, IDStru);
          
          // Check if the budget details were not found
          if (!budget || budget.length === 0) {
            alert(`La structure ${formData.stru_dest} n'a pas de demande pour la ligne ${line.libelle}`);
            isValid = false;
            break; // Stop the loop but don't exit the function
          }
          let mnt_tot = line.montantTotal;
          for (let j=i+1; j < tableData.length; j++) {
              if(tableData[j].libelle === line.libelle){
                mnt_tot += tableData[j].montantTotal;
              }
          }
      
          // Calculate the remaining budget after considering the current form data
          const remainingBudget = (
            parseInt(budget.mnt_budg) - 
            parseInt(budget.mnt_eng) - 
            parseInt(budget.mnt_real)-
            parseInt(budget.mnt_prov)
          ).toFixed(2);

      
          // If the remaining budget is less than the requested amount, alert and stop the process
          if (parseInt(remainingBudget) < parseInt(mnt_tot)) {
            alert(`Le montant restant dans cette demande entre la structure ${formData.stru_dest} et la ligne ${line.libelle} est insuffisant pour couvrir le montant demandé.`);
            isValid = false;
            break; // Stop the loop but don't exit the function
          }
        }
      }else{
        if (validerText === 'Valider BAPT') {
          for (const line of tableData) {
            const IDlin = await getLigneID(line.libelle);
            const IDStru = await getStruDestID(formData.stru_dest);
            const budget = await fetchBudgetDetails(IDlin, IDStru);//budget ='mnt_budg,mnt_eng,mnt_real,IDligndem'
            const mnt_real = ((parseInt(budget.mnt_real) + parseInt(line.montantTotal)).toFixed(2)).toString();
          try {
            const resp = await fetch('/api/updatedata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    table: 'ligndembudget',
                    idField: 'IDligndem',
                    id: budget.IDligndem,
                    data: {
                        mnt_real,
                    },
                }),
            });

            const res = await resp.json();

            if (!resp.ok) {
                throw new Error(res.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error submitting budget data:', error);
        }
          }
        }
      }
  
      // If validation failed, stop further processing
      if (!isValid) {
        return; // Exit the function to prevent further processing
      }
      
      await handleModifier(e, formData, params.id, tableData, setFormError, router, true, validerText);
    } else {
      await handleModifier(e, formData, params.id, tableData, setFormError, router, false, validerText);
    }
  
    const filesWithoutId = files.filter(file => !file.id); // Filter out files that do have an id
    if (filesWithoutId.length > 0) {
      const apiUrl = 'http://localhost:3000/api/uploadfile';
      await uploadFiles(apiUrl, params.id, null, null, filesWithoutId);
    }
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
    fetchSuppliers();
  }, []);

  
  const [searchQuery, setSearchQuery] = useState('');
useEffect(() => {
     setSearchQuery(params.id);
    handleEdit(params.id, setFormData, setTableData);
   
    
  



},[params.id,session])
useEffect(() => {
  if(session){
    if (
      session?.user?.previlege?.VALIDATION_FACTURE == 0 && 
      session?.user?.previlege?.MODIFICATION_FACTURE == 0 && 
      session?.user?.previlege?.VALIDATION_BAC == 0 && 
      session?.user?.previlege?.VALIDATION_BAP == 0 && 
      session?.user?.previlege?.VALIDATION_BAPT == 0
  ) {
    router.push('/facture')
  }
  }
  

  if (formData.etat === 2 || session?.user?.previleges?.MODIFICATION_FACTURE === 0 || formData.BAC === 1) {
    setIsReadonly(true);
  }

  console.log('hehe:', formData);
  
  if (formData.BAC !== 1) {
    console.log(formData.BAC);
    setValiderText('Valider BAC');
  } else if (session?.user?.previleges?.VALIDATION_BAP && formData.BAP !== 3 && formData.BAC === 1) {
    if (formData.BAP === 0 && session?.user?.ID_struct_fk === struDestID) {
      setValiderText('Valider BAP NIV1(directeur de la structure)');
    } else if (formData.BAP === 1 && session?.user?.ID_struct_fk === 24 && struDestID) {
      setValiderText('Valider BAP NIV2(directeur de règlement)');
    } else if (formData.BAP === 2 && session?.user?.ID_struct_fk === 81 && struDestID) {
      setValiderText('Valider BAP NIV3(conseil administratif)');
    }
  } else if (session?.user?.previleges?.VALIDATION_BAPT && formData.BAPT !== 1 && formData.BAP === 3) {
    setValiderText('Valider BAPT');
  }else{
    setValiderText('');
  }
}, [formData, session, struDestID]);


const getStruDestID = async (stru_dest) => {
  const table = 'structure';
  const fields = 'IDstruct';
  const filters = `libelle='${stru_dest}'`;
  const query = new URLSearchParams({ table, fields, filters }).toString();
  const url = `/api/getdata?${query}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result)
    console.log('hehe',result.results[0]?.IDstruct);
    return result.results[0]?.IDstruct;
  } catch (error) {

    console.error('Error fetching data:', error);
  }
};
const getLigneID = async (ligne) => {
  const table = 'lignbbudget';
  const fields = 'IDlign';
  const filters = `libelle='${ligne}'`;
  const query = new URLSearchParams({ table, fields, filters }).toString();
  const url = `/api/getdata?${query}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log('id',result)
    return result.results[0]?.IDlign;
  } catch (error) {
    console.error('Error fetching ligne id:', error);
  }
};
useEffect(() => {
  if (formData.stru_dest) {
    console.log(formData.stru_dest)
    getStruDestID(formData.stru_dest).then((id) => {
      setStruDestID(id);
    });
    console.log(struDestID  )
  }

}, [formData.stru_dest]);
const [validerText,setValiderText] = useState('')
// useEffect(() => {
//   if ((formData.etat === 2) || (session?.user?.previleges?.MODIFICATION_FACTURE === 0)) {
//     setIsReadonly(true);

//   }
//   if (session?.user?.previleges?.VALIDATION_BAC && formData.BAC !== 1) {
    
// console.log(formData.BAC)
//     setValiderText('Valider BAC');
// } else if (session?.user?.previleges?.VALIDATION_BAP && formData.BAP !== 3 && formData.BAC === 1) {
//     if (formData.BAP === 0 && session?.user?.IDstruct_fk === struDestID) {
//         setValiderText('Valider BAP NIV1(directeurde la structure)');
//     } else if (formData.BAP === 1 && session?.user?.IDstruct_fk === 24 && struDestID ) {
//         setValiderText('Valider BAP NIV2(directeur de reglement)');
//     } else if (formData.BAP === 2 && session?.user?.IDstruct_fk === 81 && struDestID ) {
//         setValiderText('Valider BAP NIV3(conseil administraftif)');
//     }
// } else if (session?.user?.previleges?.VALIDATION_BAPT && formData.BAPT !== 1 && formData.BAP === 3) {
//     setValiderText('Valider BAPT');
// }
// console.log(validerText)
// console.log(formData.BAC)

// },[formData,session?.user?.previleges?.MODIFICATION_FACTURE,session?.user?.previleges?.VALIDATION_BAC,session?.user?.previleges?.VALIDATION_BAP,session?.user?.previleges?.VALIDATION_BAPT])
     // Update search query on input change
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
    }, []);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetchLign('','',false);
          setLib(res.results);
          await fetchSuppliers(); // Assuming fetchSuppliers is async and should be awaited
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        try {
          const res = await fetchFiles(params.id);
          setFiles(res);
        } catch (error) {
          
        }
      };
    
      fetchData();
    }, [params.id]);
    
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
useEffect(() => {
  if (status === 'authenticated') {
    setPrevileges(session?.user?.previleges || {});
  }
}, [status, session])
if (status === 'loading') {
  return <div>Loading...</div>; // Display a loading state while the session is being fetched
}
  

  return (
    <div className=" overlay p-4 max-w-6xl mx-auto bg-gray-100 border border-gray-300 rounded-lg mt-8">
      <>
  <h1 className="text-2xl font-bold mb-4 text-purple-800">Modifier une facture</h1>
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
          value={formData.intitule}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
          readOnly={isReadOnly}
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
            className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
            disabled={isReadOnly}
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
            className={`bg-purple-800 text-white rounded-md px-3 py-1 text-center ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'hover:bg-purple-700'}`}
          >
            Ajouter un fournisseur
          </Link>
        </div>
      </div>
      <div>
        <label htmlFor="reference_facture" className="block text-gray-800 font-semibold mb-1">Référence</label>
        <input
          type="text"
          id="reference_facture"
          name="reference_facture"
          value={formData.reference_facture}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-gray-800 font-semibold mb-1">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-gray-400 text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
          readOnly={isReadOnly}
          disabled
        />
      </div>

      <div>
        <label htmlFor="observations" className="block text-gray-800 font-semibold mb-1">Pièces justificatives</label>
        <textarea
          id="observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-blackcursor-not-allowed' : ''}`}
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
                  className={`bg-purple-800 text-white hover:bg-purple-700 py-1 px-2 rounded-md ${isReadOnly ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isReadOnly}
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
                      className={`bg-purple-800 text-white hover:bg-purple-700 py-1 px-3 rounded-md mr-2 `}
                      //disabled={isReadOnly}
                    >
                      View
                    </button>
                    <button
                    type='button'
                      onClick={() => handleFileRemove(file.name, file.id)}
                      className={`bg-red-500 text-white hover:bg-red-600 py-1 px-3 rounded-md ${isReadOnly ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={isReadOnly}
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

    <div>
      <label htmlFor="type_facture" className="block text-gray-800 font-semibold mb-1">Type de Facture</label>
      <select
        id="type_facture"
        name="type_facture"
        value={formData.type_facture}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        disabled={isReadOnly}
      >
        <option value={0} disabled>Sélectionner un type</option>
        <option value={1}>Facture Fournisseur</option>
        <option value={2}>Facture Salarié</option>
        <option value={3}>Facture Client</option>
      </select>
    </div>

    <div>
      <label htmlFor="type_saisie" className="block text-gray-800 font-semibold mb-1">Type de Saisie</label>
      <select
        id="type_saisie"
        name="type_saisie"
        value={formData.type_saisie}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        disabled={isReadOnly}
      >
        <option value="" disabled>Sélectionner un type</option>
        <option value={1}>Facture</option>
        <option value={2}>Facture Non Comptable</option>
        <option value={4}>Avoir</option>
        <option value={5}>Avoir Non Comptable</option>
      </select>
    </div>

    <div>
      <label htmlFor="stru_ord" className="block text-gray-800 font-semibold mb-1">Structure Ordonnatrice</label>
      <select
        id="stru_ord"
        name="stru_ord"
        value={formData.stru_ord}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        disabled={isReadOnly}
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
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        disabled={isReadOnly}
      >
        <option value="" disabled>Sélectionner une structure</option>
        {struct.map((s, index) => (
          <option key={index} value={s.libelle}>{s.libelle}</option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="mod_reg" className="block text-gray-800 font-semibold mb-1">Mode de Règlement</label>
      <select
        id="mod_reg"
        name="mod_reg"
        value={formData.mod_reg}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        disabled={isReadOnly}
      >
        <option value="" disabled>Sélectionner un mode</option>
        <option value="cheque">Chèque</option>
        <option value="virement">Virement</option>
        <option value="espece">Espèce</option>
      </select>
    </div>

    {formData.mod_reg === 'cheque' && (
      <div>
        <label htmlFor="num_cheq" className="block text-gray-800 font-semibold mb-1">Numéro de Chèque</label>
        <input
          type="text"
          id="num_cheq"
          name="num_cheq"
          value={formData.num_cheq}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
          readOnly={isReadOnly}
        />
      </div>
    )}

    {formData.mod_reg === 'virement' && (
      <div>
        <label htmlFor="rip" className="block text-gray-800 font-semibold mb-1">RIP</label>
        <input
          type="text"
          id="rip"
          name="rip"
          value={formData.rip}
          onChange={handleChange}
          className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
          readOnly={isReadOnly}
        />
      </div>
    )}

    <div>
      <label htmlFor="montant" className="block text-gray-800 font-semibold mb-1">Montant</label>
      <input
        type="number"
        id="montant"
        name="montant"
        value={formData.montant}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        readOnly
      />
    </div>

    <div>
      <label htmlFor="date_facture" className="block text-gray-800 font-semibold mb-1">Date Facture</label>
      <input
        type="date"
        id="date_facture"
        name="date_facture"
        value={formData.date_facture}
        onChange={handleChange}
        className={`w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800 ${isReadOnly ? 'bg-gray-400 text-black cursor-not-allowed' : ''}`}
        readOnly={isReadOnly}
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
        <td className="border py-2">
          <input
            type="text"
            name="codeOperation"
            value={row.codeOperation || ''}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <select
            name="libelle"
            value={row.libelle || ''}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            disabled={isReadOnly}
          >
            <option value="" disabled>Sélectionner un libellé</option>
            {lib.map((libelle) => (
              <option key={libelle.libelle} value={libelle.libelle}>
                {libelle.libelle}
              </option>
            ))}
          </select>
        </td>
        <td className="border py-2">
          <input
            type="text"
            name="compte"
            value={row.compte || ''}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <input
            type="text"
            name="codeTVA"
            value={row.codeTVA || ''}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <input
            type="text"
            name="nature"
            value={row.nature || ''}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <input
            type="number"
            name="montantU"
            value={row.montantU || 0}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <input
            type="number"
            name="qte"
            value={row.qte || 0}
            onChange={(e) => handleTableChange(index, e)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
        </td>
        <td className="border py-2">
          <input
            type="text"
            name="montantTotal"
            value={(parseFloat(row.montantU || 0) * parseFloat(row.qte || 0)).toFixed(2)}
            className={`w-full border p-1 rounded ${isReadOnly ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
            readOnly
          />
        </td>
        <td className="border py-2">
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => handleDeleteRow(index)}
              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          )}
        </td>
      </tr>
    ))}
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
    </>
)}
    {(validerText &&(formData.type_saisie != "2" && formData.type_saisie != "5" && formData.etat != "2") ) && (
          <button
          type="button"
          onClick={handleValidation}
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mt-4"
        >
          {validerText}
        </button>
        )}
  
        
        
        
        
        
      </form>
      </>
    </div>
  )
  }
