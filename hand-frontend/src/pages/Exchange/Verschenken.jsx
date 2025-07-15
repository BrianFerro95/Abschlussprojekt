import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";
import "./Verschenken.css"; // Neue CSS-Datei für Verschenken

export default function Verschenken() {
  const { currentUser } = useContext(AuthContext);
  const [verschenkenItems, setVerschenkenItems] = useState([]);
  
  // Für das Popup
  const [showModal, setShowModal] = useState(false);
  
  // Form-Daten im Popup
  const [form, setForm] = useState({ title: '', description: '', picture: null });
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/exchange?category=verschenken");
        const data = await res.json();
        if (data.success) {
          setVerschenkenItems(data.data);
        } else {
          console.error("❌ Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("❌ Fehler beim Abrufen:", error);
      }
    };

    fetchItems();
  }, []);

  const handleContact = (itemId) => {
    console.log("📞 Kontaktaufnahme zu Item:", itemId);
  };

  // Formular im Popup: Änderungen
  const handleModalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      setForm((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Beitrag im Popup senden
  const handleCreateOffer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bitte zuerst einloggen.');
      return;
    }
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("category", "verschenken");
    if (form.picture) payload.append("picture", form.picture);
    try {
      const res = await fetch("http://localhost:3000/api/exchange", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Angebot erfolgreich erstellt!");
        setShowModal(false);
        // Optional: Neue Beiträge sofort anzeigen
        setVerschenkenItems((prev) => [data.data, ...prev]);
      } else {
        alert("❌ Fehler: " + data.message);
      }
    } catch (err) {
      alert("❌ Fehler beim Erstellen");
    }
  };

  return (
  <>
    
    {/* Bestehende Seite */}
    <div className="exchange-page verschenken">
      <h2 className="exchange-title">Verschenken in deiner Nähe</h2>

{/* Button zum Öffnen des Popups */}
    <button onClick={() => setShowModal(true)} className="create-offer-btn">
      Angebot erstellen
          </button>
          
      <div className="exchange-list">
        {verschenkenItems.map((item, index) => (
          <div
            className={`exchange-card full-width-card ${
              index % 2 === 0 ? "left" : "right"
            }`}
            key={item._id}
          >
            {item.picture && (
              <img src={item.picture} alt={item.title} />
            )}
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.author?.nickname && (
                <p><strong>Anbieter:</strong> {item.author.nickname}</p>
              )}
              {currentUser && (
                <button
                  className="contact-button"
                  onClick={() => handleContact(item._id)}
                >
                  Kontakt aufnehmen
                </button>
              )}
              
            </div>
          </div>
        ))}
      </div>
    </div>

    


    {/* Modal Popup für Angebot erstellen */}
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>Angebot erstellen</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateOffer(); }}>
            <input
              type="text"
              name="title"
              placeholder="Titel"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              name="description"
              placeholder="Beschreibung"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, picture: e.target.files[0] })
              }
            />
            <button type="submit">Beitrag erstellen</button>
            <button type="button" onClick={() => setShowModal(false)}>Abbrechen</button>
          </form>
        </div>
      </div>
    )}
  </>
)}