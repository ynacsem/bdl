export const handleModifier = async (e, formDataAcompte, formDataRemboursement,  router) => {
    e.preventDefault();
  
    try {
      // Convert formDataAcompte according to table schema
      let {
        type_facture, 
        id_fournisseur,  
        stru_ord, 
        stru_dest, 
        libelle_acompte, 
        date, 
        numacmpt, 
        montant, 
        observations, 
        dateacmpt
      } = formDataAcompte;
  
      montant = montant.toString();
  
      // Submit the Acompte data
      const acompteResponse = await fetch('/api/updatedata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'acompte',
          id: formDataAcompte.id,  // Assuming you have `id_acompte` in formDataAcompte
          data: {
            type_facture,
            id_fournisseur: parseInt(id_fournisseur, 10)||'', // Convert to integer
            stru_ord,
            stru_dest,
            libelle_acompte,
            date, // Ensure date is in YYYY-MM-DD format
            numacmpt,
            montant: parseFloat(montant).toFixed(2), // Convert to decimal
            observations,
            dateacmpt,
          },
        }),
      });
  
      const acompteResult = await acompteResponse.json();
      console.log(acompteResult);
      if (!acompteResponse.ok) {
        throw new Error(acompteResult.error || 'Something went wrong');
      }
  
      // Alert the ID of the acompte
      alert(`Acompte ID: ${formDataAcompte.id}`);
  
      // Update formDataRemboursement with the new id_acompte if necessary
      formDataRemboursement.id_acompte = formDataAcompte.id_acompte;
  
      // Submit the Remboursement data
      let {
        gestionnaire_bap,
        solde_a_encaisser,
        date_echeance,
        date_valuer,
        date_forcage_remboursement,
        date_encaissement,
        num_cheque,
        ref_pointage,
        ref_a_rappeler,
        mode_encaisement,
        numero,
        compte,
      } = formDataRemboursement;
  
      const remboursementResponse = await fetch('/api/updatedata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'remboursement',
          id: formDataRemboursement.id,  // Assuming you have `id_remboursement` in formDataRemboursement
          data: {
            id_acompte: formDataRemboursement.id_acompte, // Use the ID from the acompte submission
            gestionnaire_bap,
            solde_a_encaisser,
            date_echeance, // Ensure date is in YYYY-MM-DD format
            date_valuer, // Ensure date is in YYYY-MM-DD format
            date_forcage_remboursement, // Ensure date is in YYYY-MM-DD format
            date_encaissement, // Ensure date is in YYYY-MM-DD format
            num_cheque,
            ref_pointage,
            ref_a_rappeler,
            mode_encaisement,
            numero,
            compte,
          },
        }),
      });
  
      const remboursementResult = await remboursementResponse.json();
  
      if (!remboursementResponse.ok) {
        throw new Error(remboursementResult.error || 'Something went wrong');
      }
  
      console.log('Both forms submitted successfully');
      router.push('/facture'); // Redirect to /facture
  
    } catch (error) {
      console.error('Error submitting data:', error);
      
    }
  };
  