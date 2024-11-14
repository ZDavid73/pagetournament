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
  result?: 'player1' | 'player2';
}

export function useTournament() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isTournamentOver, setIsTournamentOver] = useState(false);
  
  const getNumberOfRounds = () => Math.ceil(Math.log2(players.length));

  const addPlayer = (name: string) => {
    setPlayers(prev => [...prev, { id: prev.length + 1, name, points: 0, hasBye: false }]);
  };

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
        if (!pairedPlayers.has(player2.id)) {
          roundMatches.push({ player1, player2 });
          pairedPlayers.add(player1.id);
          pairedPlayers.add(player2.id);
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

      match.result = result;

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

  const clearMatchResult = (round: number, matchIndex: number) => {
    setMatches(prevMatches => {
      const updatedMatches = [...prevMatches];
      const match = updatedMatches[round][matchIndex];

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

      match.result = undefined;

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
    clearMatchResult, // Exportamos clearMatchResult
    isTournamentOver,
    endTournament,
    rankedPlayers,
    getNumberOfRounds
  };
}
