'use client';

import { GenerateTeamsResponse, Team } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Shuffle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { shareTeams } from '@/utils/sharing';

interface ResultsDisplayProps {
  results: GenerateTeamsResponse;
  game: string;
  onGenerateNew: () => void;
}

export default function ResultsDisplay({ results, game, onGenerateNew }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await shareTeams({
        teams: results.teams,
        matches: results.matches,
        game,
        mode: 'custom'
      });
      toast({
        title: 'Teams Shared',
        description: 'Link copied to clipboard!',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Share Failed',
        description: 'Could not share teams',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with game name */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">{game}</h1>
        <p className="text-gray-600 text-center">Generated Teams and Matches</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Teams
        </Button>
        <Button
          onClick={onGenerateNew}
          className="flex items-center gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Generate New Teams
        </Button>
      </div>

      {/* Teams Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-2">Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.teams.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{team.name}</h3>
                <ul className="space-y-2">
                  {team.players.map((player) => (
                    <li
                      key={player}
                      className={`flex items-center ${
                        team.doubleSidedPlayers?.includes(player)
                          ? 'text-indigo-600 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {player}
                      {team.doubleSidedPlayers?.includes(player) && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                          Double-sided
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Matches Display */}
      {results.matches.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-2">Match Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.matches.map((match, index) => (
              <motion.div
                key={match.match}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Match {match.match}</h4>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">{match.team1} vs {match.team2}</p>
                    {match.toss && (
                      <p className="text-indigo-600 text-sm font-medium">
                        🎲 Toss Winner: {match.toss}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">{match.time}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}