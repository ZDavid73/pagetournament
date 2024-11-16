// src/components/PlayerList.tsx
import React from 'react';

interface Player {
  id: number;
  name: string;
  points: number;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div>
      <h2>Lista de Jugadores</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name} - Puntos: {player.points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
