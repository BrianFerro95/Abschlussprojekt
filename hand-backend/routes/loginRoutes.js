import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js'; // Passe ggf. den Pfad an

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log(req.body); // Debug-Ausgabe
  
  const { nickname, password } = req.body;
  
  try {
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(401).json({ message: 'Ungültiger Nickname oder Passwort' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültiger Nickname oder Passwort' });
    }

    // Token erstellen
    const token = jwt.sign(
      { _id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Cookie setzen
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // bei Entwicklung auf false, bei Produktion auf true
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // Erfolgreiche Antwort
    res.json({ message: 'Login erfolgreich', token });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;