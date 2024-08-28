'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleSubmit } from '@/utils/handleSubmit';
 // Implement this function to fetch acompte data

export default function SaisieRemboursement({ formData, onChange,isReadOnly }) {
  const router = useRouter();
  isReadOnly = isReadOnly || false;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Met à jour les données du formulaire avec la nouvelle valeur
    const updatedFormData = { ...formData, [name]: value };
  
    // Vérifie si le champ modifié est 'date_forcage_remboursement'
    
  
    // Appelle le gestionnaire onChange du parent avec les données mises à jour
    onChange(updatedFormData);
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

  

 

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e, formData, router);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-100 border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Saisie Remboursement</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <label htmlFor="gestionnaire_bap" className="block text-gray-800 font-semibold mb-1">Gestionnaire BAP</label>
            <input
              type="text"
              id="gestionnaire_bap"
              name="gestionnaire_bap"
              value={formData.gestionnaire_bap || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="solde_a_encaisser" className="block text-gray-800 font-semibold mb-1">Solde à Encaisser</label>
            <input
              type="text"
              id="solde_a_encaisser"
              name="solde_a_encaisser"
              value={formData.solde_a_encaisser || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="date_valuer" className="block text-gray-800 font-semibold mb-1">Date de Valeur</label>
            <input
              type="date"
              id="date_valuer"
              name="date_valuer"
              value={formData.date_valuer || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="date_forcage_remboursement" className="block text-gray-800 font-semibold mb-1">Date de Forçage Remboursement</label>
            <input
              type="date"
              id="date_forcage_remboursement"
              name="date_forcage_remboursement"
              value={formData.date_forcage_remboursement || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="date_encaissement" className="block text-gray-800 font-semibold mb-1">Date d'Encaissement</label>
            <input
              type="date"
              id="date_encaissement"
              name="date_encaissement"
              value={formData.date_encaissement || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div>
            <label htmlFor="ref_pointage" className="block text-gray-800 font-semibold mb-1">Référence de Pointage</label>
            <input
              type="text"
              id="ref_pointage"
              name="ref_pointage"
              value={formData.ref_pointage || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="ref_a_rappeler" className="block text-gray-800 font-semibold mb-1">Référence à Rappeler</label>
            <input
              type="text"
              id="ref_a_rappeler"
              name="ref_a_rappeler"
              value={formData.ref_a_rappeler || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label htmlFor="mode_encaisement" className="block text-gray-800 font-semibold mb-1">Mode d'Encaissement</label>
            <select
              id="mode_encaisement"
              name="mode_encaisement"
              value={formData.mode_encaisement || ''}
              onChange={handleChange}
              className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
              readOnly={isReadOnly}
            >
              <option value="" disabled>Sélectionner un mode</option>
              <option value="cheque">Chèque</option>
              <option value="espece">Espèce</option>
              <option value="virement">Virement</option>
            </select>
          </div>
          {formData.mode_encaisement === 'cheque' && (
            <div>
              <label htmlFor="numero" className="block text-gray-800 font-semibold mb-1">Numéro de Chèque</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero || ''}
                onChange={handleChange}
                className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
                readOnly={isReadOnly}
              />
            </div>
          )}
          {formData.mode_encaisement === 'virement' && (
            <div>
              <label htmlFor="compte" className="block text-gray-800 font-semibold mb-1">Numéro Compte</label>
              <input
                type="text"
                id="compte"
                name="compte"
                value={formData.compte || ''}
                onChange={handleChange}
                className="w-full border border-purple-800 p-2 rounded-md bg-white text-gray-800"
                readOnly={isReadOnly}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  
  );
}
