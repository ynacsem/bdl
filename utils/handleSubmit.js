export const handleSubmit = async (e, formData, tableData, router, setFormError) => {
    e.preventDefault();

    let { intitule, id_fournisseur, reference_facture, date, gest, observations, type_facture, type_saisie, stru_ord, stru_dest, mod_reg, montant, date_facture,rip,
        num_cheq, etat } = formData;
    let id_facture

    try {
        // Check if montant is defined and convert to string
        montant = montant ? montant.toString() : '';

        const response = await fetch('/api/postdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'facture',
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
                    rip,
                    etat
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        alert(`Facture ID: ${result.id}`);

        await Promise.all(tableData.map(async (line) => {
             id_facture = Number(result.id);
            
            // Ensure line properties are defined
            let { libelle = '', montantU = '', TVA = '', qte = '' } = line;

            qte = qte ? qte.toString() : '';
            montantU = montantU ? montantU.toString() : '';

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
                            qte
                        }
                    }),
                });

                const res = await resp.json();

                if (!resp.ok) {
                    throw new Error(res.error || 'Something went wrong');
                }
            } catch (error) {
                console.error('Error submitting lines data:', error);
                setFormError('Failed to submit line data. Please try again.');
            }
        }));
        
        router.push('/facture');
        return id_facture;

    } catch (error) {
        console.error('Error submitting data:', error);
        setFormError('Failed to submit the form. Please try again.');
    }
};