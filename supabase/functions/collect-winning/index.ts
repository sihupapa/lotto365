import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// 동행복권 당첨번호 수집 (매주 토요일 밤 9시 30분 이후)
Deno.serve(async () => {
  const { data: latest } = await supabase
    .from('winning_numbers')
    .select('draw_no')
    .order('draw_no', { ascending: false })
    .limit(1)
    .single()

  const nextDrawNo = (latest?.draw_no ?? 0) + 1

  // 동행복권 API 호출
  const res = await fetch(
    `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${nextDrawNo}`
  )
  const json = await res.json()

  if (json.returnValue !== 'success') {
    return new Response(JSON.stringify({ message: '아직 발표 전입니다.' }), { status: 200 })
  }

  const { error } = await supabase.from('winning_numbers').insert({
    draw_no: json.drwNo,
    numbers: [json.drwtNo1, json.drwtNo2, json.drwtNo3, json.drwtNo4, json.drwtNo5, json.drwtNo6],
    bonus: json.bnusNo,
    prize_1st: json.firstWinamnt,
    winner_count_1st: json.firstPrzwnerCo,
    draw_date: json.drwNoDate,
  })

  if (error) return new Response(JSON.stringify({ error }), { status: 500 })

  return new Response(JSON.stringify({ collected: nextDrawNo }), { status: 200 })
})
