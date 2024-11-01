export const makeAuthRequest = async (url, options = {}) => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 401) {
    Cookies.remove('access_token');
    window.location.href = '/sign-in';
    throw new Error('Authentication expired');
  }

  return response;
}; 