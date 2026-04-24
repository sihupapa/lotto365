import { NextResponse } from 'next/server'

export const ok = (data: unknown, status = 200) =>
  NextResponse.json({ success: true, data }, { status })

export const fail = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status })

export const unauthorized = () => fail('인증이 필요합니다.', 401)
export const forbidden = () => fail('권한이 없습니다.', 403)
