import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req: Request) => {
  // 1. Manutention CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }});
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 2. Vérification JWT (Sécurité)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Auth header missing' }), { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { query, filters, action } = await req.json();

    // 3. Logic based on Action
    if (action === 'match') {
      // Fetch verified teachers
      const { data: teachers, error: tErr } = await supabase
        .from('teacher_profiles')
        .select('id, subjects, hourly_rate, experience_years, bio, profiles(name)')
        .eq('is_verified', true);
      
      if (tErr) throw tErr;

      const prompt = `
        Agis en tant qu'assistant de matching intelligent pour Minsii.
        Critères: Query="${query}", Matière="${filters?.subject || 'Toutes'}", Budget="${filters?.budget || 'N/A'}"
        Mentors: ${JSON.stringify(teachers?.map(t => ({
          id: t.id,
          name: (t.profiles as any)?.name,
          subject: t.subjects?.join(', '),
          rate: t.hourly_rate,
          experience: t.experience_years,
          bio: t.bio
        })))}
        Suggère les 3 meilleurs mentors avec ID et "reason" (max 15 mots).
        Réponds uniquement en JSON: [{"id": "uuid", "reason": "..."}]
      `;

      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const aiData = await aiResponse.json();
      const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const matches = JSON.parse(text.replace(/```json|```/g, ''));

      return new Response(JSON.stringify({ success: true, matches }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});
