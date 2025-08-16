'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User } from 'lucide-react';
import { Player } from '@/types/game';

interface PlayerInputProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  maxPlayers: number;
  minPlayers: number;
}

export default function PlayerInput({ 
  players, 
  onPlayersChange, 
  maxPlayers, 
  minPlayers 
}: PlayerInputProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < maxPlayers) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim()
      };
      onPlayersChange([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    onPlayersChange(players.filter(p => p.id !== playerId));
  };

  const updatePlayer = (playerId: string, newName: string) => {
    onPlayersChange(
      players.map(p => 
        p.id === playerId ? { ...p, name: newName } : p
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Player Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Add Players ({players.length}/{maxPlayers})
        </h3>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name..."
            className="flex-1 border-2 border-gray-200 focus:border-purple-500 rounded-lg p-3 outline-none transition-colors"
            disabled={players.length >= maxPlayers}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addPlayer}
            disabled={!newPlayerName.trim() || players.length >= maxPlayers}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </motion.button>
        </div>
        
        {players.length < minPlayers && (
          <p className="text-red-500 text-sm mt-2">
            Minimum {minPlayers} players required
          </p>
        )}
      </div>

      {/* Players List */}
      {players.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Player List
          </h3>
          
          <div className="space-y-3">
            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(player.id, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 font-medium"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removePlayer(player.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}