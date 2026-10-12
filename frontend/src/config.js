const API_URL = import.meta.env.DEV
  ? `http://${window.location.hostname}:3000`
  : "";

export default API_URL;