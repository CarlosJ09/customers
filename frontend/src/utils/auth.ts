export const getToken = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setToken = (key: string, token: string): void => {
  localStorage.setItem(key, token);
};

export const removeToken = (key: string): void => {
  localStorage.removeItem(key);
};
