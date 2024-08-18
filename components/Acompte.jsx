'use client';
import React, { useState } from 'react';
import SaisieAcompte from './Acomptetet'; // Adjust import path as needed
import SaisieRemboursement from './Remboursement'; // Adjust import path as needed
import { handleAcompteSubmit, handleRemboursementSubmit } from '@/utils/acompte/handleSubmit'; // Adjust import path as needed

export default function Acompte() {
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
  
    try {
      // Convert formDataAcompte according to table schema
      const convertedFormDataAcompte = {
        type_facture: 3, // Convert to integer
        id_fournisseur: parseInt(formDataAcompte.id_fournisseur, 10), // Convert to integer
        id_fact: parseInt(formDataAcompte.id_fact, 10), // Convert to integer
        stru_ord: formDataAcompte.stru_ord,
        stru_dest: formDataAcompte.stru_dest,
        libelle_acompte: formDataAcompte.libelle_acompte,
        date: formDataAcompte.date, // Ensure date is in YYYY-MM-DD format
        numacmpt: formDataAcompte.numacmpt,
        montant: parseFloat(formDataAcompte.montant).toFixed(2), // Convert to decimal
        observations: formDataAcompte.observations,
        dateacmpt: formDataAcompte.dateacmpt, // Ensure date is in YYYY-MM-DD format
        gest: formDataAcompte.gest,
      };
      console.log(convertedFormDataAcompte)
  
      // Submit SaisieAcompte form
      let id_acompte = await handleAcompteSubmit(convertedFormDataAcompte);
      console.log(id_acompte)
      // Update formDataRemboursement with the new id_acompte
      setFormDataRemboursement({ ...formDataRemboursement, id_acompte: id_acompte });
      console.log(formDataRemboursement)
  
      // Convert formDataRemboursement according to its schema (similar to `formDataAcompte`)
      const convertedFormDataRemboursement = {
        id_acompte: id_acompte, // Use the ID from the acompte submission
        gestionnaire_bap: formDataRemboursement.gestionnaire_bap,
        solde_a_encaisser: formDataRemboursement.solde_a_encaisser,
        date_echeance: formDataRemboursement.date_echeance, // Ensure date is in YYYY-MM-DD format
        date_valuer: formDataRemboursement.date_valuer, // Ensure date is in YYYY-MM-DD format
        date_forcage_remboursement: formDataRemboursement.date_forcage_remboursement, // Ensure date is in YYYY-MM-DD format
        date_encaissement: formDataRemboursement.date_encaissement, // Ensure date is in YYYY-MM-DD format
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
        />
        <SaisieRemboursement
          formData={formDataRemboursement}
          onChange={handleRemboursementChange}
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2 mt-4"
        >
          Enregistrer1
        </button>
      </form>
    </div>
  );
}
