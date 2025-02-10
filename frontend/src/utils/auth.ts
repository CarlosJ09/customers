export const getLocalStorageItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setLocalStorageItem = (key: string, token: string): void => {
  localStorage.setItem(key, token);
};

export const removeLocalStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};
