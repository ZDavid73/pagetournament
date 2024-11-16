// src/components/MatchList.tsx
import React from 'react';

interface Player {
  name: string;
  points: number;
}

interface Match {
  player1: Player;
  player2: Player;
  result: "player1" | "player2" | "draw" | null;
}

interface MatchListProps {
  matches: Match[];
  currentRound: number;
  onRecordResult: (matchIndex: number, result: "player1" | "player2" | "draw") => void;
  onClearResult: (matchIndex: number) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, onRecordResult, onClearResult }) => {
  return (
    <div className="match-list">
      <h3>Ronda {matches.length > 0 && matches[0].player1.name} - Resultados</h3>
      {matches.map((match, index) => (
        <div key={index} className="match">
          <p>
            {match.player1.name} vs {match.player2.name}
          </p>
          {match.result === null ? (
            <>
              <button onClick={() => onRecordResult(index, "player1")}>Ganó {match.player1.name}</button>
              <button onClick={() => onRecordResult(index, "player2")}>Ganó {match.player2.name}</button>
              <button onClick={() => onRecordResult(index, "draw")}>Empate</button>
            </>
          ) : (
            <p>Resultado: {match.result === "player1" ? match.player1.name : match.result === "player2" ? match.player2.name : "Empate"}</p>
          )}
          <button onClick={() => onClearResult(index)}>Corregir</button>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
