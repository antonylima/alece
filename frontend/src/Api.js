/**
 * Fetches all records from the CTP API.
 * @returns {Promise<Array>} A promise that resolves to an array of records.
 */
export async function getDeputados() {
  const url = 'https://dep-alece.onrender.com/api/ctp';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Successfully fetched records:', data);
    return data;

  } catch (error) {
    console.error('Failed to fetch records:', error);
    throw error;
  }
}

/**
 * Updates the 'licenciado' status for a specific record.
 * @param {number} id - The ID of the record to update.
 * @param {boolean} isLicenciado - The new value for the 'licenciado' field.
 * @returns {Promise<Object>} A promise that resolves to the updated record.
 */
export async function updateLicenciadoStatus(id, isLicenciado) {
  const url = `https://dep-alece.onrender.com/api/ctp/${id}`;

  const body = {
    licenciado: isLicenciado,
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const updatedRecord = await response.json();
    console.log('Successfully updated record:', updatedRecord);
    return updatedRecord;

  } catch (error) {
    console.error('Failed to update status:', error);
    throw error;
  }
}