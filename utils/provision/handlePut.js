
//used in modify facture    
import {factureEtat} from "../backend";
export const handleModifier = async (e, formData, searchQuery, tableData, setFormError, router,validate) => {
    e.preventDefault();
    validate = validate || false
    // Extract the formData including the observation field
    let {intitule, id_fournisseur, ref, date, gest, observations,  type, stru_ord, stru_dest, montant, date_pro,etat ,extourne,date_extourne} = formData;
    etat = 1
    if (validate){
        etat = 2;
    }
    const state = factureEtat(formData);
    const state2 = factureEtat(tableData)
    console.log('state',state,state2)
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
                table: 'provision',
                id: searchQuery,
                data: {
                    intitule,
                    id_fournisseur,
                    ref,
                    date,
                    gest,
                    observations,
                    type,
                    stru_ord,
                    stru_dest,
                    montant,
                    date_pro,
                    etat,
                    extourne,
                    date_extourne
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong');
        }

        // Alert the ID of the facture
        alert(`Provision ID: ${searchQuery}`);
        //upload the files from here
        // Submit line data
        await Promise.all(tableData.map(async (line) => {
            const id_prov = Number(searchQuery); // Convert to a number if necessary
            let { libelle = '', montantU = '', TVA = '', qte = '',montantRestant = '' } = line;
            qte = qte ? qte.toString() : '';
            montantU = montantU ? montantU.toString() : ''
            let mnt_rest = montantRestant.toString();
            
            if (!line.id) {
                try {
                    const resp = await fetch('/api/postdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            table: 'pro_ligne',
                            data: {
                                id_prov,
                                libelle,
                                montantU,
                                TVA,
                                qte,
                                mnt_rest
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
                            table: 'pro_ligne',
                            id: line.id,
                            data: {
                                id_prov,
                                libelle,
                                montantU,
                                TVA,
                                qte,
                                mnt_rest
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
