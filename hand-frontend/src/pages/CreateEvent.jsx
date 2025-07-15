import React, { useState } from 'react';


const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token'); // Token holen
    if (!token) {
      alert('Bitte zuerst einloggen!');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token einsetzen
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Event wurde erfolgreich erstellt!');
        // Optional: Seite aktualisieren oder redirecten
      } else {
        alert('Fehler beim Erstellen des Events.');
      }
    } catch (err) {
      alert('Netzwerkfehler.');
    }
  };

  return (
    <div style={{ margin: '20px', maxWidth: '600px' }}>
      <h2>Neues Event erstellen</h2>
      <input placeholder="Titel" name="title" value={formData.title} onChange={handleChange} />
      <input placeholder="Datum (YYYY-MM-DD)" type="date" name="date" value={formData.date} onChange={handleChange} />
      <input placeholder="Ort" name="location" value={formData.location} onChange={handleChange} />
      <textarea placeholder="Beschreibung" name="description" value={formData.description} onChange={handleChange} rows={4} />
      {/* Optional: Bild-URL */}
      <input placeholder="Bild-URL" name="image" value={formData.image} onChange={handleChange} />

      <button style={{ marginTop: '15px' }} onClick={handleSubmit}>Event erstellen</button>
    </div>
  );
};

export default CreateEvent;