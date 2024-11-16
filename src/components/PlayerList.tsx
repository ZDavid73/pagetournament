// src/components/PlayerList.tsx
import React from 'react';

interface Player {
  name: string;
  points: number;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="player-list">
      <h3>Lista de Jugadores</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.name} - {player.points} puntos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
