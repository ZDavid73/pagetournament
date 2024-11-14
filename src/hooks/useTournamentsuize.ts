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
  player2?: Player; // El jugador 2 puede ser undefined si es un bye
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

  // Añadir un jugador al torneo
  const addPlayer = (name: string) => {
    setPlayers(prev => [...prev, { id: prev.length + 1, name, points: 0, hasBye: false }]);
  };

  // Crear una clave única para un par de jugadores para evitar repeticiones
  const createPairKey = (id1: number, id2: number) => `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;

  // Seleccionar el jugador con menos puntos para el bye, o al azar si hay empate en puntaje
  const selectByePlayer = () => {
    const eligiblePlayers = players.filter(player => !player.hasBye);
    const minPoints = Math.min(...eligiblePlayers.map(player => player.points));
    const lowestScoringPlayers = eligiblePlayers.filter(player => player.points === minPoints);
    
    // Seleccionar al azar si hay varios jugadores con el mismo puntaje mínimo
    return lowestScoringPlayers[Math.floor(Math.random() * lowestScoringPlayers.length)];
  };

  // Emparejamiento para la ronda actual
  const generatePairings = () => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points || Math.random() - 0.5);
    const roundMatches: Match[] = [];
    const pairedPlayers = new Set<number>();

    // Si el número de jugadores es impar, asignamos el bye al jugador con menos puntos
    if (sortedPlayers.length % 2 !== 0) {
      const byePlayer = selectByePlayer();
      if (byePlayer) {
        roundMatches.push({ player1: byePlayer });
        byePlayer.points += 3;
        byePlayer.hasBye = true;
        pairedPlayers.add(byePlayer.id);
      }
    }

    // Emparejar jugadores según puntos, evitando repeticiones de encuentros
    for (let i = 0; i < sortedPlayers.length; i++) {
      const player1 = sortedPlayers[i];
      if (pairedPlayers.has(player1.id)) continue;

      for (let j = i + 1; j < sortedPlayers.length; j++) {
        const player2 = sortedPlayers[j];
        const pairKey = createPairKey(player1.id, player2.id);

        // Verificar si los jugadores ya están emparejados o ya se enfrentaron
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

  // Inicia la siguiente ronda
  const startNextRound = () => {
    if (currentRound < getNumberOfRounds()) {
      generatePairings();
      setCurrentRound(currentRound + 1);
    } else {
      endTournament();
    }
  };

  // Registrar el resultado de una partida
  const recordMatchResult = (round: number, matchIndex: number, result: 'player1' | 'player2' | 'draw') => {
    setMatches(prevMatches => {
      const updatedMatches = [...prevMatches];
      updatedMatches[round][matchIndex] = { ...updatedMatches[round][matchIndex], result };

      const { player1, player2 } = updatedMatches[round][matchIndex];
      setPlayers(prevPlayers =>
        prevPlayers.map(player => {
          if (result === 'player1' && player.id === player1.id) return { ...player, points: player.points + 3 };
          if (result === 'player2' && player2 && player.id === player2.id) return { ...player, points: player.points + 3 };
          if (result === 'draw' && (player.id === player1.id || (player2 && player.id === player2.id))) {
            return { ...player, points: player.points + 1 };
          }
          return player;
        })
      );

      return updatedMatches;
    });
  };

  // Finalizar el torneo
  const endTournament = () => {
    setIsTournamentOver(true);
  };

  // Obtener jugadores ordenados por puntos
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
    getNumberOfRounds // Exportamos getNumberOfRounds
  };
}
