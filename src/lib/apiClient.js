/**
 * Production-grade API Client for Khaana Bank Trust
 * Handles cross-origin communication between Vercel and Render.
 */

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);
    
    // Attempt to parse JSON even on error status codes
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle cases where the server might return HTML (e.g. 500 error page)
      const text = await response.text();
      console.error('Expected JSON, got:', text.substring(0, 100));
      return {
        success: false,
        error: 'The server returned an unexpected response. Please try again later.',
        status: response.status
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `Request failed with status ${response.status}`,
        status: response.status,
        data: data
      };
    }

    return {
      success: true,
      data: data,
      message: data.message || 'Success',
      status: response.status
    };
  } catch (error) {
    console.error('API Request Failed:', error);
    
    // User-friendly messages for common network errors
    let userError = 'Unable to connect to the server. Please check your internet connection.';
    if (error.name === 'AbortError') userError = 'Request timed out. Please try again.';
    if (error.message === 'Failed to fetch') userError = 'The assistant is currently offline or taking a moment to wake up. Please try again in 30 seconds.';

    return {
      success: false,
      error: userError,
      originalError: error.message
    };
  }
}
