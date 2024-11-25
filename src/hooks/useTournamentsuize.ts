// src/hooks/useTournament.ts
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  points: number;
}

interface Match {
  player1: Player;
  player2: Player;
  result: "player1" | "player2" | "draw" | null;
}

export const useTournament = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isTournamentOver, setIsTournamentOver] = useState(false);
  const [isTournamentStarted, setIsTournamentStarted] = useState(false);

  // Añadir jugador con ID único
  const addPlayer = (name: string) => {
    if (!isTournamentStarted) {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: prevPlayers.length + 1, name, points: 0 },
      ]);
    }
  };

  // Generar partidos para una ronda
  const generateMatches = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const roundMatches: Match[] = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) {
        roundMatches.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          result: null,
        });
      } else {
        roundMatches.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i], // Bye
          result: "player1",
        });
        shuffledPlayers[i].points += 3; // Bye automático
      }
    }

    setMatches((prevMatches) => [...prevMatches, roundMatches]);
  };

  // Registrar el resultado de un partido
  const recordMatchResult = (
    roundIndex: number,
    matchIndex: number,
    result: "player1" | "player2" | "draw"
  ) => {
    const newMatches = [...matches];
    const match = newMatches[roundIndex][matchIndex];

    if (!match.result) {
      match.result = result;
      if (result === "player1") match.player1.points += 3;
      if (result === "player2") match.player2.points += 3;
    }

    setMatches(newMatches);
    setPlayers((prevPlayers) => [...prevPlayers]);
  };

  // Corregir resultado de un partido
  const clearMatchResult = (roundIndex: number, matchIndex: number) => {
    const newMatches = [...matches];
    const match = newMatches[roundIndex][matchIndex];

    if (match.result) {
      if (match.result === "player1") match.player1.points -= 3;
      if (match.result === "player2") match.player2.points -= 3;
      match.result = null;
    }

    setMatches(newMatches);
    setPlayers((prevPlayers) => [...prevPlayers]);
  };

  // Iniciar una nueva ronda
  const startNextRound = () => {
    if (!isTournamentStarted) setIsTournamentStarted(true);

    if (currentRound >= getNumberOfRounds()) {
      setIsTournamentOver(true);
      return;
    }

    setCurrentRound((prevRound) => prevRound + 1);
    generateMatches();
  };

  // Finalizar el torneo manualmente
  const endTournament = () => {
    setIsTournamentOver(true);
  };

  // Obtener jugadores clasificados
  const rankedPlayers = () => {
    return [...players].sort((a, b) => b.points - a.points);
  };

  // Calcular el número de rondas
  const getNumberOfRounds = () => {
    return Math.ceil(Math.log2(players.length));
  };

  return {
    players,
    addPlayer,
    matches,
    currentRound,
    startNextRound,
    recordMatchResult,
    clearMatchResult,
    isTournamentOver,
    isTournamentStarted,
    endTournament,
    rankedPlayers,
    getNumberOfRounds,
  };
};
