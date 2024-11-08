// src/components/AddPlayerForm.tsx
import React, { useState } from 'react';

interface AddPlayerFormProps {
  onAddPlayer: (name: string) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPlayer(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <input
        type="text"
        placeholder="Nombre del jugador"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Agregar Jugador</button>
    </form>
  );
};

export default AddPlayerForm;
