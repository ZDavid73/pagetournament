import React from 'react';
import MatchNode from './MatchNode';

interface BracketProps {
  rounds: string[][][];
  onPlacePlayer: (roundIdx: number, matchIdx: number, player: string) => void;
  onWin: (roundIdx: number, matchIdx: number, winner: string) => void;
}

const Bracket: React.FC<BracketProps> = ({ rounds, onPlacePlayer, onWin }) => (
  <div className="bracket-tree">
    {rounds.map((round, roundIdx) => (
      <div key={roundIdx} className="round-tree">
        <h3>Ronda {roundIdx + 1}</h3>
        {round.map((match, matchIdx) => (
          <MatchNode
            key={matchIdx}
            match={match}
            onPlacePlayer={(player) => onPlacePlayer(roundIdx, matchIdx, player)}
            onWin={(winner) => onWin(roundIdx, matchIdx, winner)}
          />
        ))}
      </div>
    ))}
  </div>
);

export default Bracket;
