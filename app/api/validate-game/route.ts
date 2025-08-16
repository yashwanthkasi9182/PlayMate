import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { gameName } = await request.json();

    if (!gameName) {
      return NextResponse.json({
        isValid: false,
        validationMessage: 'Game name is required'
      });
    }

    // Create LLM prompt to validate and get game info
    const prompt = `Validate if "${gameName}" is a real sport or game that can be played with teams.
If it is valid, provide information about:
1. Whether it requires a toss (and if yes, how it works)
2. Game-specific rules related to team formation and player roles
3. Any team-related constraints or special considerations

Return ONLY valid JSON in this exact format:
{
  "isValid": boolean,
  "validationMessage": "string explaining why the game is invalid, if applicable",
  "needsToss": boolean,
  "rules": ["array of strings with game rules and team constraints"]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a sports and games expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from AI');
    }

    // Parse and validate JSON response
    let parsedResponse;
    try {
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Validate response structure
    if (!parsedResponse || typeof parsedResponse.isValid !== 'boolean') {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Game validation error:', error);
    
    return NextResponse.json({
      isValid: false,
      validationMessage: error instanceof Error ? error.message : 'Failed to validate game',
      needsToss: false,
      rules: []
    });
  }
}