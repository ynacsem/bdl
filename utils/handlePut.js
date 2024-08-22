
//used in modify facture    
import {factureEtat} from "./backend";
export const handleModifier = async (e, formData, searchQuery, tableData, setFormError, router,validate) => {
    e.preventDefault();
    validate = validate || false
    // Extract the formData including the observation field
    let {intitule, id_fournisseur, reference_facture, date, gest, observations,  type_facture, type_saisie, stru_ord, stru_dest, mod_reg, montant, date_facture,rip,
        num_cheq,etat } = formData;
    if (validate){
        etat = 2;
    }
    const state = factureEtat(formData);
    const state2 = factureEtat(tableData)
    if (state === 3 || state2 === 3) {
        etat = 3
    }

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
                    rip,
                    etat
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        // Alert the ID of the facture
        alert(`Facture ID: ${searchQuery}`);
        //upload the files from here
        // Submit line data
        await Promise.all(tableData.map(async (line) => {
            const id_facture = Number(searchQuery); // Convert to a number if necessary
            let { libelle, montantU, codeTVA, qte } = line;
            qte = qte.toString();
            montantU = montantU.toString();
            let TVA = codeTVA
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
                                TVA:codeTVA,
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
