import React from 'react';

interface Player {
  id: number;
  name: string;
  points: number;
}

interface RankingListProps {
  players: Player[];
}

const RankingList: React.FC<RankingListProps> = ({ players }) => {
  return (
    <div className="ranking-list">
      <h3>Clasificación Final</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.points} puntos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;
