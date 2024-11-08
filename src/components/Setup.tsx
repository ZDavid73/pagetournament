import React from 'react';
import { useDrag } from 'react-dnd';

interface SetupProps {
  players: string[];
  addPlayer: (name: string) => void;
  resetPlayers: () => void;
}

const Setup: React.FC<SetupProps> = ({ players, addPlayer, resetPlayers }) => {
  const [newPlayer, setNewPlayer] = React.useState('');

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      addPlayer(newPlayer);
      setNewPlayer('');
    }
  };

  return (
    <div className="setup">
      <h2>Registro de Jugadores</h2>
      <input
        type="text"
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        placeholder="Nombre del jugador"
      />
      <button onClick={handleAddPlayer}>Agregar Jugador</button>
      <button onClick={resetPlayers}>Reiniciar Jugadores</button>
      <ul>
        {players.map((player, index) => (
          <DraggablePlayer key={index} name={player} />
        ))}
      </ul>
    </div>
  );
};

const DraggablePlayer: React.FC<{ name: string }> = ({ name }) => {
  const [, dragRef] = useDrag({
    type: 'PLAYER',
    item: { name },
  });

  return (
    <li ref={dragRef} className="draggable-player">
      {name}
    </li>
  );
};

export default Setup;
