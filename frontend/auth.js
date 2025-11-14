// auth.js

const API_URL = '/api'; // O la URL de tu backend

// --- Token Management ---

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
};
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// --- API Calls ---

const refreshToken = async () => {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
        console.log('No refresh token available.');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/client/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: currentRefreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const { accessToken } = await response.json();
        setTokens(accessToken);
        console.log('Token refreshed successfully.');
        return accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Si el refresh token falla (expirado/inválido), desloguear al usuario
        logout();
        return null;
    }
};

const fetchWithAuth = async (url, options = {}) => {
    let accessToken = getAccessToken();

    if (!accessToken) {
        console.log('No access token, redirecting to login.');
        logout(); // O redirigir a la página de login
        return;
    }

    // Añadir el token al header de autorización
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    let response = await fetch(url, options);

    // Si la respuesta es 401 (No autorizado), el token puede haber expirado
    if (response.status === 401) {
        console.log('Access token expired. Attempting to refresh...');
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
            // Reintentar la petición original con el nuevo token
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, options);
        } else {
            // Si no se pudo refrescar, no continuar
            console.log('Could not refresh token. Logging out.');
            return; // La función de refreshToken ya se encarga de desloguear
        }
    }

    return response;
};

const login = async (name, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/client/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        const { accessToken, refreshToken: newRefreshToken, user } = await response.json();
        setTokens(accessToken, newRefreshToken);
        
        // Aquí puedes redirigir al usuario o actualizar la UI
        console.log('Login successful!', user);
        window.location.href = '/client-dashboard.html'; // Ejemplo de redirección

    } catch (error) {
        console.error('Login failed:', error);
        // Mostrar error en la UI
    }
};

const logout = () => {
    clearTokens();
    // Redirigir a la página de login
    console.log('User logged out.');
    window.location.href = '/index.html'; 
};

// Ejemplo de cómo usar fetchWithAuth para una petición protegida
const getClientData = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/clients/some-protected-route`);
        
        if (response && response.ok) {
            const data = await response.json();
            console.log('Protected data:', data);
        } else {
            console.log('Failed to fetch protected data after retry.');
        }
    } catch (error) {
        console.error('Error fetching protected data:', error);
    }
};
