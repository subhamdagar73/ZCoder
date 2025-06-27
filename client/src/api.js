const BASE = process.env.REACT_APP_API_URL;

export const api = (path, options = {}) =>
  fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }).then(res => res.json());
