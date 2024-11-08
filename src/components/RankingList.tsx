// src/components/RankingList.tsx
import React from 'react';

interface RankingListProps {
  players: { id: number; name: string; points: number }[];
}

const RankingList: React.FC<RankingListProps> = ({ players }) => {
  return (
    <div>
      <h2>Ranking Final</h2>
      <ol>
        {players.map(player => (
          <li key={player.id}>
            {player.name} - Puntos: {player.points}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RankingList;
