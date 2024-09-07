'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const FactureCard = ({ facture }) => {
  const { data: session } = useSession();
  const [struDestID, setStruDestID] = useState(null);  // State to store the structure ID

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
    etat,
    BAC,
    BAP,
    BAPT,
    stru_dest
  } = facture;

  if (!montant) {
    montant = 0;
  }

  const getClassName = (etat) => {
    if (etat === 2) return 'text-green-500';
    if (etat === 3) return 'text-orange-500';
    return 'text-purple-500';
  };

  const getTypeFactureLabel = (type) => {
    switch (type) {
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

  const getTypeSaisieLabel = (type_saisie) => {
    switch (type_saisie) {
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

  const getStatusLabel = (etat) => {
    switch (etat) {
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

  const getValidationStatus = (status, isBAP) => {
    if (isBAP) {
      return status === 3 ? 'Validé' : 'Non Validé';
    }
    return status === 1 ? 'Validé' : 'Non Validé';
  };

  const getStruDestID = async (stru_dest) => {
    const table = 'structure';
    const fields = 'IDstruct';
    const filters = `libelle='${stru_dest}'`;
    const query = new URLSearchParams({ table, fields, filters }).toString();
    const url = `/api/getdata?${query}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result.results[0]?.IDstruct;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (stru_dest) {
      getStruDestID(stru_dest).then((id) => {
        setStruDestID(id);
      });
    }
  }, [session]);

  const getButtonToShow = () => {
    if (type_saisie !== 2 && type_saisie !== 5 && etat === 1) {
      if (session?.user?.previleges?.VALIDATION_BAC && BAC === 0) {
        return (
          <Link href={`./facture/${id}`}>
            <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
              Valider BAC
            </div>
          </Link>
        );
      }

      if (session?.user?.previleges?.VALIDATION_BAPT && BAC === 1 && BAPT !== 1 && BAP === 3) {
        return (
          <Link href={`./facture/${id}`}>
            <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
              Valider BAPT
            </div>
          </Link>
        );
      }

      if (session?.user?.previleges?.VALIDATION_BAP && BAP === 0 && session?.user?.ID_struct_fk === struDestID && BAC === 1) {
        return (
          <Link href={`./facture/${id}`}>
            <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
              Valider BAP NIV1
            </div>
          </Link>
        );
      }

      if (session?.user?.previleges?.VALIDATION_BAP && BAP === 1 && session?.user?.ID_struct_fk === 24 && struDestID && BAC === 1) {
        return (
          <Link href={`./facture/${id}`}>
            <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
              Valider BAP NIV2
            </div>
          </Link>
        );
      }

      if (session?.user?.previleges?.VALIDATION_BAP && BAP === 2 && session?.user?.ID_struct_fk === 81 && struDestID && BAC === 1) {
        return (
          <Link href={`./facture/${id}`}>
            <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
              Valider BAP NIV3
            </div>
          </Link>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-primary hover:border-secondary hover:shadow-xl transition-shadow mb-6 hover:bg-gray-100">
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
          <strong>Etat:</strong> {getStatusLabel(etat)}
        </p>
      </div>

      {type_saisie !== 2 && type_saisie !== 5 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <p><strong>BAC Validation:</strong> {getValidationStatus(BAC)}</p>
            <p><strong>BAP Validation:</strong> {getValidationStatus(BAP, true)}</p>
            <p><strong>BAPT Validation:</strong> {getValidationStatus(BAPT)}</p>
          </div>

          <div className="flex gap-4">
            {((etat === 2) || (BAC === 1)) && (
              <Link href={`./facture/${id}`}>
                <div className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
                  VIEW
                </div>
              </Link>
            )}

            {session?.user?.previleges?.MODIFICATION_FACTURE && (etat === 1 || etat === 3) && (BAC !== 1) && (
              <Link href={`./facture/${id}`}>
                <div className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
                  Modify
                </div>
              </Link>
            )}

            {getButtonToShow()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FactureCard;
