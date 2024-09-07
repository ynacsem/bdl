'use client';
import React, { useState } from 'react';
import SaisieAcompte from '@/components/Acomptetet'; // Adjust import path as needed
import SaisieRemboursement from '@/components/Remboursement'; // Adjust import path as needed // Adjust import path as needed
import { useRouter } from 'next/navigation';
import { handleSearch } from '@/utils/acompte/handleSearch';
import { useEffect } from 'react';
import { handleModifier } from '@/utils/acompte/handleModifier';
import { useSession } from 'next-auth/react';
import {uploadFiles} from '@/utils/fileupload';
import{factureEtat} from '@/utils/backend'

export default function Acompte({params}) {
  const { data: session, status } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    
  const [isReadOnly,setIsReadonly] = useState(false);
    
  const [previleges, setPrevileges] = useState(null);
    const [files,setFiles] = useState([]);
  let [formDataAcompte, setFormDataAcompte] = useState({
    // Initial state for SaisieAcompte
  });
  let [formDataRemboursement, setFormDataRemboursement] = useState({
    // Initial state for SaisieRemboursement
  });

  // Function to handle changes for SaisieAcompte
  const handleAcompteChange = (data) => {
    setFormDataAcompte(data);
  };

  // Function to handle changes for SaisieRemboursement
  const handleRemboursementChange = (data) => {
    setFormDataRemboursement(data);
  };
  useEffect(() => {
    if (status === 'authenticated') {
      setPrevileges(session?.user?.previleges || {});
      if(session){
        if (
          session?.user?.previlege?.VALIDATION_ACOMPTE == 0 && 
          session?.user?.previlege?.MODIFICATION_ACOMPTE == 0 
      ) {
        router.push('/facture')
      }
      }
    }
  }, [status, session])
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

  // Function to handle the submission of both forms
  const handleSubmit = async (e,validate) => {
    e.preventDefault();
    let montant1 = parseFloat(formDataAcompte.montant).toFixed(2);
    montant1 = parseFloat(montant1);

  
    try {
      // Convert formDataAcompte according to table schema
      const convertedFormDataAcompte = {
        id : formDataAcompte.id,
        type_facture: parseInt(formDataAcompte.type_facture,10), // Convert to integer
        id_fournisseur: parseInt(formDataAcompte.id_fournisseur, 10)||1, // Convert to integer
        stru_ord: formDataAcompte.stru_ord,
        stru_dest: formDataAcompte.stru_dest,
        libelle_acompte: formDataAcompte.libelle_acompte,
        date: new Date().toISOString().split('T')[0],
        montant: montant1, // Convert to decimal
        dateacmpt: formDataAcompte.dateacmpt, // Ensure date is in YYYY-MM-DD format
        gest: session?.user.username,
        date_echeance: formDataAcompte.date_echeance, 
         // Ensure date is in YYYY-MM-DD format
         date_encaissement: formDataAcompte.date_encaissement// Ensure date is in YYYY-MM-DD format
      };
      console.log(convertedFormDataAcompte)
  
      // Submit SaisieAcompte form
      let acompteId = params.id;
      // Update formDataRemboursement with the new id_acompte
      setFormDataRemboursement({ ...formDataRemboursement, id_acompte: acompteId });
      console.log(formDataRemboursement)
      let idRemboursement = formDataRemboursement.id
      console.log('id remb',idRemboursement)
      // Convert formDataRemboursement according to its schema (similar to `formDataAcompte`)
      const convertedFormDataRemboursement = {
        id : idRemboursement,
        id_acompte: parseInt(acompteId,10), // Use the ID from the acompte submission
        gestionnaire_bap: session?.user?.username,
        solde_a_encaisser: formDataRemboursement.solde_a_encaisser,
         // Ensure date is in YYYY-MM-DD format
        date_valuer: formDataRemboursement.date_valuer, // Ensure date is in YYYY-MM-DD format
        date_forcage_remboursement: formDataRemboursement.date_forcage_remboursement, // Ensure date is in YYYY-MM-DD format
        num_cheque: formDataRemboursement.num_cheque||'0',
        ref_pointage: formDataRemboursement.ref_pointage,
        ref_a_rappeler: formDataRemboursement.ref_a_rappeler,
        mode_encaisement: formDataRemboursement.mode_encaisement,
        numero: formDataRemboursement.numero||'0',
        compte: formDataRemboursement.compte||'0',
        date_encaissement: formDataRemboursement.date_encaissement
      };
      console.log(convertedFormDataRemboursement)
      const filesWithoutId = files.filter(file => !file.id); // Filter out files that do have an id
  
      console.log(filesWithoutId);
      const apiUrl = 'http://localhost:3000/api/uploadfile';
      console.log(filesWithoutId)
      if (filesWithoutId.length > 0) {
          
      await uploadFiles(apiUrl, null, params.id,null, filesWithoutId);
      }
  
      // Submit SaisieRemboursement form
      if (validate){
        await handleModifier(e, convertedFormDataAcompte,convertedFormDataRemboursement, router,true);
      }else{
        await handleModifier(e, convertedFormDataAcompte,convertedFormDataRemboursement, router,false);
      }

      
  
      console.log('Both forms submitted successfully');
      router.push('/facture'); // Redirect to /facture
    } catch (error) {
      console.error('Error submitting forms:', error);
    }
  };
  useEffect(() => {
    setSearchQuery(params.id);
   handleSearch(params.id, setFormDataAcompte, setFormDataRemboursement,setFiles);

},[params.id])
useEffect(() => {
  if (formDataAcompte.etat === 2 ||session?.user?.previleges?.MODIFICATION_ACOMPTE!==1 ) {
    setIsReadonly(true);
  }
},[formDataAcompte])
const handleFileSelect = (e) => {
  const selectedFiles = Array.from(e.target.files);
  setFiles((prevFiles) => {
    const fileMap = new Map(prevFiles.map((file) => [file.name, file]));
    selectedFiles.forEach((file) => fileMap.set(file.name, file));
    return Array.from(fileMap.values());
  });
  e.target.value = ''; // Reset file input value to allow re-selection of the same file
};

// Handle file removal
const handleFileRemove = async (fileName, id) => {
  if (id) {
    const table = 'files';
    await fetch('/api/deletedata', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, table }),
    });
  }
  setFiles((prevFiles) =>
    prevFiles.filter((file) => file.name !== fileName)
  );
};

// Handle file download
const downloadFile = (file) => {
  if (file.fileName) {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }}
  const handleValidation = async (e) => {
    e.preventDefault();
  
    // Your validation logic
    let emptyFormFields = [];
    for (const [key, value] of Object.entries(formDataAcompte)) {
      if (value === '') {
        emptyFormFields.push(key);
      }
    }
    if (emptyFormFields.length > 0) {
      console.log("Empty form fields:", emptyFormFields);
      alert('Please fill in all the fields in the form.');
      return;
    }
  
    let emptyFormFields2 = [];
    for (const [key, value] of Object.entries(formDataRemboursement)) {
      if (value === '') {
        emptyFormFields.push(key);
      }
    }
    if (emptyFormFields2.length > 0) {
      console.log("Empty form fields:", emptyFormFields2);
      alert('Please fill in all the fields in the form.');
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
      console.log("FormData after state update:", formDataAcompte);
    
      // Check if state has updated
      
        await handleSubmit(e,true);
        router.push("/facture");
        // Proceed with form submission logic
        // router.push('/facture'); // Uncomment this line if navigation is needed
      
    }
  
    // Update form data
    
  };

  return (
    <div className=" overlay p-4 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
      <SaisieAcompte
          formData={formDataAcompte}
          onChange={handleAcompteChange}
          files={files}
          isReadOnly = {isReadOnly}
         handleFileSelect={handleFileSelect}
        handleFileRemove={handleFileRemove}
        downloadFile={downloadFile}

        />
        <SaisieRemboursement
          formData={formDataRemboursement}
          onChange={handleRemboursementChange}
          isReadOnly = {isReadOnly}
        />
         {!isReadOnly && (
        <div className="mt-4 space-y-2">
          <button
            type="submit"
            className="bg-green-500 text-white rounded px-4 py-2"
          >
            Enregistrer
          </button>
          {previleges?.admin && (
            <button
              type="button"
              onClick={handleValidation}
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            >
              Valider
            </button>
          )}
        </div>
      )}
      </form>
    </div>
  );
}
