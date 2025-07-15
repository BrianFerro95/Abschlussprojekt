import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000/api', // Passe die URL an, falls nötig
  withCredentials: true, // Wenn du Cookies für die Authentifizierung verwendest
});