const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('mariya_admin_token');
  const headers = {
    ...options.headers
  };

  // If payload is not FormData, default to JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  let data = {};
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`API endpoint not found (404). If deployed on Vercel/Render, please check that your backend is running and VITE_API_BASE_URL environment variable is set.`);
      } else if (response.status >= 500) {
        throw new Error(`Backend server error (${response.status}). Check your deployment server/function logs.`);
      }
    }
  }

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? data.errors.map(e => e.message).join(', ') : `Server returned status ${response.status}`);
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const api = {
  get: (url) => apiRequest(url, { method: 'GET' }),
  post: (url, body) => apiRequest(url, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (url, body) => apiRequest(url, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (url, body) => apiRequest(url, { method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (url) => apiRequest(url, { method: 'DELETE' })
};
