'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const FactureCard = ({ facture }) => {
  const { data: session } = useSession();
  let {
    id,
    intitule,
    type_facture,
    reference_facture,
    date,
    montant,
    mod_reg,
    gest,
    type_saisie,
    etat
  } = facture;

  if (!montant) {
    montant = 0;
  }
  const getClassName = (etat) => {
    if (etat === 2) return 'text-green-500';
    if (etat === 3) return 'text-orange-500';
    return 'text-purple-500';
};
  // Function to determine the label for type_facture
  const getTypeFactureLabel = (type) => {
    switch(type) {
      case 1:
        return 'Facture Fournisseur';
      case 2:
        return 'Facture Salariés';
      case 3:
        return 'Facture Clients';
      default:
        return 'Non Spécifié';
    }
  };

  // Function to determine the label for type_saisie
  const getTypeSaisieLabel = (type_saisie) => {
    switch(type_saisie) {
      case 1:
        return 'Facture';
      case 2:
        return 'Facture Non Comptable';
      case 3:
        return 'Acompte';
      case 4:
        return 'Avoir';
      case 5:
        return 'Avoir Non Comptable';
      default:
        return 'Non Spécifié';
    }
  };

  // Function to determine the status label
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
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow mb-6">
      <h1 className="text-2xl font-bold text-primary mb-3">{intitule}</h1>
      <h2 className="text-xl font-semibold text-secondary mb-4">Facture ID: {id}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <p><strong>Type de Facture:</strong> {getTypeFactureLabel(type_facture)}</p>
        <p><strong>Numéro Facture:</strong> {reference_facture}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Montant Total:</strong> {montant} DZD</p>
        <p><strong>Mode de Règlement:</strong> {mod_reg}</p>
        <p><strong>Gestionnaire:</strong> {gest}</p>
        <p><strong>Type de Saisie:</strong> {getTypeSaisieLabel(type_saisie)}</p>
        <p className={getClassName(etat)}>
                <strong>Statut:</strong> {getStatusLabel(etat)}
            </p>

      </div>
      {etat === 2 && (
        <Link href={`./facture/${id}`}>
        <div className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
          VIEW
        </div>
      </Link>
      )}
      {session.user.previleges.admin && (etat == 1 || etat === 3) && (
        <Link href={`./facture/${id}`}>
        <div className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
          Modify
        </div>
      </Link>
      )}
      
    </div>
  );
};

export default FactureCard;
