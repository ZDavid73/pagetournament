// src/components/MatchList.tsx
import React, { useState, useEffect } from 'react';
import { Match } from '../hooks/useTournamentsuize';

interface MatchListProps {
  matches: Match[];
  currentRound: number;
  onRecordResult: (matchIndex: number, result: 'player1' | 'player2' | 'draw') => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, currentRound, onRecordResult }) => {
  // Estado para almacenar el resultado seleccionado de cada partida por ronda
  const [selectedResults, setSelectedResults] = useState<(string | null)[]>([]);

  // Resetear resultados seleccionados al comenzar una nueva ronda
  useEffect(() => {
    setSelectedResults(matches.map(() => null)); // Resetea el estado al tamaño de las partidas en la ronda actual
  }, [currentRound, matches]);

  // Manejar selección de resultado
  const handleSelectResult = (matchIndex: number, result: 'player1' | 'player2' | 'draw') => {
    if (selectedResults[matchIndex] === null) {
      onRecordResult(matchIndex, result);
      setSelectedResults(prevResults => {
        const updatedResults = [...prevResults];
        updatedResults[matchIndex] = result;
        return updatedResults;
      });
    }
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
                disabled={selectedResults[index] !== null}
              >
                Gana {match.player1.name}
              </button>
              <button
                className={selectedResults[index] === 'player2' ? 'selected' : ''}
                onClick={() => handleSelectResult(index, 'player2')}
                disabled={selectedResults[index] !== null}
              >
                Gana {match.player2.name}
              </button>
              <button
                className={selectedResults[index] === 'draw' ? 'selected' : ''}
                onClick={() => handleSelectResult(index, 'draw')}
                disabled={selectedResults[index] !== null}
              >
                Empate
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
