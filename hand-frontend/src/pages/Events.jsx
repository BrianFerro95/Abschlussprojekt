import React, { useState, useEffect } from "react";
import "./Events.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token'); // Falls du Auth nutzt
      try {
        const response = await fetch('http://localhost:3000/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Fehler beim Laden der Events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="events-container">
      <div className="blog-header">
        <h1>Nachbarschafts-Events</h1>
        <p>
          Entdecke, was in deiner Nachbarschaft passiert – von Sommerfesten bis
          Sportevents!
        </p>
      </div>

      <div className="event-cards">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event._id || event.id}>
              <img src={event.image} alt={event.title} />
              <div className="event-content">
                <h2>{event.title}</h2>
                <p className="event-date">
                  {event.date} – {event.location}
                </p>
                <p>{event.description}</p>
                <button
                  className="event-button"
                  onClick={() =>
                    navigate(`/events/${event._id}`, { state: { event } })
                  }
                >
                  Ich mache mit!
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Lade Events...</p>

          
        )}

        <button onClick={() => navigate('/create-event')} className="create-event-btn">
          Neues Event erstellen
        </button>

      </div>
    </div>
  );
};



export default Events;