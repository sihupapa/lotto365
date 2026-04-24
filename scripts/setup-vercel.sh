#!/bin/bash
# Vercel 프로젝트 설정 스크립트
# 실행: bash scripts/setup-vercel.sh

set -e

echo "🚀 Vercel 프로젝트 설정 시작..."

# Vercel 로그인 확인
if ! vercel whoami &>/dev/null; then
  echo "📝 Vercel 로그인이 필요합니다."
  vercel login
fi

echo ""
echo "=== 1/2 User App (web) 설정 ==="
cd apps/web
vercel link --yes
vercel env pull .env.local
cd ../..

echo ""
echo "=== 2/2 Admin Dashboard 설정 ==="
cd apps/admin
vercel link --yes
vercel env pull .env.local
cd ../..

echo ""
echo "✅ Vercel 프로젝트 연결 완료!"
echo ""
echo "다음 단계:"
echo "1. GitHub 저장소 생성 후 push"
echo "2. Vercel 대시보드에서 각 프로젝트 GitHub 연동"
echo "3. GitHub Secrets 등록 (VERCEL_TOKEN, VERCEL_ORG_ID 등)"
