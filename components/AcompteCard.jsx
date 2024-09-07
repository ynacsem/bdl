'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const AcompteCard = ({ acompte }) => {
  const { data: session } = useSession();
  const previleges = session?.user?.previleges;
  let { id, type_facture, date, montant, gest, libelle_acompte, etat, date_echeance } = acompte;

  if (!montant) {
    montant = 0;
  }

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
  const getTypeFactureLabel = (type) => {
    switch (type) {
      case 1:
        return 'Acompte Fournisseur';
      case 3:
        return 'Acompte Clients';
      default:
        return 'Non Spécifié';
    }
  };

  const renderButtons = () => {
    const buttons = [];
    // VIEW button
    if (etat === 2) {
      buttons.push(
        <Link key="view" href={`./facture/acompte/${id}`}>
          <div className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
            VIEW
          </div>
        </Link>
      );
    }
    // MODIFY button
    if (session?.user?.previleges?.MODIFICATION_ACOMPTE && (etat === 1 || etat === 3 || etat === 0)) {
      buttons.push(
        <Link key="modify" href={`./facture/acompte/${id}`}>
          <div className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
            Modify
          </div>
        </Link>
      );
    }
    // VALIDATE button
    if (session?.user?.previleges?.VALIDATION_ACOMPTE && etat === 1) {
      buttons.push(
        <Link key="validate" href={`./facture/acompte/${id}`}>
          <div className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
            Valider
          </div>
        </Link>
      );
    }
    return buttons;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-primary hover:border-secondary hover:shadow-xl transition-shadow mb-6 hover:bg-gray-100">
      <h1 className="text-2xl font-bold text-primary mb-3">{libelle_acompte}</h1>
      <h2 className="text-xl font-semibold text-secondary mb-4">Acompte ID: {id}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <p><strong>Type de Facture:</strong> {getTypeFactureLabel(type_facture)}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Montant Total:</strong> {montant} DZD</p>
        <p><strong>Gestionnaire:</strong> {gest}</p>
        <p><strong>Type de Saisie:</strong> Acompte </p>
        <p className={getClassName(etat)}>
          <strong>Etat:</strong> {getStatusLabel(etat)}
        </p>
        <p><strong>Date d'échéance:</strong> {new Date(date_echeance).toLocaleDateString('fr-FR')}</p> 
      </div>
      <div className="flex space-x-4 mt-4">
        {renderButtons()}
      </div>
    </div>
  );
};

export default AcompteCard;
