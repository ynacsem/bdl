import { factureEtat } from "../backend";

export const handleSubmit = async (e, formData, tableData, router, setFormError) => {
    e.preventDefault();

    let { intitule, id_fournisseur, ref, date, gest, observations, type, stru_ord, stru_dest, montant, date_pro, etat, extourne,date_extourne } = formData;
    const state = factureEtat(formData);
    const state2 = factureEtat(tableData)
    if (state === 3 || state2 === 3) {
        etat = 3
    }
    try {
        montant = montant ? montant.toString() : '';

        const response = await fetch('/api/postdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'provision',
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
        let id_prov = Number(result.id);

        alert(`Provision ID: ${result.id}`);

        await Promise.all(tableData.map(async (line) => {

            let {  libelle = '',  TVA = '',  montantUnitaireHT = 0, quantite = 0,  montantRestant = 0 } = line;

            
            let qte =   quantite?.toString();
            let montantU = montantUnitaireHT?.toString();
            let mnt_rest = montantRestant.toString();

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
                            TVA,
                            montantU,
                            qte,
                            mnt_rest
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

        router.push('/facture/provision');
        console.log(id_prov);
        return id_prov;

    } catch (error) {
        console.error('Error submitting data:', error);
        setFormError('Failed to submit the form. Please try again.');
    }
};
