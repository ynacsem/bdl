'use client';
import React, { useState } from 'react';
import Facture from '@/components/Facture';
import Acompte from '@/components/Acompte';
import Provision from '@/components/Provision';
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState('');
  const previleges = session?.user?.previleges;

  if (!session) {
    return <p className="text-center">You are not logged in</p>;
  }
  if (session?.user?.previleges?.admin) {
    router.push('/manageusers');
    return
}

  const handleChange = (e) => {
    setSelectedType(e.target.value);
  };

  const renderComponent = () => {
    switch (selectedType) {
      case 'facture':
        if (!previleges.SAISIE_FACTURE ) {
          alert('Vous n’avez pas le privilège requis pour saisir une facture.');
          setSelectedType('');
          return null;
        }
        return <Facture type={1} />;
      case 'facture non comptable':
        if (!previleges.SAISIE_FACTURE ) {
          alert('Vous n’avez pas le privilège requis pour saisir une facture.');
          setSelectedType('');
          return null;
        }
        return <Facture type={2} />;
      case 'acompte':
        if (!previleges.SAISIE_ACOMPTE ) {  // Assuming SAISIE_ACOMPTE is the privilege required for acompte
          alert('Vous n’avez pas le privilège requis pour saisir un acompte.');
          setSelectedType('');
          return null;
        }
        return <Acompte />;
      case 'avoir':
        if (!previleges.SAISIE_FACTURE ) {  // Assuming SAISIE_AVOIR is the privilege required for avoir
          alert('Vous n’avez pas le privilège requis pour saisir un avoir.');
          setSelectedType('');
          return null;
        }
        return <Facture type={4} />;
      case 'avoir non comptable':
        if (!previleges.SAISIE_FACTURE ) {  // Assuming SAISIE_AVOIR is the privilege required for avoir non comptable
          alert('Vous n’avez pas le privilège requis pour saisir un avoir non comptable.');
          setSelectedType('');
          return null;
        }
        return <Facture type={5} />;
      case 'provision':
        if (!previleges.SAISIE_PROVISION ) {  // Assuming SAISIE_PROVISION is the privilege required for provision
          alert('Vous n’avez pas le privilège requis pour saisir une provision.');
          setSelectedType('');
          return null;
        }
        return <Provision />;
      default:
        return null;
    }
  };

  return (
    
    <>
    <div className="mt-5 flex justify-center overlay">
      <div>
        <h2 className="text-center font-semibold text-2xl mb-3 text-purple-700">
          Type de saisie
        </h2>
        <select
          onChange={handleChange}
          value={selectedType}
          className="block w-64 p-2 border border-gray-300 rounded mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="" className="text-gray-500">Select Type</option>
          <option value="facture" className="text-purple-700 hover:bg-purple-200">Facture</option>
          <option value="facture non comptable" className="text-purple-700 hover:bg-purple-200">Facture Non Comptable</option>
          <option value="acompte" className="text-purple-700 hover:bg-purple-200">Acompte</option>
          <option value="avoir" className="text-purple-700 hover:bg-purple-200">Avoir</option>
          <option value="avoir non comptable" className="text-purple-700 hover:bg-purple-200">
            Avoir Non Comptable
          </option>
          <option value="provision" className="text-purple-700 hover:bg-purple-200">provision</option>
        </select>
      </div>
    </div>
    {renderComponent()}
  </>
  
    
  );
};

export default Page;
