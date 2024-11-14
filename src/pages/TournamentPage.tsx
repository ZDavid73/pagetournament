// src/pages/TournamentPage.tsx
import React from 'react';
import { useTournament } from '../hooks/useTournamentsuize';
import AddPlayerForm from '../components/AddPlayerForm';
import PlayerList from '../components/PlayerList';
import MatchList from '../components/MatchList';
import RankingList from '../components/RankingList';

const TournamentPage: React.FC = () => {
  const {
    players,
    addPlayer,
    matches,
    currentRound,
    startNextRound,
    recordMatchResult,
    isTournamentOver,
    endTournament,
    rankedPlayers,
    getNumberOfRounds // <- Usar getNumberOfRounds aquí
  } = useTournament();

  return (
    <div className="container">
      <h1>Torneo TCG - Sistema Suizo</h1>
      {!isTournamentOver ? (
        <>
          <AddPlayerForm onAddPlayer={addPlayer} />
          <PlayerList players={players} />

          {/* Muestra el número total de rondas al inicio */}
          {currentRound === 0 && (
            <>
              <p>Total de Rondas: {getNumberOfRounds()}</p>
              <button onClick={startNextRound}>Iniciar Torneo</button>
            </>
          )}

          {currentRound > 0 && (
            <>
              <h2>Ronda {currentRound} de {getNumberOfRounds()}</h2>
              <MatchList
                matches={matches[currentRound - 1]}
                currentRound={currentRound}
                onRecordResult={(matchIndex, result) =>
                  recordMatchResult(currentRound - 1, matchIndex, result)
                }
              />
              <button onClick={startNextRound}>Siguiente Ronda</button>
              <button onClick={endTournament}>Finalizar Torneo</button>
            </>
          )}
        </>
      ) : (
        <RankingList players={rankedPlayers()} />
      )}
    </div>
  );
};

export default TournamentPage;
