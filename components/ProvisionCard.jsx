'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { calculateRest } from '@/utils/provision/calculateRest';

const AcompteCard = ({ provision }) => {
  const [montantRestant, setMontantRestant] = useState(0);
  const { data: session } = useSession();
  let { id, type, date, montant, gest, intitule, ref,extourne ,etat} = provision;

  if (!montant) {
    montant = 0;
  }

  // Function to determine the label for type_facture
  const getTypeFactureLabel = (type) => {
    switch(type) {
      case 1:
        return 'Fournisseur';
      case 2:
        return 'Salariés';
      case 3:
        return 'Clients';
      default:
        return 'Non Spécifié';
    }
  };

  async function calc() { // Example ID
    try {
      let montant_restant = await calculateRest(id);
      console.log('Montant restant:', montant_restant);
      setMontantRestant(montant_restant);
    } catch (error) {
      console.error('Error calculating montant restant:', error);
    }
  }

  useEffect(() => {
    calc();
  }, [provision]);

  // Determine the color class based on montantRestant
  const getMontantRestantColor = () => {
    if (montantRestant === 0) {
      return 'text-green-500'; // Green color for montant restant = 0
    } else if (montantRestant <= montant / 2) {
      return 'text-yellow-500'; // Orange color for montant restant < half of montant
    } else {
      return 'text-gray-800'; // Default color
    }
  };
  const getExtourneColor = () => {
    if (extourne === 1) {
      return 'text-green-500'; // Green color for montant restant = 0
    }else {
      return 'text-red-500'; // Default color
    }
  };
const extourneTxt = extourne === 1 ? 'extourner totalement' : 'pas extourner';
const getClassName = (etat) => {
  if (etat === 2) return 'text-green-500';
  if (etat === 3) return 'text-orange-500';
  return 'text-purple-500';
};
const getStatusLabel = (etat) => {
switch(etat) {
  case 1:
    return 'Enregistré';
  case 2:
    return 'Validé';
  case 3:
    return 'Pre-enregistrer';
  default:
    return 'Non Spécifié';
}
};

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-primary hover:border-secondary hover:shadow-xl transition-shadow mb-6 hover:bg-gray-100">
      <h1 className="text-2xl font-bold text-primary mb-3">{intitule}</h1>
      <h2 className="text-xl font-semibold text-secondary mb-4">Provision ID: {id}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <p><strong>Reference Provision:</strong> {ref}</p>
        <p><strong>Type de Provision:</strong> {getTypeFactureLabel(type)}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Montant Total:</strong> {montant} DZD</p>
        <p className={getMontantRestantColor()}><strong>Montant restant:</strong> {montantRestant} DZD</p>
        <p><strong>Gestionnaire:</strong> {gest}</p>
        <p className={getClassName(etat)}>
                <strong>Etat:</strong> {getStatusLabel(etat)}
            </p>
        <p className={getExtourneColor()}><strong>Extourne:</strong> {extourneTxt} </p>
        
      </div>
      {etat === 2 && (
        <>
        <Link href={`/facture/provision/${id}`}>
        <div className="m-4 mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
          VIEW
        </div>
      </Link>
      <Link href={`/facture/provision/extourne/${id}`}>
        <div className="mt-4 inline-block bg-yellow-300 text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
          Extourne manuelle de provision
        </div>
      </Link>
      </>

      )}
      {(session?.user?.previleges?.MODIFICATION_PROVISION||session?.user?.previleges?.admin) && (etat == 1 || etat === 3) && (
        <Link href={`/facture/provision/${id}`}>
          <div className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
            Modify
          </div>
        </Link>
      )}


    </div>
  );
};

export default AcompteCard;
