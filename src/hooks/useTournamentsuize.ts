// src/hooks/useTournament.ts
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  points: number;
  hasBye: boolean;
}

export interface Match {
  player1: Player;
  player2?: Player;
  result?: 'player1' | 'player2' | 'draw';
}

export function useTournament() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isTournamentOver, setIsTournamentOver] = useState(false);
  
  // Historial de emparejamientos para evitar repeticiones
  const pastPairings = new Set<string>();

  // Calcula el número total de rondas en función de la cantidad de jugadores
  const getNumberOfRounds = () => Math.ceil(Math.log2(players.length));

  const addPlayer = (name: string) => {
    setPlayers(prev => [...prev, { id: prev.length + 1, name, points: 0, hasBye: false }]);
  };

  // Crear una clave única para un par de jugadores
  const createPairKey = (id1: number, id2: number) => `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;

  const selectByePlayer = () => {
    const eligiblePlayers = players.filter(player => !player.hasBye);
    const minPoints = Math.min(...eligiblePlayers.map(player => player.points));
    const lowestScoringPlayers = eligiblePlayers.filter(player => player.points === minPoints);
    return lowestScoringPlayers[Math.floor(Math.random() * lowestScoringPlayers.length)];
  };

  const generatePairings = () => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points || Math.random() - 0.5);
    const roundMatches: Match[] = [];
    const pairedPlayers = new Set<number>();

    if (sortedPlayers.length % 2 !== 0) {
      const byePlayer = selectByePlayer();
      if (byePlayer) {
        roundMatches.push({ player1: byePlayer });
        byePlayer.points += 3;
        byePlayer.hasBye = true;
        pairedPlayers.add(byePlayer.id);
      }
    }

    for (let i = 0; i < sortedPlayers.length; i++) {
      const player1 = sortedPlayers[i];
      if (pairedPlayers.has(player1.id)) continue;

      for (let j = i + 1; j < sortedPlayers.length; j++) {
        const player2 = sortedPlayers[j];
        const pairKey = createPairKey(player1.id, player2.id);

        if (!pairedPlayers.has(player2.id) && !pastPairings.has(pairKey)) {
          roundMatches.push({ player1, player2 });
          pairedPlayers.add(player1.id);
          pairedPlayers.add(player2.id);
          pastPairings.add(pairKey);
          break;
        }
      }
    }
    setMatches(prev => [...prev, roundMatches]);
  };

  const startNextRound = () => {
    if (currentRound < getNumberOfRounds()) {
      generatePairings();
      setCurrentRound(currentRound + 1);
    } else {
      endTournament();
    }
  };

  const recordMatchResult = (round: number, matchIndex: number, result: 'player1' | 'player2') => {
    setMatches(prevMatches => {
      const updatedMatches = [...prevMatches];
      const match = updatedMatches[round][matchIndex];
      
      // Si ya hay un resultado previo, eliminar los puntos asignados al ganador anterior
      if (match.result) {
        setPlayers(prevPlayers =>
          prevPlayers.map(player => {
            if (match.result === 'player1' && player.id === match.player1.id) {
              return { ...player, points: player.points - 3 };
            }
            if (match.result === 'player2' && match.player2 && player.id === match.player2.id) {
              return { ...player, points: player.points - 3 };
            }
            return player;
          })
        );
      }

      // Actualiza el resultado con el nuevo ganador
      match.result = result;

      // Asigna puntos al nuevo ganador
      setPlayers(prevPlayers =>
        prevPlayers.map(player => {
          if (result === 'player1' && player.id === match.player1.id) {
            return { ...player, points: player.points + 3 };
          }
          if (result === 'player2' && match.player2 && player.id === match.player2.id) {
            return { ...player, points: player.points + 3 };
          }
          return player;
        })
      );

      return updatedMatches;
    });
  };

  const endTournament = () => {
    setIsTournamentOver(true);
  };

  const rankedPlayers = () => {
    return [...players].sort((a, b) => b.points - a.points);
  };

  return {
    players,
    addPlayer,
    matches,
    currentRound,
    startNextRound,
    recordMatchResult,
    isTournamentOver,
    endTournament,
    rankedPlayers,
    getNumberOfRounds
  };
}
