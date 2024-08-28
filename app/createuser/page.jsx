'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateUser() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        code_user: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        mot_pass: '',
        email: '',
        date_dval: '',
        date_fval: '',
        codegrp_fk: '',
        is_actif:1
    });
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'loading') {
            // Wait for the session status to resolve
            return;
        }

        if (!session) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
        }
        const fetchGroups = async () => {
            try {
                
                const fields = 'libelle,codegrp'
                const table = 'groupe'
                const query = new URLSearchParams({ fields, table }).toString();
                const url = `/api/getdata?${query}`;
                const response = await fetch(url);
                
                const data = await response.json();
                setGroups(data.results);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date().toISOString().split('T')[0];

        if (formData.date_dval < today) {
            newErrors.date_dval = 'Date de début de validité must be today or later.';
        }

        if (formData.date_fval && formData.date_fval < formData.date_dval) {
            newErrors.date_fval = 'Date de fin de validité must not be before the start date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/getdata?table=user&filters=code_user=${value}`);
            const data = await response.json();

            if (data.results.length > 0) {
                alert('Code User already exists!');
                exist = true
            }
        } catch (error) {
            console.error('Error fetching code_user:', error);
        }
        if (!validateForm()) return;

        try {
            await fetch('/api/postdata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: 'user',
                     data: formData})
            });
            router.push('/facture'); // Redirect to a success page or dashboard
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        
        

            setFormData((prev) => ({ ...prev, [name]: value }));
        
    };
    
    

    return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-2xl font-bold text-center text-secondary mb-4">Provision</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Facture Group */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Facture</h2>
                    <div className="space-y-4">
                        {/* Validation Section */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Validation</h3>
                            <div className="space-x-2">
                                {/* Add your inputs related to Validation here */}
                            </div>
                        </div>

                        {/* Saisie Section */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Saisie</h3>
                            <div className="space-x-2">
                                {/* Add your inputs related to Saisie here */}
                            </div>
                        </div>

                        {/* Modifier Section */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Modifier</h3>
                            <div className="space-x-2">
                                {/* Add your inputs related to Modifier here */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other sections like libelle, dates, etc. */}
                <div>
                    <label htmlFor="libelle" className="block text-lg font-medium text-gray-900">Libelle</label>
                    <input
                        type="text"
                        name="libelle"
                        value={formData.libelle}
                        onChange={handleChange}
                        required
                        className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="date_dval" className="block text-lg font-medium text-gray-900">Date de Début de Validité</label>
                        <input
                            type="date"
                            name="date_dval"
                            value={formData.date_dval}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        />
                        {errors.date_dval && <p className="text-red-600 text-sm mt-1">{errors.date_dval}</p>}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="date_fval" className="block text-lg font-medium text-gray-900">Date de Fin de Validité</label>
                        <input
                            type="date"
                            name="date_fval"
                            value={formData.date_fval}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        />
                        {errors.date_fval && <p className="text-red-600 text-sm mt-1">{errors.date_fval}</p>}
                    </div>
                </div>

                {/* Save Changes Button */}
                <button type="submit" className="block w-full mt-6 bg-primary text-white py-2 px-6 rounded text-base">
                    Save Changes
                </button>
            </form>
        </div>
    </div>
);

}
