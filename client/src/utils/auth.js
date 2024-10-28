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
