'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import crypto from 'crypto';

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
        ID_struct_fk: '',
    });
    const [groups, setGroups] = useState([]);
    const [structures, setStructures] = useState([]);  // State to hold structure data
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.push('/login');
            return;
        }

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
            } finally {
                setIsLoading(false);
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

        fetchGroups();
        fetchStructures();  // Fetch the structures data

    }, [session, status]);
    const hashPassword = (password) => {
        const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
        if (!secret) {
            throw new Error('NEXT_PUBLIC_SECRET_KEY is not defined in the environment');
        }
        return crypto.createHmac('sha256', secret).update(password).digest('hex');
    };
    
    
    

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

        if (!validateForm()) return;

        try {
            const checkResponse = await fetch(`/api/getdata?table=user&filters=code_user='${formData.code_user}'`);
            const checkData = await checkResponse.json();

            if (checkData.results?.length > 0) {
                alert('Code User already exists!');
                return;
            }
            const today = new Date().toISOString().split('T')[0];
            let is_actif= formData.date_dval <= today ? 1 : 0;
            console.log(formData.date_dval)
            console.log(today)
            console.log(is_actif)
            let {date_dval, date_fval,code_user,nom,prenom,ID_struct_fk,codegrp_fk,email,date_naissance}=formData
            let mot_pass = hashPassword(formData.mot_pass); // Hash the password
            await fetch('/api/postdata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: 'user',
                    data: {date_dval, date_fval,code_user,nom,prenom,ID_struct_fk,codegrp_fk,mot_pass,email,date_naissance,is_actif}
                })
            });

            router.push('/facture'); // Redirect to a success page or dashboard
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div 
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto" 
                style={{ maxHeight: '90vh' }}
            >
                <h1 className="text-2xl font-bold text-center text-secondary mb-4">Créer un utilisateur</h1>
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Existing input fields */}
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
                            <label htmlFor="mot_pass" className="block text-lg font-medium text-gray-900">Mot de Passe</label>
                            <input
                                type="password"
                                name="mot_pass"
                                value={formData.mot_pass}
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
                                    min={new Date().toISOString().split('T')[0]}
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
                                    min={formData.date_dval}  
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
                        <div className="text-center mt-6">
                            <button type="submit" className="bg-primary text-white py-2 px-6 rounded text-base">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
    
}
