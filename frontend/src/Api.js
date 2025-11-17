 
 function Api() {
 /**
   * Updates the 'licenciado' status for a specific record.
   * @param {number} id - The ID of the record to update.
   * @param {boolean} isLicenciado - The new value for the 'licenciado' field.
   */
  async function updateLicenciadoStatus(id, isLicenciado) {
    // The URL of your API endpoint, including the specific ID
    const url = `http://localhost:3000/api/ctp/${id}`;

    // The data to send in the request body
    const body = {
      licenciado: isLicenciado,
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH', // The HTTP method for the request
        headers: {
          'Content-Type': 'application/json', // Tells the server we are sending JSON
        },
        body: JSON.stringify(body), // Converts the JS object to a JSON string
      });

      if (!response.ok) {
        // Handle HTTP errors (like 404 Not Found or 500 Server Error)
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      // Get the updated record from the API's response
      const updatedRecord = await response.json();
      console.log('Successfully updated record:', updatedRecord);
      
      return updatedRecord;

    } catch (error) {
      console.error('Failed to update status:', error);
      // Here you could show an error message to the user
    }
  }

  // --- Example of how to use the function ---

  // To set the 'licenciado' status of the record with ID 5 to TRUE
  // updateLicenciadoStatus(5, true);

  // To set the 'licenciado' status of the record with ID 8 to FALSE
//   updateLicenciadoStatus(1, false);
//   updateLicenciadoStatus(2, false);
//   updateLicenciadoStatus(3, false);
//   updateLicenciadoStatus(4, false);
//    updateLicenciadoStatus(45, false);
//    updateLicenciadoStatus(5, false);
}

export default Api