// src/components/MatchList.tsx
import React, { useState, useEffect } from 'react';
import { Match } from '../hooks/useTournamentsuize';

interface MatchListProps {
  matches: Match[];
  currentRound: number;
  onRecordResult: (matchIndex: number, result: 'player1' | 'player2') => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, currentRound, onRecordResult }) => {
  const [selectedResults, setSelectedResults] = useState<(string | null)[]>([]);

  // Resetea el estado de selección al comenzar una nueva ronda
  useEffect(() => {
    setSelectedResults(matches.map(() => null));
  }, [currentRound, matches]);

  // Maneja la selección del resultado y permite corrección
  const handleSelectResult = (matchIndex: number, result: 'player1' | 'player2') => {
    onRecordResult(matchIndex, result); // Actualiza el puntaje en el hook principal
    setSelectedResults(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[matchIndex] = result;
      return updatedResults;
    });
  };

  return (
    <div>
      <h2>Emparejamientos de la Ronda {currentRound}</h2>
      {matches.map((match, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          {match.player2 ? (
            <>
              <p>
                {match.player1.name} vs {match.player2.name}
              </p>
              <button
                className={selectedResults[index] === 'player1' ? 'selected' : ''}
                onClick={() => handleSelectResult(index, 'player1')}
              >
                Gana {match.player1.name}
              </button>
              <button
                className={selectedResults[index] === 'player2' ? 'selected' : ''}
                onClick={() => handleSelectResult(index, 'player2')}
              >
                Gana {match.player2.name}
              </button>
            </>
          ) : (
            <p>{match.player1.name} tiene un Bye (gana automáticamente)</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MatchList;
