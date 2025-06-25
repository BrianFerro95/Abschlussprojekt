import express from 'express';
import User from '../models/userSchema.js'; // Passe ggf. den Pfad/Dateinamen an
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Funktion zur Adresse-Validierung mit Google Maps API
const validateAddress = async (adress) => {
  const { street, city, state, zip } = adress;
  const addressString = `${street}, ${city}, ${state} ${zip}`;
  console.log('Starte Address Validierung für:', addressString);
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // in deiner .env setzen

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    return false; // Adresse ist ungültig
  }
  return true;
};

// Route für Nutzerprofil (von Frontend auf /api/users/me)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler beim Laden der Nutzerdaten' });
  }
});

// Route zum Aktualisieren des Profils mit Adresse-Validierung
router.put('/:id', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }

  const updates = {};

  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.email !== undefined) updates.email = req.body.email;

  if (req.body.adress !== undefined) {
    // Adresse validieren
    const isValidAddress = await validateAddress(req.body.adress);
    console.log('Adresse-Validierung bei Update:', isValidAddress);
    if (!isValidAddress) {
      return res.status(400).json({ message: 'Ungültige Adresse' });
    }
    updates.adress = req.body.adress;
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Profils' });
  }
});

// Registrierung in `authRoutes.js` prüfen wir bereits die Adresse vor der User-Erstellung, siehe vorherige Antwort

export default router;