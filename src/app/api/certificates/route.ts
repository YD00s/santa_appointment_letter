import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // 서버 전용

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  // body: { senderName, receiverName, santaId, answers, message, imageUrl, ownerId? }

  try {
    const { data, error } = await sb
      .from('certificates')
      .insert([
        {
          owner_id: body.ownerId || null,
          sender_name: body.senderName,
          receiver_name: body.receiverName || null,
          santa_id: body.santaId,
          answers: body.answers,
          message: body.message,
          image_url: body.imageUrl || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
