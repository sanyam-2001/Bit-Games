import { showToast } from './toast';

// Base URL for API requests
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Default request configuration
const defaultConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
};

/**
 * Helper function to handle fetch response
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Resolved with parsed JSON or rejected with error
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // If parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = response;
        throw error;
    }

    return response.json();
};

/**
 * Generic GET request function
 * @param {string} endpoint - API endpoint (relative path)
 * @param {Object} params - Query parameters
 * @param {Object} config - Additional fetch configuration
 * @param {boolean} showErrorToast - Whether to show error toast on failure
 * @returns {Promise} - Resolved with response data or rejected with error
 */
export const get = async (endpoint, params = {}, config = {}, showErrorToast = true) => {
    try {
        // Convert params to URLSearchParams
        const queryString = new URLSearchParams(params).toString();
        const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            ...defaultConfig,
            ...config,
        });

        return await handleResponse(response);
    } catch (error) {
        if (showErrorToast) {
            showToast.error(error.message || 'An error occurred');
        }
        throw error;
    }
};

/**
 * Generic POST request function
 * @param {string} endpoint - API endpoint (relative path)
 * @param {Object} data - Request body data
 * @param {Object} config - Additional fetch configuration
 * @param {boolean} showErrorToast - Whether to show error toast on failure
 * @returns {Promise} - Resolved with response data or rejected with error
 */
export const post = async (endpoint, data = {}, config = {}, showErrorToast = true) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            ...defaultConfig,
            ...config,
            body: JSON.stringify(data),
        });

        return await handleResponse(response);
    } catch (error) {
        if (showErrorToast) {
            showToast.error(error.message || 'An error occurred');
        }
        throw error;
    }
};

/**
 * Generic PUT request function
 * @param {string} endpoint - API endpoint (relative path)
 * @param {Object} data - Request body data
 * @param {Object} config - Additional fetch configuration
 * @param {boolean} showErrorToast - Whether to show error toast on failure
 * @returns {Promise} - Resolved with response data or rejected with error
 */
export const put = async (endpoint, data = {}, config = {}, showErrorToast = true) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            ...defaultConfig,
            ...config,
            body: JSON.stringify(data),
        });

        return await handleResponse(response);
    } catch (error) {
        if (showErrorToast) {
            showToast.error(error.message || 'An error occurred');
        }
        throw error;
    }
};

/**
 * Generic DELETE request function
 * @param {string} endpoint - API endpoint (relative path)
 * @param {Object} config - Additional fetch configuration
 * @param {boolean} showErrorToast - Whether to show error toast on failure
 * @returns {Promise} - Resolved with response data or rejected with error
 */
export const del = async (endpoint, config = {}, showErrorToast = true) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            ...defaultConfig,
            ...config,
        });

        return await handleResponse(response);
    } catch (error) {
        if (showErrorToast) {
            showToast.error(error.message || 'An error occurred');
        }
        throw error;
    }
};

// Example usage:
// import { get, post } from '../utils/api';
//
// // GET request
// const fetchGames = async () => {
//   try {
//     const response = await get('/api/games/list');
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch games:', error);
//   }
// };
//
// // POST request
// const createGame = async (gameData) => {
//   try {
//     const response = await post('/api/games/create', gameData);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to create game:', error);
//   }
// }; 