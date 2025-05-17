// server.js
const express = require('express');
// Si tu versión de Node.js es 18 o superior (instalada con nvm --lts), puedes eliminar la línea de abajo:
// const fetch = require('node-fetch');
require('dotenv').config(); // ASEGÚRATE de que esta línea esté AL PRINCIPIO del archivo
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const GOOGLE_SOLAR_API_KEY = process.env.GOOGLE_SOLAR_API_KEY;
// ESTA ES LA URL CORRECTA para obtener building insights por dirección:
const GOOGLE_SOLAR_API_URL = 'https://solar.googleapis.com/v1/buildingInsights:findInsights';

// Middleware
app.use(cors());
app.use(express.json());

app.post('/get-solar-data', async (req, res) => {
    const address = req.body.address;

    if (!address) {
        return res.status(400).json({ error: 'Se requiere una dirección.' });
    }

    // --- DEBUGGING: Revisa estas salidas en tu terminal ---
    console.log('DEBUG: Valor de GOOGLE_SOLAR_API_KEY:', GOOGLE_SOLAR_API_KEY ? 'Clave cargada y presente' : 'ERROR: Clave NO cargada o vacía');
    console.log('DEBUG: Valor de GOOGLE_SOLAR_API_URL:', GOOGLE_SOLAR_API_URL);
    // --- FIN DEBUGGING ---

    // Verificación explícita si la clave API no está o es el valor por defecto
    if (!GOOGLE_SOLAR_API_KEY || GOOGLE_SOLAR_API_KEY === 'TU_CLAVE_DE_API_AQUI') {
        console.error('SERVER ERROR: La clave de API de Google Solar no está configurada correctamente en el archivo .env o usa el valor por defecto.');
        return res.status(500).json({ error: 'La clave de API no está configurada correctamente en el servidor. Revisa tu archivo .env.' });
    }

    // Construye la URL. La clave API va como parámetro de URL.
    const fullUrl = `${GOOGLE_SOLAR_API_URL}?key=${GOOGLE_SOLAR_API_KEY}`;

    // Construye el cuerpo de la solicitud JSON. La dirección va en el cuerpo.
    const requestBody = JSON.stringify({
        address: address,
        optimizationMode: 'OPTIMIZATION_ACCURATE' // O 'OPTIMIZATION_USER_COST'
    });

    // --- DEBUGGING: Revisa estas salidas en tu terminal ---
    console.log('DEBUG: URL completa construida para la llamada a fetch:', fullUrl);
    console.log('DEBUG: Cuerpo de la solicitud a enviar a la API:', requestBody);
    // --- FIN DEBUGGING ---

    try {
        // ¡¡¡ESTA ES LA FORMA CORRECTA DE HACER LA SOLICITUD POST!!!
        // Asegúrate de usar 'method: 'POST'' y el 'headers' adecuado.
        const response = await fetch(fullUrl, {
            method: 'POST', // ¡Debe ser POST!
            headers: {
                'Content-Type': 'application/json', // ¡Debe ser 'application/json'!
            },
            body: requestBody, // La dirección y el modo van en el cuerpo JSON
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API Error (respuesta de Google Solar API):', response.status, response.statusText, errorBody);
            return res.status(response.status).json({
                error: `Error de la API de Google Solar: ${response.statusText}`,
                details: errorBody.substring(0, 200) + '...'
            });
        }

        const data = await response.json();

        // Si la API devuelve un 200 OK pero sin solarPotential, significa que no hay datos para esa dirección.
        // Esto es una respuesta válida de la API, no un error 404.
        if (!data.solarPotential) {
            return res.status(200).json({ // Devolvemos 200 OK, pero con un mensaje indicando que no hay datos.
                address: data.address || address, // Usa la dirección normalizada de la API o la original
                message: 'No se encontraron datos de potencial solar para esta dirección. La dirección puede estar fuera del área de cobertura o no hay datos disponibles.',
            });
        }

        const insights = data.solarPotential;
        const simplifiedData = {
            address: data.address,
            estimatedAnnualProductionWh: insights.estimatedAnnualProductionWh,
            usableRoofAreaSqM: insights.usableRoofAreaSqM,
            peakSunHoursPerYear: insights.peakSunHoursPerYear,
        };

        if (insights.solarPanels && insights.solarPanels.length > 0) {
            const suggestedPanels = insights.solarPanels[0];
            simplifiedData.suggestedPanelCount = suggestedPanels.panelsCount;
            simplifiedData.suggestedPanelsProductionWh = suggestedPanels.graphStats.annualProductionWh;
        }

        res.json(simplifiedData);

    } catch (error) {
        console.error('SERVER ERROR (capturado en try/catch):', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});