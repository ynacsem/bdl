// utils/acompte/handleSubmit.js
export async function handleAcompteSubmit(data) {
    try {
      const response = await fetch('/api/postdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'acompte', // The table name for acompte
          data,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Error submitting acompte:', error);
      throw error;
    }
  }
// utils/remboursement/handleSubmit.js
export async function handleRemboursementSubmit(data) {
    try {
      const response = await fetch('/api/postdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'remboursement', // The table name for remboursement
          data,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting remboursement:', error);
      throw error;
    }
  }
 