# OAuth 소셜 로그인 설정 가이드

## 1. Supabase 프로젝트 생성

1. https://supabase.com/dashboard 접속
2. "New project" 생성
3. `.env.example` 값을 실제 키로 채우기:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 2. DB 마이그레이션 실행

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

## 3. Google OAuth 설정

### Google Cloud Console
1. https://console.cloud.google.com → "새 프로젝트" 생성
2. "API 및 서비스" > "OAuth 동의 화면" 설정
3. "사용자 인증 정보" > "OAuth 2.0 클라이언트 ID" 생성
4. 승인된 리디렉션 URI 추가:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```

### Supabase 대시보드
1. Authentication > Providers > Google
2. Client ID / Client Secret 입력 후 Save

---

## 4. Kakao OAuth 설정

### Kakao Developers
1. https://developers.kakao.com → 앱 생성
2. "앱 설정" > "앱 키" 에서 REST API 키 복사
3. "카카오 로그인" 활성화
4. Redirect URI 등록:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
5. "동의항목" 설정: `profile_nickname`, `profile_image`

### Supabase 대시보드
1. Authentication > Providers > Kakao
2. REST API Key를 Client ID에 입력
3. Client Secret 입력 후 Save

---

## 5. Naver OAuth 설정

> 네이버는 Supabase 기본 제공 provider가 아닙니다.
> **Custom OAuth Provider**로 설정해야 합니다.

### Naver Developers
1. https://developers.naver.com → "애플리케이션 등록"
2. 사용 API: "네아로(네이버 아이디로 로그인)" 선택
3. 서비스 환경: "PC 웹" 추가
4. Callback URL 등록:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
5. Client ID / Client Secret 발급

### Supabase 대시보드 (Custom Provider)
1. Authentication > Providers > Custom OAuth
2. 설정값:
   | 항목 | 값 |
   |---|---|
   | Provider Name | naver |
   | Client ID | 네이버 Client ID |
   | Client Secret | 네이버 Client Secret |
   | Authorization URL | `https://nid.naver.com/oauth2.0/authorize` |
   | Token URL | `https://nid.naver.com/oauth2.0/token` |
   | User Info URL | `https://openapi.naver.com/v1/nid/me` |
   | Scopes | `name email profile_image` |

---

## 6. Supabase Storage 설정 (프로필 이미지)

1. Storage > "New bucket" 생성: `avatars`
2. Public bucket으로 설정
3. RLS 정책 추가:
   ```sql
   -- 본인 이미지만 업로드
   CREATE POLICY "본인 이미지 업로드" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
   );

   -- 전체 공개 읽기
   CREATE POLICY "아바타 공개 읽기" ON storage.objects
   FOR SELECT USING (bucket_id = 'avatars');
   ```

---

## 7. Redirect URL 설정 (Supabase 대시보드)

Authentication > URL Configuration:
- Site URL: `https://your-domain.com`
- Redirect URLs 추가:
  ```
  https://your-domain.com/callback
  http://localhost:3000/callback
  ```
