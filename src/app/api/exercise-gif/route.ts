import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') || '';
  try {
    const res = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(query)}&language=english&format=json`,
    );
    const data = await res.json();
    const suggestions = data.suggestions || [];
    if (suggestions.length > 0 && suggestions[0].data?.id) {
      const exId = suggestions[0].data.id;
      const infoRes = await fetch(`https://wger.de/api/v2/exerciseinfo/${exId}/?format=json`);
      const info = await infoRes.json();
      const gif = info.images?.[0]?.image || null;
      return NextResponse.json({ gifUrl: gif });
    }
    return NextResponse.json({ gifUrl: null });
  } catch (e) {
    return NextResponse.json({ gifUrl: null });
  }
}
