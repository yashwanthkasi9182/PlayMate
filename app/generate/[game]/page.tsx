'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import PlayerInput from '@/components/PlayerInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Player } from '@/types/game';
import { useTeamGeneration } from '@/hooks/useTeamGeneration';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shuffle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function GenerateTeams() {
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [numTeams, setNumTeams] = useState(2);
  const [teamSize, setTeamSize] = useState(5);
  const [numMatches, setNumMatches] = useState(1);
  const [gameInfo, setGameInfo] = useState<{
    isValid: boolean;
    needsToss: boolean;
    rules: string[];
    validationMessage?: string;
  } | null>(null);
  
  const { generateTeams, clearResults, isLoading, error, results } = useTeamGeneration();
  const { toast } = useToast();

  // Calculate minimum required players
  const minRequiredPlayers = numTeams * teamSize;

  const validateGame = async () => {
    if (!gameName.trim()) return;

    try {
      const response = await fetch('/api/validate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName }),
      });

      const data = await response.json();
      setGameInfo(data);

      if (!data.isValid) {
        toast({
          title: "Invalid Game",
          description: data.validationMessage,
          variant: "error",
        });
      }
    } catch (err) {
      toast({
        title: "Validation Error",
        description: "Failed to validate game",
        variant: "error",
      });
    }
  };

  const handleGenerateTeams = async () => {
    if (!gameInfo?.isValid) {
      toast({
        title: "Invalid Game",
        description: "Please enter a valid game name",
        variant: "error",
      });
      return;
    }

    if (players.length < minRequiredPlayers) {
      toast({
        title: "Not enough players",
        description: `Minimum ${minRequiredPlayers} players required for ${numTeams} teams of ${teamSize}`,
        variant: "error",
      });
      return;
    }

    try {
      await generateTeams({
        game: gameName,
        mode: 'custom',
        players: players.map(p => p.name),
        numTeams,
        teamSize,
        numMatches,
        needsToss: gameInfo.needsToss
      });
      
      toast({
        title: "Teams Generated!",
        description: `Successfully created ${results?.teams.length || 0} teams`,
        variant: "success",
      });
    } catch (err) {
      console.error('Failed to generate teams:', err);
      toast({
        title: "Generation Failed",
        description: err instanceof Error ? err.message : "Could not generate teams",
        variant: "error",
      });
    }
  };

  const handleGenerateNew = () => {
    clearResults();
    toast({
      title: "Ready for new teams",
      description: "You can now generate fresh teams",
      variant: "info",
    });
  };

  // Show results if available
  if (results) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <ResultsDisplay
            results={results}
            game={gameName}
            onGenerateNew={handleGenerateNew}
          />
        </div>
      </Layout>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner message="Generating fair teams..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Game Input Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Game Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Game Name
                  </label>
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    onBlur={validateGame}
                    placeholder="Enter game name..."
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {gameInfo?.isValid && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Teams
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="10"
                        value={numTeams}
                        onChange={(e) => setNumTeams(parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Players per Team
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={teamSize}
                        onChange={(e) => setTeamSize(parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Matches
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={Math.floor(numTeams * (numTeams - 1) / 2)}
                        value={numMatches}
                        onChange={(e) => setNumMatches(parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md"
                      />
                      <p className="text-sm text-gray-500 mt-1">Maximum {Math.floor(numTeams * (numTeams - 1) / 2)} possible matches with {numTeams} teams</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Player Input Section */}
            {gameInfo?.isValid && (
              <PlayerInput
                players={players}
                onPlayersChange={setPlayers}
                minPlayers={minRequiredPlayers}
                maxPlayers={numTeams * teamSize * 2} // Allow up to double the minimum required players
              />
            )}
          </div>

          {/* Right Column - Game Info & Generate */}
          <div className="space-y-6">
            {gameInfo?.isValid && (
              <>
                {/* Game Rules */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Game Information
                  </h3>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Required Players:</span>
                      <span className="font-semibold">{minRequiredPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toss Required:</span>
                      <span className="font-semibold">{gameInfo.needsToss ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {gameInfo.rules.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Rules:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {gameInfo.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: players.length >= minRequiredPlayers ? 1.02 : 1 }}
                  whileTap={{ scale: players.length >= minRequiredPlayers ? 0.98 : 1 }}
                  onClick={handleGenerateTeams}
                  disabled={players.length < minRequiredPlayers || isLoading}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    players.length >= minRequiredPlayers
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Shuffle className="h-5 w-5" />
                  <span>Generate Teams</span>
                </motion.button>
              </>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}