'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function AddFournisseurForm() {
  const [formData, setFormData] = useState({
    FrsName: '',
    NIF: '',
    ADRESS: '',
    CONTACT: '',
    MODRGL: ''
  });

  const [message, setMessage] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/postdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'frs', // Replace with your actual table name
          data: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setMessage('Le fournisseur a été ajouté correctement.');
      
      // Redirect after a short delay (e.g., 1 seconds)
      setTimeout(() => {
        router.push('/facture'); // Redirect to the desired path
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du fournisseur:', error);
      setMessage('Erreur lors de l\'ajout du fournisseur.');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#fdb713' }}>Ajouter Fournisseur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div>
            <label htmlFor="FrsName" className="block font-medium text-purple-700">Nom du Fournisseur</label>
            <input
              type="text"
              id="FrsName"
              name="FrsName"
              value={formData.FrsName}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="NIF" className="block font-medium text-purple-700">NIF (15 caractères)</label>
            <input
              type="text"
              id="NIF"
              name="NIF"
              value={formData.NIF}
              onChange={handleInputChange}
              maxLength="15"
              className="w-full border p-2 rounded focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="ADRESS" className="block font-medium text-purple-700">Adresse</label>
            <input
              type="text"
              id="ADRESS"
              name="ADRESS"
              value={formData.ADRESS}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="CONTACT" className="block font-medium text-purple-700">Numéro de Téléphone</label>
            <input
              type="tel"
              id="CONTACT"
              name="CONTACT"
              value={formData.CONTACT}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="MODRGL" className="block font-medium text-purple-700">Mode de Règlement</label>
            <select
              id="MODRGL"
              name="MODRGL"
              value={formData.MODRGL}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:border-purple-500"
              required
            >
              <option value="" disabled>Sélectionner un mode de règlement</option>
              <option value="cheque">Chèque</option>
              <option value="virement">Virement</option>
              <option value="espece">Espèce</option>
            </select>
          </div>
        </div>

        <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
          Ajouter Fournisseur
        </button>
      </form>
      
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
