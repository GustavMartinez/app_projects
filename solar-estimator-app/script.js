document.getElementById('solar-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const addressInput = document.getElementById('address');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    const address = addressInput.value.trim(); // Elimina espacios en blanco

    // Limpiar resultados y errores anteriores
    resultsDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    if (address === '') {
        errorDiv.innerHTML = 'Por favor, ingresa una dirección.';
        return;
    }

    // Mostrar un mensaje de carga
    resultsDiv.innerHTML = '<p>Calculando potencial solar...</p>';

    try {
        // Llama a tu backend
        const response = await fetch('http://localhost:3000/get-solar-data', { // Asegúrate que el puerto coincida con tu backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: address }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.innerHTML = `Error: ${data.error || 'Ocurrió un error al obtener los datos solares.'}`;
            resultsDiv.innerHTML = ''; // Limpiar el mensaje de carga
            return;
        }

        // Si la respuesta es exitosa, mostrar los datos
        if (data) {
            resultsDiv.innerHTML = `
                <h2>Resultados para: ${data.address || 'Dirección no confirmada'}</h2>
                <p><strong>Energía Anual Estimada:</strong> ${data.estimatedAnnualProductionWh ? (data.estimatedAnnualProductionWh / 1000).toFixed(2) + ' kWh' : 'No disponible'}</p>
                <p><strong>Área de Techo Utilizable:</strong> ${data.usableRoofAreaSqM ? data.usableRoofAreaSqM.toFixed(2) + ' m²' : 'No disponible'}</p>
                <p><strong>Horas Pico de Sol Anuales:</strong> ${data.peakSunHoursPerYear ? data.peakSunHoursPerYear.toFixed(2) + ' horas' : 'No disponible'}</p>
                ${data.suggestedPanelCount ? `<p><strong>Paneles Sugeridos:</strong> ${data.suggestedPanelCount} paneles (generando ${(data.suggestedPanelsProductionWh / 1000).toFixed(2)} kWh anuales)</p>` : ''}
            `;
        } else {
             errorDiv.innerHTML = 'No se encontraron datos solares para esa dirección.';
             resultsDiv.innerHTML = '';
        }

    } catch (error) {
        console.error('Error fetching solar data:', error);
        errorDiv.innerHTML = 'Error al conectar con el servidor o procesar la solicitud.';
        resultsDiv.innerHTML = '';
    }
});