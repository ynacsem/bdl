'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ModifyGrop({params}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        libelle: '',
        date_dval: '',
        date_fval: '',
        VALIDATION_BAC : 0,
        VALIDATION_BAP : 0,
        VALIDATION_BAPT : 0,
        SAISIE_FACTURE: 0,
        MODIFICATION_FACTURE: 0,
        VALIDATION_ACOMPTE: 0,
        SAISIE_ACOMPTE: 0,
        MODIFICATION_ACOMPTE: 0,
        VALIDATION_PROVISION: 0,
        SAISIE_PROVISION: 0,
        MODIFICATION_PROVISION: 0,
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const today = new Date().toISOString().split('T')[0];

        

        if (formData.date_fval && formData.date_fval < formData.date_dval) {
            newErrors.date_fval = 'Date de fin de validité must not be before the start date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        let {VALIDATION_ACOMPTE, SAISIE_ACOMPTE, MODIFICATION_ACOMPTE, VALIDATION_PROVISION, SAISIE_PROVISION, MODIFICATION_PROVISION, VALIDATION_FACTURE, SAISIE_FACTURE, 
            MODIFICATION_FACTURE, IDprev,VALIDATION_BAC, VALIDATION_BAP, VALIDATION_BAPT} = formData;
        try {
            const response = await fetch('/api/updatedata', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: 'previlege',
                    idField : 'IDprev',
                    id: IDprev,
                    data: {
                        VALIDATION_ACOMPTE,
                        SAISIE_ACOMPTE,
                        MODIFICATION_ACOMPTE,
                        VALIDATION_PROVISION,
                        SAISIE_PROVISION,
                        MODIFICATION_PROVISION,
                        VALIDATION_FACTURE,
                        SAISIE_FACTURE,
                        MODIFICATION_FACTURE,
                        VALIDATION_BAC,
                        VALIDATION_BAP,
                        VALIDATION_BAPT
                    }
                })
            });
            const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        try {
            let { libelle, date_dval, date_fval, IDprev_fk,is_actif } = formData;
            
        
            
            const response = await fetch('/api/updatedata', {
                
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                
                body: JSON.stringify({
                    idField: 'codegrp',
                    id: params.codegrp,
                    table: 'groupe',
                    data:{
                        libelle,
                        date_dval,
                        date_fval,
                        IDprev_fk,
                        is_actif 
                    }
                    
                })})
                
                   
                    
                
                router.push('/managegroup');
        } catch (error) {
            console.log(error);
        }
            ; // Redirect after successful submission
        } catch (error) {
            console.error('Error creating previleges:', error);
        }
    };
    useEffect(() => {
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
                const fields = 'g.libelle,g.date_dval,g.date_fval,g.is_actif,g.IDprev_fk,p.IDprev,p.VALIDATION_ACOMPTE,p.SAISIE_ACOMPTE,p.MODIFICATION_ACOMPTE,p.VALIDATION_PROVISION,p.SAISIE_PROVISION,p.MODIFICATION_PROVISION,p.VALIDATION_BAC,p.VALIDATION_BAP,p.VALIDATION_BAPT,p.SAISIE_FACTURE,p.MODIFICATION_FACTURE';
                const table = 'groupe g';
                const filters = `codegrp = '${params.codegrp}'`;
                const joins = 'INNER JOIN `previlege` p ON p.IDprev = g.IDprev_fk';
                const query = new URLSearchParams({ fields, table, filters,joins }).toString();
                const url = `/api/getdata?${query}`;
                const response = await fetch(url);
                const data = await response.json();
                setFormData(data.results[0]);
                setFormData((prevData) => ({
                    ...prevData,
                    date_dval: prevData.date_dval ? addOneDay(prevData.date_dval) : '',
                    date_fval: prevData.date_fval ? addOneDay(prevData.date_fval) : '',
                }));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [params.codegrp]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                <h1 className="text-2xl font-bold text-center text-secondary mb-4">Modifier un groupe</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Libelle and Dates */}
                    <div>
                        <label htmlFor="libelle" className="block text-lg font-medium text-gray-900">Libellé</label>
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
    
                    {/* Facture Section */}
                    <div className="p-4 border rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Facture</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation BAC</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_BAC"
                                    checked={formData.VALIDATION_BAC === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation BAP</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_BAP"
                                    checked={formData.VALIDATION_BAP === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation BAPT</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_BAPT"
                                    checked={formData.VALIDATION_BAPT === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Saisie</label>
                                <input
                                    type="checkbox"
                                    name="SAISIE_FACTURE"
                                    checked={formData.SAISIE_FACTURE === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Modification</label>
                                <input
                                    type="checkbox"
                                    name="MODIFICATION_FACTURE"
                                    checked={formData.MODIFICATION_FACTURE === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>
                    </div>
    
                    {/* Acompte Section */}
                    <div className="p-4 border rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acompte</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_ACOMPTE"
                                    checked={formData.VALIDATION_ACOMPTE === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Saisie</label>
                                <input
                                    type="checkbox"
                                    name="SAISIE_ACOMPTE"
                                    checked={formData.SAISIE_ACOMPTE === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Modification</label>
                                <input
                                    type="checkbox"
                                    name="MODIFICATION_ACOMPTE"
                                    checked={formData.MODIFICATION_ACOMPTE === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>
                    </div>
    
                    {/* Provision Section */}
                    <div className="p-4 border rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Provision</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_PROVISION"
                                    checked={formData.VALIDATION_PROVISION === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Saisie</label>
                                <input
                                    type="checkbox"
                                    name="SAISIE_PROVISION"
                                    checked={formData.SAISIE_PROVISION === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex-1 text-lg font-medium text-gray-900">Modification</label>
                                <input
                                    type="checkbox"
                                    name="MODIFICATION_PROVISION"
                                    checked={formData.MODIFICATION_PROVISION === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_actif"
                            checked={formData.is_actif === 1}
                            onChange={handleChange}
                            className="h-5 w-5 text-secondary border-gray-300 rounded focus:ring-secondary text-center"
                        />
                        <label htmlFor="is_actif" className="text-lg font-medium text-gray-900">Actif</label>
                    </div>
    
                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
}
