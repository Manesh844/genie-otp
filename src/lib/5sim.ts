
'use server';

// This is a server-only module. Ensure API keys are not exposed to the client.

// The API key is securely stored in environment variables.
// It will be null if not set in the .env file.
const API_KEY = process.env.FIVESIM_API_KEY;

// Use the API configuration from the database, falling back to env vars if needed.
// This allows dynamic API management from the admin panel.
async function getApiConfig() {
    // In a real scenario, you'd fetch this from your database
    // For now, we'll prefer the environment variable.
    if (API_KEY) {
        return {
            apiKey: API_KEY,
            apiUrl: 'https://api1.5sim.net/v1' // Using v1 for JSON responses
        };
    }
    // TODO: Add logic to fetch active API config from Firestore
    return null;
}

async function makeApiRequest(path: string) {
    const config = await getApiConfig();
    if (!config) {
        throw new Error('5SIM API key is not configured.');
    }

    const headers = {
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json',
    };
    
    const url = `${config.apiUrl}${path}`;
    
    const response = await fetch(url, { headers });

    if (!response.ok) {
        const errorBody = await response.text(); // 5sim can return plain text errors
        let errorMessage = errorBody;
        try {
            // Try to parse as JSON for more structured errors
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || errorJson.msg || JSON.stringify(errorJson);
        } catch (e) {
            // It wasn't JSON, stick with the plain text
        }
        console.error(`5sim API Error on path ${path}: ${response.status} - ${errorMessage}`);
        throw new Error(errorMessage);
    }
    
    // Some successful 5sim responses can have empty bodies
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
}


export async function buyNumber(country: string, product: string, operator: string = 'any') {
    try {
        const data = await makeApiRequest(`/user/buy/activation/${country}/${operator}/${product}`);
        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred during purchase.";
        return { success: false, message };
    }
}

export async function checkOrder(orderId: number | string) {
    try {
        const data = await makeApiRequest(`/user/check/${orderId}`);
        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred checking order.";
        return { success: false, message };
    }
}

export async function cancelOrder(orderId: number | string) {
     try {
        const data = await makeApiRequest(`/user/cancel/${orderId}`);
        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred canceling order.";
        return { success: false, message };
    }
}
