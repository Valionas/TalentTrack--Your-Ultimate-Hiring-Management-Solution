// src/utils/authUtils.ts

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token; // returns true if token exists, false otherwise
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
};
