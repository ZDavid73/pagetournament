import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface MatchNodeProps {
  match: string[];
  onPlacePlayer: (player: string) => void;
  onWin: (winner: string) => void;
}

const MatchNode: React.FC<MatchNodeProps> = ({ match, onPlacePlayer, onWin }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'PLAYER',
    drop: (item: { name: string }) => onPlacePlayer(item.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={dropRef} className={`match-node ${isOver ? 'highlight' : ''}`}>
      {match.map((player, idx) => (
        <PlayerSlot key={idx} player={player} onWin={onWin} />
      ))}
    </div>
  );
};

interface PlayerSlotProps {
  player: string;
  onWin: (winner: string) => void;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onWin }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'PLAYER',
    item: { name: player },
    canDrag: !!player,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`player-slot ${player ? 'filled' : 'empty'} ${isDragging ? 'dragging' : ''}`}
      onClick={() => player && onWin(player)}
    >
      {player || 'Vacío'}
    </div>
  );
};

export default MatchNode;
