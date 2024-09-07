'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateUser({ params }) {
    const { data: session, status } = useSession();
    const [structures, setStructures] = useState([]); 
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
        is_actif: 1,
    });
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.push('/login');
            return;
        }
        const addOneDay = (dateString) => {
            if (!isValidDate(dateString) || dateString === '0000-00-00') {
                return ''; // Return empty string for invalid or placeholder dates
            }

            const date = new Date(dateString);
            date.setDate(date.getDate() + 1); // Add one day
            return date.toISOString().split('T')[0]; // Return in 'yyyy-mm-dd' format
        };
        const isValidDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        };

        const fetchData = async () => {
            try {
                const fields = 'code_user,nom,prenom,date_naissance,email,date_fval,date_dval,is_actif,codegrp_fk,ID_struct_fk';
                const table = 'user';
                const filters = `code_user = '${params.code_user}'`;
                const query = new URLSearchParams({ fields, table, filters }).toString();
                const url = `/api/getdata?${query}`;
                const response = await fetch(url);
                const data = await response.json();
                setFormData(data.results[0]);
                setFormData((prevData) => ({
                    ...prevData,
                    date_dval: prevData?.date_dval ? addOneDay(prevData.date_dval) : '',
                    date_fval: prevData?.date_fval ? addOneDay(prevData.date_fval) : '',
                    date_naissance: prevData?.date_naissance ? addOneDay(prevData.date_naissance) : '',
                }));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchGroups = async () => {
            try {
                const fields = 'libelle,codegrp';
                const table = 'groupe';
                const query = new URLSearchParams({ fields, table }).toString();
                const url = `/api/getdata?${query}`;
                const response = await fetch(url);
                const data = await response.json();
                setGroups(data.results);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        const fetchStructures = async () => {
            try {
                const fields = 'libelle,IDstruct';
                const table = 'structure';
                const query = new URLSearchParams({ fields, table }).toString();
                const url = `/api/getdata?${query}`;
                const response = await fetch(url);
                const data = await response.json();
                setStructures(data.results);
            } catch (error) {
                console.error('Error fetching structures:', error);
            }
        };

        fetchData();
        fetchGroups();
        fetchStructures()
    }, [params.code_user]);

    const validateForm = () => {
        const newErrors = {};

        

        if (formData.date_fval && formData.date_fval < formData.date_dval) {
            newErrors.date_fval = 'Date de fin de validité must not be before the start date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        
        console.log(formData);
        try {
            await fetch('/api/updatedata', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idField: 'code_user',
                    id: params.code_user,
                    table: 'user',
                    data: formData
                })
            });
            router.push('/manageusers'); // Redirect to a success page or dashboard
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div 
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto" 
                style={{ maxHeight: '90vh' }}
            >
                <h1 className="text-2xl font-bold text-center text-secondary mb-4">Modifier un utilisateur</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="code_user" className="block text-lg font-medium text-gray-900">Code User</label>
                        <input
                            type="text"
                            name="code_user"
                            value={formData.code_user}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="nom" className="block text-lg font-medium text-gray-900">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="prenom" className="block text-lg font-medium text-gray-900">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="date_naissance" className="block text-lg font-medium text-gray-900">Date de Naissance</label>
                        <input
                            type="date"
                            name="date_naissance"
                            value={formData.date_naissance}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-900">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
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
                                min={formData.date_fval}
                                required
                                className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                            />
                            {errors.date_fval && <p className="text-red-600 text-sm mt-1">{errors.date_fval}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="codegrp_fk" className="block text-lg font-medium text-gray-900">Group</label>
                        <select
                            name="codegrp_fk"
                            value={formData.codegrp_fk}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Select a group</option>
                            {groups.map((group) => (
                                <option key={group.codegrp} value={group.codegrp}>
                                    {group.libelle}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Add checkbox for is_actif */}
                    <div className="flex items-center space-x-2 ">
                        <input
                            type="checkbox"
                            name="is_actif"
                            checked={formData.is_actif === 1}
                            onChange={handleChange}
                            className="h-5 w-5 text-secondary border-gray-300 rounded focus:ring-secondary text-center"
                        />
                        <label htmlFor="is_actif" className="text-lg font-medium text-gray-900">Actif</label>
                    </div>
                    <div>
                        <label htmlFor="ID_struct_fk" className="block text-lg font-medium text-gray-900">Structure</label>
                        <select
                            name="ID_struct_fk"
                            value={formData.ID_struct_fk}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Select a structure</option>
                            {structures.map((structure) => (
                                <option key={structure.IDstruct} value={structure.IDstruct}>
                                    {structure.libelle}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="block mx-auto mt-6 bg-primary text-white py-2 px-6 rounded text-base">
                        Modifier
                    </button>
                </form>
            </div>
        </div>
    );
    
}
