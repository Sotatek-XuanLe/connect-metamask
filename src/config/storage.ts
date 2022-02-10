import Cookies from "js-cookie";
// cookie
export const getCookieStorage = (key: string): any => Cookies.get(key);

const getRootDomain = (domain: string): string => {
  if (!domain) {
    return domain;
  }

  const parts: string[] = domain.split(".");
  if (parts.length >= 2) {
    return parts.slice(parts.length - 2).join(".");
  }
  return domain;
};

export const setOneCookieStorage = (
  key: string,
  data: string | number | any
): any => {
  const domain = getRootDomain(window.location.hostname);
  Cookies.set(key, typeof data === "object" ? JSON.stringify(data) : data, {
    domain,
  });
};
export const removeOneCookieStorage = (key: string): any => {
  const domain = getRootDomain(window.location.hostname);
  return Cookies.remove(key, { domain });
};
// *** localstorage
export const getLocalStorage = (key: string): any => localStorage.getItem(key);
export const setOneLocalStorage = (
  key: string,
  data: string | number | any
): any => {
  const isDataTypeObject = typeof data === "object";
  localStorage.setItem(key, isDataTypeObject ? JSON.stringify(data) : data);
};
export const removeLocalStorage = (key: string): any =>
  localStorage.removeItem(key);

