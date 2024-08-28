'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ManagePrevileges() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        libelle: '',
        date_dval: '',
        date_fval: '',
        VALIDATION_FACTURE: 0,
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
            await fetch('/api/postdata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: 'previleges',
                    data: formData
                })
            });
            router.push('/previleges'); // Redirect after successful submission
        } catch (error) {
            console.error('Error creating previleges:', error);
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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-6" style={{ maxHeight: '105vh' }}>
                <h1 className="text-2xl font-bold text-center text-secondary mb-4">Create un groupe</h1>
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
                                <label className="flex-1 text-lg font-medium text-gray-900">Validation</label>
                                <input
                                    type="checkbox"
                                    name="VALIDATION_FACTURE"
                                    checked={formData.VALIDATION_FACTURE === 1}
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

                    {/* Submit Button */}
                    <div className="flex justify-end">
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
