import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import logo from '../assets/logo.png';
import register from '../assets/animation/Animation - register.json';
import Lottie from 'lottie-react';



const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    district: '',
    state: '',
    zip: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  // Einfaches Feld-Update
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // Validierung aller Felder (inkl. State)
  const validate = () => {
    const errors = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (!val.trim()) {
        errors[key] = 'Dieses Feld darf nicht leer sein.';
      } else {
        if (key === 'email' && !/\S+@\S+\.\S+/.test(val)) {
          errors[key] = 'Ungültige E-Mail-Adresse.';
        }
        if (key === 'zip' && !/^\d{4,5}$/.test(val)) {
          errors[key] = 'Ungültige PLZ.';
        }
      }
    });
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
            lastName: formData.lastName,
          addresses: {
            
            street: formData.street,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            zip: formData.zip, 
          },
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        if(onSuccess) onSuccess(data);
        navigate('/login');
      } else {
        setMessage(`:x: Fehler: ${data.message || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Fehler beim Registrieren:', error);
      setMessage(':x: Serverfehler. Bitte später erneut versuchen.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const fieldLabels = {
    nickname: 'Spitzname',
    email: 'E-Mail',
    password: 'Passwort',
    firstName: 'Vorname',
    lastName: 'Nachname',
    street: 'Straße',
    city: 'Stadt',
    district: 'Landkreis oder Stadtteil',
    state: 'Bundesland',
    zip: 'PLZ',
  };
  return (
    <div className="register-section">
      <div className="register-form-container">
        {/* Animation on the left */}
        <div className="animation-container">
          <Lottie animationData={register} loop={true} className="register-animation" />
        </div>
        {/* Form on the right */}
        <div className="form-card">
          {/* Header with logo and title - moved above the form */}
          <h2 className="register-title"> Registrierung</h2>
          <form onSubmit={handleSubmit} className="register-form-grid" noValidate>
    {Object.entries(fieldLabels).map(([key, label]) => (
      <label key={key} className="register-label">
        {label}:
        <input
          name={key}
          type={
            key === 'email' ? 'email'
            : key === 'password' ? 'password'
            : key === 'zip' ? 'number'
            : 'text'
          }
          value={formData[key]}
          onChange={handleChange}
          autoComplete="off"
          className={`register-input ${formErrors[key] ? 'error' : ''}`}
          required
        />
        {formErrors[key] && (
          <p className="register-warning">{formErrors[key]}</p>
        )}
      </label>
    ))}
    <button type="submit" disabled={isSubmitting} className="register-button">
      {isSubmitting ? 'Wird gesendet…' : 'Registrieren'}
    </button>
    {message && <p className="register-warning">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
export default RegisterForm;