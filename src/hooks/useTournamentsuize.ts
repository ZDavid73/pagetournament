// src/hooks/useTournament.ts
import { useState } from 'react';

interface Player {
  name: string;
  points: number;
}

interface Match {
  player1: Player;
  player2: Player;
  result: "player1" | "player2" | "draw" | null; // null significa que no se ha registrado resultado
}

export const useTournament = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isTournamentOver, setIsTournamentOver] = useState<boolean>(false);
  const [isTournamentStarted, setIsTournamentStarted] = useState<boolean>(false);

  // Añadir jugador (solo si el torneo no ha comenzado)
  const addPlayer = (name: string) => {
    if (!isTournamentStarted) {
      setPlayers((prevPlayers) => [...prevPlayers, { name, points: 0 }]);
    }
  };

  // Crear partidos de la ronda
  const generateMatches = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5); // Aleatorizar
    const roundMatches: Match[] = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) {
        roundMatches.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          result: null,
        });
      } else {
        // Jugador sin oponente (Bye)
        roundMatches.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i], // El mismo jugador "gana"
          result: "player1",
        });
      }
    }
    setMatches((prevMatches) => [...prevMatches, roundMatches]);
  };

  // Registrar el resultado del partido
  const recordMatchResult = (roundIndex: number, matchIndex: number, result: "player1" | "player2" | "draw") => {
    const newMatches = [...matches];
    const match = newMatches[roundIndex][matchIndex];

    if (match.result === null) {
      // Solo registrar si no se ha registrado un resultado
      match.result = result;
      if (result === "player1") {
        match.player1.points += 3;
      } else if (result === "player2") {
        match.player2.points += 3;
      }
    }
    setMatches(newMatches);
    setPlayers((prevPlayers) => [...prevPlayers]);
  };

  // Corregir resultado de un partido
  const clearMatchResult = (roundIndex: number, matchIndex: number) => {
    const newMatches = [...matches];
    const match = newMatches[roundIndex][matchIndex];

    if (match.result) {
      // Restaurar los puntos de los jugadores al resultado anterior
      if (match.result === "player1") {
        match.player1.points -= 3;
      } else if (match.result === "player2") {
        match.player2.points -= 3;
      }

      match.result = null; // Eliminar el resultado
    }
    setMatches(newMatches);
    setPlayers((prevPlayers) => [...prevPlayers]);
  };

  // Iniciar la siguiente ronda
  const startNextRound = () => {
    if (isTournamentOver) return; // No avanzar si el torneo ya terminó

    if (!isTournamentStarted) {
      setIsTournamentStarted(true); // Marcar el torneo como iniciado
    }

    // Si alcanzamos el máximo de rondas, finalizamos el torneo
    const maxRounds = getNumberOfRounds();
    if (currentRound >= maxRounds) {
      setIsTournamentOver(true);
      return;
    }

    setCurrentRound((prevRound) => prevRound + 1);
    generateMatches();
  };

  // Finalizar torneo manualmente
  const endTournament = () => {
    setIsTournamentOver(true);
  };

  // Obtener jugadores clasificados
  const rankedPlayers = () => {
    return [...players].sort((a, b) => b.points - a.points);
  };

  // Obtener el número de rondas necesarias según el sistema suizo
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
