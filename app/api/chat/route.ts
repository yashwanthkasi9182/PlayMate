import { NextRequest, NextResponse } from 'next/server';
import groq from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { game, mode, message, chatHistory = [] } = await request.json();

    if (!message || !game) {
      return NextResponse.json({
        success: false,
        error: 'Message and game are required'
      }, { status: 400 });
    }

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant for ${game} game rules and gameplay questions.

STRICT RULES:
- ONLY answer questions related to ${game} gameplay, rules, strategies, techniques, and equipment
- If user asks about other games, topics, or unrelated questions, politely redirect them back to ${game}
- Keep responses concise and helpful (max 150 words)
- Focus on practical gameplay advice
- If asked about scoring, team positions, game duration, equipment, or strategies - provide detailed help

Current game mode: ${mode || 'standard'}

Example responses for off-topic:
"I'm here to help with ${game} questions only. What would you like to know about ${game} rules or gameplay?"

Respond naturally but stay focused on ${game}-related topics only.`
      },
      ...chatHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 512,
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      response: response || 'Sorry, I could not generate a response.'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process chat message'
    }, { status: 500 });
  }
}