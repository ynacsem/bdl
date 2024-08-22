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

export default function Acompte({params}) {
  const { data: session, status } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
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

  // Function to handle the submission of both forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    let montant1 = parseFloat(formDataAcompte.montant).toFixed(2);
    montant1 = parseFloat(montant1);

  
    try {
      // Convert formDataAcompte according to table schema
      const convertedFormDataAcompte = {
        id : formDataAcompte.id,
        type_facture: parseInt(formDataAcompte.type_facture,10), // Convert to integer
        id_fournisseur: parseInt(formDataAcompte.id_fournisseur, 10)||1, // Convert to integer
        id_fact: parseInt(formDataAcompte.id_fact, 10), // Convert to integer
        stru_ord: formDataAcompte.stru_ord,
        stru_dest: formDataAcompte.stru_dest,
        libelle_acompte: formDataAcompte.libelle_acompte,
        date: new Date().toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
        numacmpt: formDataAcompte.numacmpt||0,
        montant: montant1, // Convert to decimal
        observations: formDataAcompte.observations||'',
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
        gestionnaire_bap: formDataRemboursement.gestionnaire_bap,
        solde_a_encaisser: formDataRemboursement.solde_a_encaisser,
         // Ensure date is in YYYY-MM-DD format
        date_valuer: formDataRemboursement.date_valuer, // Ensure date is in YYYY-MM-DD format
        date_forcage_remboursement: formDataRemboursement.date_forcage_remboursement, // Ensure date is in YYYY-MM-DD format
        num_cheque: formDataRemboursement.num_cheque,
        ref_pointage: formDataRemboursement.ref_pointage,
        ref_a_rappeler: formDataRemboursement.ref_a_rappeler,
        mode_encaisement: formDataRemboursement.mode_encaisement,
        numero: formDataRemboursement.numero,
        compte: formDataRemboursement.compte,
      };
      console.log(convertedFormDataRemboursement)
      const filesWithoutId = files.filter(file => !file.id); // Filter out files that do have an id
  
      console.log(filesWithoutId);
      const apiUrl = 'http://localhost:3000/api/uploadfile';
      console.log(filesWithoutId)
      await uploadFiles(apiUrl, null, params.id, filesWithoutId);
  
      // Submit SaisieRemboursement form
      await handleModifier(e, convertedFormDataAcompte,convertedFormDataRemboursement, router);
  
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
      <SaisieAcompte
          formData={formDataAcompte}
          onChange={handleAcompteChange}
          files={files}
         handleFileSelect={handleFileSelect}
        handleFileRemove={handleFileRemove}
        downloadFile={downloadFile}

        />
        <SaisieRemboursement
          formData={formDataRemboursement}
          onChange={handleRemboursementChange}
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2 mt-4"
        >
          Enregister
        </button>
      </form>
    </div>
  );
}
