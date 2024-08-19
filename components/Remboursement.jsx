'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleSubmit } from '@/utils/handleSubmit';
 // Implement this function to fetch acompte data

export default function SaisieRemboursement({ formData, onChange }) {
  const router = useRouter();
  const [acompteOptions, setAcompteOptions] = useState([]);
  
  const [formData1, setFormData1] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value }; // Copy existing data and update the specific field
    onChange(updatedFormData); // Call the parent's onChange handler with updated data
  };

  

 

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e, formData, router);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saisie Remboursement</h1>
      <div onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* Basic Fields */}
          
          <div>
            <label htmlFor="gestionnaire_bap" className="block">Gestionnaire BAP</label>
            <input
              type="text"
              id="gestionnaire_bap"
              name="gestionnaire_bap"
              value={formData.gestionnaire_bap}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="solde_a_encaisser" className="block">Solde à Encaisser</label>
            <input
              type="text"
              id="solde_a_encaisser"
              name="solde_a_encaisser"
              value={formData.solde_a_encaisser}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="date_echeance" className="block">Date d'Échéance</label>
            <input
              type="date"
              id="date_echeance"
              name="date_echeance"
              value={formData.date_echeance}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="date_valuer" className="block">Date de Valeur</label>
            <input
              type="date"
              id="date_valuer"
              name="date_valuer"
              value={formData.date_valuer}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="date_forcage_remboursement" className="block">Date de Forçage Remboursement</label>
            <input
              type="date"
              id="date_forcage_remboursement"
              name="date_forcage_remboursement"
              value={formData.date_forcage_remboursement}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="date_encaissement" className="block">Date d'Encaissement</label>
            <input
              type="date"
              id="date_encaissement"
              name="date_encaissement"
              value={formData.date_encaissement}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
        </div>

        
          <div className="space-y-2 mt-4">
            {/* Additional Fields */}
            <div>
              <label htmlFor="num_cheque" className="block">Numéro de Chèque</label>
              <input
                type="text"
                id="num_cheque"
                name="num_cheque"
                value={formData.num_cheque}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="ref_pointage" className="block">Référence de Pointage</label>
              <input
                type="text"
                id="ref_pointage"
                name="ref_pointage"
                value={formData.ref_pointage}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="ref_a_rappeler" className="block">Référence à Rappeler</label>
              <input
                type="text"
                id="ref_a_rappeler"
                name="ref_a_rappeler"
                value={formData.ref_a_rappeler}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="mode_encaisement" className="block">Mode d'Encaissement</label>
              <select
                id="mode_encaisement"
                name="mode_encaisement"
                value={formData.mode_encaisement}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>Sélectionner un mode</option>
                <option value="cheque">Chèque</option>
                <option value="espece">Espèce</option>
                <option value="virement">Virement</option>
              </select>
            </div>
            {formData.mode_encaisement === 'cheque' && (
              <div>
                <label htmlFor="numero" className="block">Numéro</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
            {formData.mode_encaisement === 'virement' && (
              <div>
                <label htmlFor="compte" className="block">Compte</label>
                <input
                  type="text"
                  id="compte"
                  name="compte"
                  value={formData.compte}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
            
          </div>
        
      </div>
    </div>
  );
}
