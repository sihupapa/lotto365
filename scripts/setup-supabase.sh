#!/bin/bash
# Supabase 프로덕션 설정 스크립트
# 실행: bash scripts/setup-supabase.sh

set -e

echo "🗄️ Supabase 설정 시작..."

# Supabase CLI 로그인
echo "📝 Supabase 로그인..."
supabase login

# 프로젝트 연결 (대화형)
echo ""
echo "🔗 Supabase 프로젝트 연결"
echo "Project Ref는 Supabase 대시보드 URL에서 확인: https://app.supabase.com/project/<ref>"
read -p "Project Ref 입력: " PROJECT_REF

supabase link --project-ref "$PROJECT_REF"

# 마이그레이션 실행
echo ""
echo "📦 DB 마이그레이션 실행..."
supabase db push

# Edge Function 배포
echo ""
echo "⚡ Edge Functions 배포..."
supabase functions deploy collect-winning
supabase functions deploy aggregate-stats 2>/dev/null || echo "aggregate-stats 함수 없으면 스킵"

# Edge Function CRON 설정 안내
echo ""
echo "✅ Supabase 설정 완료!"
echo ""
echo "📅 CRON 설정 (Supabase 대시보드 > Database > Extensions > pg_cron):"
echo ""
echo "  -- 매주 토요일 21:30 당첨번호 수집"
echo "  SELECT cron.schedule("
echo "    'collect-winning-numbers',"
echo "    '30 21 * * 6',"
echo "    \$\$SELECT net.http_post(url := 'https://<ref>.functions.supabase.co/collect-winning') AS request_id\$\$"
echo "  );"
echo ""
echo "  -- 매일 자정 통계 집계"
echo "  SELECT cron.schedule("
echo "    'aggregate-daily-stats',"
echo "    '0 0 * * *',"
echo "    \$\$SELECT net.http_post(url := 'https://<ref>.functions.supabase.co/aggregate-stats') AS request_id\$\$"
echo "  );"
