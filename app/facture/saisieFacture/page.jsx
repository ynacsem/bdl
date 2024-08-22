'use client';
import React, { useState } from 'react';
import Facture from '@/components/Facture';
import Acompte from '@/components/Acompte';
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState('');

  if (!session) {
    return <p className="text-center">You are not logged in</p>;
  }

  const handleChange = (e) => {
    setSelectedType(e.target.value);
  };

  const renderComponent = () => {
    switch (selectedType) {
      case '':
        return <Facture type={0} />;
      case 'facture':
        return <Facture type={1} />;
      case 'facture non comptable':
        return <Facture type={2} />;
      case 'acompte':
        return <Acompte />;
      case 'avoir':
        return <Facture type={4} />;
      case 'avoir non comptable':
        return <Facture type={5} />;
      default:
        return null;
    }
  };

  return (
    
    <>
    <div className="mt-5 flex justify-center">
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
        </select>
      </div>
    </div>
    {renderComponent()}
  </>
  
    
  );
};

export default Page;
