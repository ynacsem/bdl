'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleSubmit } from '@/utils/acompte/handleSubmit';

export default function SaisieAcompte({ formData, onChange }) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [gest, setGest] = useState([]);
  const [showSecondPart, setShowSecondPart] = useState(false); // Control display of the second part
  const [formData1, setFormData1] = useState({
    type_facture: '',
    id_fournisseur: '',
    id_fact: '',
    stru_ord: '',
    stru_dest: '',
    libelle_acompte: '',
    date: new Date().toISOString().split('T')[0],
    numacmpt: '',
    montant: '',
    observations: '',
    dateacmpt: '',
    gest: '',
  });

  const handleChange = async(e) => {
    const { name, value } = e.target;
    await setFormData1({ ...formData1, [name]: value });
    onChange({ ...formData1, [name]: value });
  };
  

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saisie Acompte</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          {/* First Part */}
          <div>
            <label htmlFor="type_facture" className="block">Type de Facture</label>
            <select
              id="type_facture"
              name="type_facture"
              value={formData.type_facture}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner un type</option>
              <option value="fournisseur">Fournisseur</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label htmlFor="stru_ord" className="block">Structure Ordonnatrice</label>
            <input
              type="text"
              id="stru_ord"
              name="stru_ord"
              value={formData.stru_ord}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="stru_dest" className="block">Structure Destinataire</label>
            <input
              type="text"
              id="stru_dest"
              name="stru_dest"
              value={formData.stru_dest||''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="libelle_acompte" className="block">Libellé d'Acompte</label>
            <input
              type="text"
              id="libelle_acompte"
              name="libelle_acompte"
              value={formData.libelle_acompte||''}
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
              value={formData.montant||''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="id_fournisseur" className="block">Fournisseur</label>
            <select
              id="id_fournisseur"
              name="id_fournisseur"
              value={formData.id_fournisseur||''}
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
              value={formData.id_fact||''}
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
              value={formData.date}
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
              value={formData.numacmpt}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="observations" className="block">Observations</label>
            <textarea
              id="observations"
              name="observations"
              value={formData.observations}
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
              value={formData.dateacmpt}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="gest" className="block">Gestionnaire</label>
            <select
              id="gest"
              name="gest"
              value={formData.gest}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>Sélectionner un gestionnaire</option>
              {gest.map((g, index) => (
                <option key={index} value={g.IDgest}>
                  {g.Name}
                </option>
              ))}
            </select>
          </div>
              
        </div>
          
      </div>
    </div>
  );
}
