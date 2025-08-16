import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';
import { GenerateTeamsRequest, GenerateTeamsResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTeamsRequest = await request.json();
    const { game, players, numTeams, teamSize, numMatches, needsToss } = body;

    // Validate input
    if (!game || !players || players.length === 0 || !numTeams || !teamSize || !numMatches) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const minRequiredPlayers = numTeams * teamSize;
    const hasExtraPlayers = players.length > minRequiredPlayers;
    const needsDoubleSided = players.length < minRequiredPlayers;
    const maxPossibleMatches = Math.floor(numTeams * (numTeams - 1) / 2);

    if (numMatches > maxPossibleMatches) {
      return NextResponse.json({
        success: false,
        error: `Maximum ${maxPossibleMatches} matches possible with ${numTeams} teams`
      }, { status: 400 });
    }

    // Create LLM prompt
    const prompt = `Generate fair and balanced teams for ${game} with these parameters:
- Number of teams: ${numTeams}
- Players per team: ${teamSize}
- Number of matches: ${numMatches}
- Available players: ${players.join(', ')}

Requirements:
${needsDoubleSided ? `- Some players may need to play for multiple teams due to having fewer than ${minRequiredPlayers} players\n` : ''}
${hasExtraPlayers ? '- Extra players should be distributed evenly across teams\n' : ''}
${needsToss ? '- Include toss results for matches between teams\n' : ''}
- For each match, randomly select two different teams to play against each other
- Each team should play approximately the same number of matches
- Avoid repeating the same team matchups if possible

Format the response EXACTLY as follows (JSON only, no code block markers):
{
  "teams": [
    {
      "name": "Team X",
      "players": ["player1", "player2", ...],
      "doubleSidedPlayers": ["player1"] // only if playing for multiple teams
    }
  ],
  "matches": [
    {
      "match": 1,
      "team1": "Team X",
      "team2": "Team Y",
      ${needsToss ? '"toss": "Team that won the toss",' : ''}
      "time": "Match 1"
    }
  ],
  "gameRules": ["Important game rules for ${game}"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a sports team generator that creates fair and balanced teams. Return only valid JSON without any markdown or code block formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      // Remove any potential markdown formatting
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate response structure
    if (!parsedResponse.teams || !parsedResponse.matches || !parsedResponse.gameRules) {
      throw new Error('Invalid response structure from AI');
    }

    // Validate number of matches
    if (parsedResponse.matches.length !== numMatches) {
      throw new Error('Invalid number of matches generated');
    }

    const response: GenerateTeamsResponse = {
      teams: parsedResponse.teams,
      matches: parsedResponse.matches,
      gameRules: parsedResponse.gameRules,
      success: true
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Team generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate teams',
      teams: [],
      matches: [],
      gameRules: []
    }, { status: 500 });
  }
}