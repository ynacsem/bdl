
//used in modify facture    
export const handleModifier = async (e, formData, searchQuery, tableData, setFormError, router) => {
    e.preventDefault();

    // Extract the formData including the observation field
    let {intitule, id_fournisseur, reference_facture, date, gest, observations,  type_facture, type_saisie, stru_ord, stru_dest, mod_reg, montant, date_facture,rip,
        num_cheq } = formData;

    try {
        montant = montant.toString();

        // Submit the facture data
        const response = await fetch('/api/updatedata', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'facture',
                id: searchQuery,
                data: {
                    intitule,
                    id_fournisseur,
                    reference_facture,
                    date,
                    gest,
                    observations,
                    type_facture,
                    type_saisie,
                    stru_ord,
                    stru_dest,
                    mod_reg,
                    montant,
                    date_facture,
                    num_cheq,
                    rip
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        // Alert the ID of the facture
        alert(`Facture ID: ${searchQuery}`);

        // Submit line data
        await Promise.all(tableData.map(async (line) => {
            const id_facture = Number(searchQuery); // Convert to a number if necessary
            let { libelle, montantU, TVA, qte } = line;
            qte = qte.toString();
            montantU = montantU.toString();

            if (line.id === 0) {
                try {
                    const resp = await fetch('/api/postdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            table: 'ligne_fact',
                            data: {
                                id_facture,
                                libelle,
                                montantU,
                                TVA,
                                qte,
                            },
                        }),
                    });

                    const res = await resp.json();

                    if (!resp.ok) {
                        throw new Error(res.error || 'Something went wrong');
                    }

                } catch (error) {
                    console.error('Error submitting lines data:', error);
                }
            } else {
                try {
                    const resp = await fetch('/api/updatedata', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            table: 'ligne_fact',
                            id: line.id,
                            data: {
                                id_facture,
                                libelle,
                                montantU,
                                TVA,
                                qte,
                            },
                        }),
                    });

                    const res = await resp.json();

                    if (!resp.ok) {
                        throw new Error(res.error || 'Something went wrong');
                    }
                    router.push("/facture");
                } catch (error) {
                    console.error('Error submitting lines data:', error);
                }
            }
        }));

    } catch (error) {
        console.error('Error submitting data:', error);
        setFormError('Failed to submit the form. Please try again.');
    }
};
