// src/components/MatchList.tsx
import React, { useState, useEffect } from 'react';
import { Match } from '../hooks/useTournamentsuize';

interface MatchListProps {
  matches: Match[];
  currentRound: number;
  onRecordResult: (matchIndex: number, result: 'player1' | 'player2') => void;
  onClearResult: (matchIndex: number) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, currentRound, onRecordResult, onClearResult }) => {
  const [selectedResults, setSelectedResults] = useState<(string | null)[]>([]);

  useEffect(() => {
    setSelectedResults(matches.map(() => null));
  }, [currentRound, matches]);

  const handleSelectResult = (matchIndex: number, result: 'player1' | 'player2') => {
    onRecordResult(matchIndex, result);
    setSelectedResults(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[matchIndex] = result;
      return updatedResults;
    });
  };

  const handleCorrection = (matchIndex: number) => {
    onClearResult(matchIndex);
    setSelectedResults(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[matchIndex] = null;
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
              <button
                onClick={() => handleCorrection(index)}
                disabled={selectedResults[index] === null}
              >
                Corregir
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
