import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './EventRegister.css';
import { ArrowLeft } from 'lucide-react';

const EventRegister = () => {
  const { id } = useParams(); // ID aus URL
  const location = useLocation(); // Event aus Route state
  const navigate = useNavigate();

  const event = location.state?.event; // Falls vom EventDetail
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bitte zuerst einloggen, um dich anzumelden.');
      setLoading(false);
      return;
    }

    try {
      // API-Anfrage zum Event joinen
      await fetch(`http://localhost:5000/api/events/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess('Du hast dich erfolgreich angemeldet! 🎉');
      setForm({ name: '', email: '', comment: '' });
    } catch (err) {
      setError('Es gab ein Problem bei der Anmeldung.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <p style={{ padding: '2rem' }}>Event nicht gefunden oder direkt aufgerufen. Bitte über die Eventseite öffnen.</p>;
  }

  return (
    <div className="event-register-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" />
        Zurück
      </button>

      {/* Bild */}
      <div className="image-wrapper">
        <img src={event.image} alt="Event" className="event-image-horizontal" />
      </div>

      <div className="event-register-header">
        <h1 className="event-register-title">Anmeldung für: {event.title}</h1>
        <p style={{ fontStyle: 'italic' }}>{event.date} – {event.location}</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Dein Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Deine E-Mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="comment"
          placeholder="Kommentar (optional)"
          value={form.comment}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Wird gesendet...' : 'Anmelden'}
        </button>
      </form>

      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default EventRegister;