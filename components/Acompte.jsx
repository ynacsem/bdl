'use client';
import React, { useState } from 'react';
import SaisieAcompte from './Acomptetet'; // Adjust import path as needed
import SaisieRemboursement from './Remboursement'; // Adjust import path as needed
import { handleAcompteSubmit, handleRemboursementSubmit } from '@/utils/acompte/handleSubmit'; // Adjust import path as needed
import {useRouter} from 'next/navigation';
import { useSession } from 'next-auth/react';
import {fetchFrsAcompte} from '@/utils/backend';
import {uploadFiles} from '@/utils/fileupload';

export default function Acompte() {
  const { data: session } = useSession();
  const router = useRouter();
  let [formDataAcompte, setFormDataAcompte] = useState({
    //date: new Date().toISOString().split('T')[0],

    // Initial state for SaisieAcompte
  });
  let [formDataRemboursement, setFormDataRemboursement] = useState({
    gestionnaire_bap: '',
    solde_a_encaisser: '',
    date_echeance: '',
    date_valuer: '',
    date_forcage_remboursement: '',
    date_encaissement: '',
    num_cheque: '',
    ref_pointage: '',
    ref_a_rappeler: '',
    mode_encaisement: '',
    numero: '',
    compte: '',
  });

  // Function to handle changes for SaisieAcompte
  const handleAcompteChange = (data) => {
    
    setFormDataAcompte(data);
  };

  // Function to handle changes for SaisieRemboursement
  const handleRemboursementChange = (data) => {
    setFormDataRemboursement(data);
  };
  const [files, setFiles] = useState([]);

  // Handle file selection
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
    }
  };

  // Function to handle the submission of both forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    let montant1 = parseFloat(formDataAcompte.montant).toFixed(2);
    montant1 = parseFloat(montant1);

  
    try {
      // Convert formDataAcompte according to table schema
      const convertedFormDataAcompte = {
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
      let acompteId = await handleAcompteSubmit(convertedFormDataAcompte);
      alert(`Acompte ${acompteId} created successfully!`);
      console.log(files)
    
    

      const apiUrl = 'http://localhost:3000/api/uploadfile'; // Replace with your API endpoint

        try {
            const result = await uploadFiles(apiUrl, null,acompteId, files);
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Upload failed:', error);
        }
      // Update formDataRemboursement with the new id_acompte
      setFormDataRemboursement({ ...formDataRemboursement, id_acompte: acompteId });
      console.log(formDataRemboursement)
  
      // Convert formDataRemboursement according to its schema (similar to `formDataAcompte`)
      const convertedFormDataRemboursement = {
        id_acompte: acompteId, // Use the ID from the acompte submission
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
      // Submit SaisieRemboursement form
      await handleRemboursementSubmit(convertedFormDataRemboursement);
  
      console.log('Both forms submitted successfully');

      router.push('/facture');
    } catch (error) {
      console.error('Error submitting forms:', error);
    }
  };
  

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
          Enregistrer
        </button>
      </form>
    </div>
  );
}
