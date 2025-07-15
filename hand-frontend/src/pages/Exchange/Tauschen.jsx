import React, { useContext, useState, useEffect } from "react";
import "./Exchange.css";
import { AuthContext } from "../../context/AuthContext";
import "./Tauschen.css"; // Deine CSS-Datei für Tauschen, plus Modal-Styles

export default function Tauschen() {
  const { currentUser } = useContext(AuthContext);
  const [tauschenItems, setTauschenItems] = useState([]);
  const [showModal, setShowModal] = useState(false); // Für das Popup
  const [form, setForm] = useState({ title: '', description: '', tauschGegen: '', picture: null });
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/exchange?category=tauschen");
        const data = await res.json();
        if (data.success) {
          setTauschenItems(data.data);
        } else {
          console.error("Fehler beim Laden:", data.message);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen:", error);
      }
    };
    fetchItems();
  }, []);

  const handleContact = (itemId) => {
    console.log("Kontaktaufnahme zu Item:", itemId);
  };

  const handleCreateOffer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bitte zuerst einloggen.');
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("category", "tauschen");
    payload.append("tauschGegen", form.tauschGegen);
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
        setForm({ title: '', description: '', tauschGegen: '', picture: null });
        setTauschenItems(prev => [data.data, ...prev]);
      } else {
        alert("❌ Fehler: " + data.message);
      }
    } catch (err) {
      alert("❌ Fehler beim Erstellen");
    }
  };

  return (
    <>
      
      

      {/* Liste der Angebote */}
      <div className="exchange-page tauschen">
        <h2 className="exchange-title">Tauschen in deiner Nähe</h2>

        {/* Button zum Öffnen des Popups */}
      <button onClick={() => setShowModal(true)} className="create-offer-btn">
        Angebot erstellen
      </button>

        <div className="exchange-list">
          {tauschenItems.map((item, index) => (
            <div
              className={`exchange-card tauschen-card full-width-card ${
                index % 2 === 0 ? "left" : "right"
              }`}
              key={item._id}
            >
              {item.picture && (
                <img src={`http://localhost:3000/uploads/${item.picture}`} alt={item.title} />
              )}
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>
                  <strong>Tausche gegen:</strong> {item.tauschGegen || "Keine Angabe"}
                </p>
                {item.author?.nickname && (
                  <p><strong>Anbieter:</strong> {item.author.nickname}</p>
                )}
                {currentUser && (
                  <button className="contact-button" onClick={() => handleContact(item._id)}>
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