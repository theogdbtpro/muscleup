
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') || '';
  if (!query) return NextResponse.json({ gifUrl: null });

  try {
    // 1. Recherche de l'exercice par terme
    const searchRes = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(query)}&language=english&format=json`,
      { next: { revalidate: 3600 } }
    );
    
    if (!searchRes.ok) throw new Error('Search API failed');
    
    const searchData = await searchRes.json();
    const suggestions = searchData.suggestions || [];
    
    // 2. Si on a un résultat, on récupère les détails (images)
    if (suggestions.length > 0 && suggestions[0].data?.id) {
      const exId = suggestions[0].data.id;
      const infoRes = await fetch(`https://wger.de/api/v2/exerciseinfo/${exId}/?format=json`);
      
      if (infoRes.ok) {
        const info = await infoRes.json();
        // On cherche une image/gif. Wger utilise souvent des images statiques mais elles sont utiles.
        const imageUrl = info.images?.[0]?.image || null;
        return NextResponse.json({ gifUrl: imageUrl });
      }
    }
    
    return NextResponse.json({ gifUrl: null });
  } catch (e) {
    console.error("Error fetching exercise gif:", e);
    return NextResponse.json({ gifUrl: null });
  }
}
