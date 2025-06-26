// export let API_BASE_URL = null;

// switch (process.env.NODE_ENV) {
//   // to run or buld sandbox environment change port to 5000 and add /api-sandbox
//   // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
//   // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3001/api-sandbox`;
//   // your local development api endpoint
//   case "development":
//     API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3002/persona/api`;
//     break;
//   case "production":
//     // use this if backend is reversed proxy and front end is hosted elsewhere (adjust in cors)
//     API_BASE_URL = `${window.location.protocol}//${window.location.hostname}/persona/api`;
//     // use this if front end is hosted by express server itself on :3000/NDC_AMS/
//     // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`; //
//     break;
// }

let apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl || apiBaseUrl === "") {
  switch (import.meta.env.MODE) {
    case "development":
      apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:3002/persona/api`;
      break;
    case "production":
      apiBaseUrl = `${window.location.protocol}//${window.location.hostname}/persona/api`;
      break;
    default:
      apiBaseUrl = "http://localhost:3002/persona/api";
  }
}

export const API_BASE_URL = apiBaseUrl;
