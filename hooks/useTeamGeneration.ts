'use client';

import { useState } from 'react';
import { GenerateTeamsRequest, GenerateTeamsResponse } from '@/types/api';

export function useTeamGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GenerateTeamsResponse | null>(null);

  const generateTeams = async (request: GenerateTeamsRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: GenerateTeamsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate teams');
      }

      setResults(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return {
    generateTeams,
    clearResults,
    isLoading,
    error,
    results
  };
}