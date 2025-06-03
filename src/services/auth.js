
export const login = (token) => {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('isLoggedIn', 'true');
  return true;
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('userEmail');
};

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('adminToken');
};

export const getCurrentUser = () => {
  return localStorage.getItem('userEmail');
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};