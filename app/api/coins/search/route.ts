import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ coins: [] });
  }

  try {
    const API_KEY = process.env.COINGECKO_API_KEY;
    const BASE_URL = process.env.COINGECKO_BASE_URL;

    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&x_cg_demo_api_key=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return NextResponse.json({ coins: data.coins || [] });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ coins: [], error: 'Search failed' }, { status: 500 });
  }
}