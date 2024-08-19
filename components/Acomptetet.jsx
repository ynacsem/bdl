'use client';
import React, { useState, useEffect } from 'react';

export default function SaisieAcompte({ formData, onChange }) {
  const [suppliers, setSuppliers] = useState([]);
  const [struct, setStruct] = useState([]);

  // Handle field changes in a way that preserves the rest of the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value }; // Copy existing data and update the specific field
    onChange(updatedFormData); // Call the parent's onChange handler with updated data
  };

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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saisie Acompte</h1>
      <div className="space-y-4">
        {/* Form Fields */}
        <div className="space-y-2">
          {/* Other fields */}
          <div>
            <label htmlFor="type_facture" className="block">Type de Facture</label>
            <select
              id="type_facture"
              name="type_facture"
              value={formData.type_facture || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner un type</option>
              <option value={1}>Fournisseur</option>
              <option value={2}>Client</option>
            </select>
          </div>
          <div>
            <label htmlFor="stru_ord" className="block">Structure Ordonnatrice</label>
            <select
              id="stru_ord"
              name="stru_ord"
              value={formData.stru_ord || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner une structure</option>
              {struct.map((s, index) => (
                <option key={index} value={s.libelle}>{s.libelle}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stru_dest" className="block">Structure Destinataire</label>
            <select
              id="stru_dest"
              name="stru_dest"
              value={formData.stru_dest || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner une structure</option>
              {struct.map((s, index) => (
                <option key={index} value={s.libelle}>{s.libelle}</option>
              ))}
            </select>
          </div>
          {/* Additional fields */}
          <div>
            <label htmlFor="libelle_acompte" className="block">Libellé d'Acompte</label>
            <input
              type="text"
              id="libelle_acompte"
              name="libelle_acompte"
              value={formData.libelle_acompte || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="montant" className="block">Le Montant</label>
            <input
              type="number"
              id="montant"
              name="montant"
              value={formData.montant || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="id_fournisseur" className="block">Fournisseur</label>
            <select
              id="id_fournisseur"
              name="id_fournisseur"
              value={formData.id_fournisseur || ''}
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
          </div>
          <div>
            <label htmlFor="id_fact" className="block">Facture</label>
            <input
              type="text"
              id="id_fact"
              name="id_fact"
              value={formData.id_fact || ''}
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
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="numacmpt" className="block">Numéro d'Acompte</label>
            <input
              type="text"
              id="numacmpt"
              name="numacmpt"
              value={formData.numacmpt || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="observations" className="block">Observations</label>
            <textarea
              id="observations"
              name="observations"
              value={formData.observations || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="dateacmpt" className="block">Date d'Acompte</label>
            <input
              type="date"
              id="dateacmpt"
              name="dateacmpt"
              value={formData.dateacmpt || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="gest" className="block">Gestionnaire</label>
            <select
              id="gest"
              name="gest"
              value={formData.gest || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner un gestionnaire</option>
              {/* Populate with actual data when available */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
