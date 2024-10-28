import Cookies from 'js-cookie';

export const checkAuth = () => {
  const token = Cookies.get('access_token');
  if (!token) return false;
  
  try {
    // Basic check if token is a valid JWT format
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      Cookies.remove('access_token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    Cookies.remove('access_token');
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const currentToken = Cookies.get('access_token');
    if (!currentToken) return false;

    const res = await fetch('https://geomancy-blog.onrender.com/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`
      },
      credentials: 'include'
    });

    if (!res.ok) {
      Cookies.remove('access_token');
      return false;
    }

    const data = await res.json();
    if (data.token) {
      Cookies.set('access_token', data.token, { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

export const getAuthHeader = () => {
  const token = Cookies.get('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const makeAuthRequest = async (url, options = {}) => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new Error('Authentication failed');
    }
    return makeAuthRequest(url, options);
  }

  return response;
};
