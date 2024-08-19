'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const AcompteCard = ({ acompte }) => {
  const { data: session } = useSession();
  let { id, type_facture, date, montant, gest, libelle_acompte } = acompte;

  if (!montant) {
    montant = 0;
  }

  // Function to determine the label for type_facture
  const getTypeFactureLabel = (type) => {
    switch(type) {
      case 1:
        return 'Acompte Fournisseur';
      case 2:
        return 'Acompte Clients';
      default:
        return 'Non Spécifié';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow mb-6">
      <h1 className="text-2xl font-bold text-primary mb-3">{libelle_acompte}</h1>
      <h2 className="text-xl font-semibold text-secondary mb-4">Acompte ID: {id}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <p><strong>Type de Facture:</strong> {getTypeFactureLabel(type_facture)}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Montant Total:</strong> {montant} DZD</p>
        <p><strong>Gestionnaire:</strong> {gest}</p>
        <p><strong>Type de Saisie:</strong> Acompte </p>
      </div>
      {session?.user?.previleges?.admin && (
        <Link href={`./facture/acompte/${id}`}>
          <div className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
            Modify
          </div>
        </Link>
      )}
    </div>
  );
};

export default AcompteCard;
