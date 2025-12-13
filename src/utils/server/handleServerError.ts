import { NextResponse } from 'next/server';

export type ApiErrorType =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

interface ErrorResponse {
  error: string;
  details?: string;
  timestamp?: string;
}

const ERROR_MESSAGES: Record<ApiErrorType, string> = {
  BAD_REQUEST: '잘못된 요청입니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '리소스를 찾을 수 없습니다.',
  INTERNAL_ERROR: '서버 오류가 발생했습니다.',
};

const STATUS_CODES: Record<ApiErrorType, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// 서버 에러를 일관된 형식으로 처리하여 NextResponse 반환
export function handleServerError(
  type: ApiErrorType,
  customMessage?: string,
  error?: unknown,
  includeTimestamp = false
): NextResponse<ErrorResponse> {
  const message = customMessage || ERROR_MESSAGES[type];
  const statusCode = STATUS_CODES[type];

  // 상세 에러 로깅
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${type}]`, message);
    if (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  const response: ErrorResponse = {
    error: message,
  };

  // 상세 에러 정보 포함
  if (process.env.NODE_ENV === 'development' && error) {
    response.details = error instanceof Error ? error.message : String(error);
  }

  if (includeTimestamp) {
    response.timestamp = new Date().toISOString();
  }

  return NextResponse.json(response, { status: statusCode });
}

// 파라미터 유효성 검사 헬퍼
export function validateParams(
  params: Record<string, unknown>,
  required: string[]
): { valid: boolean; missing: string[] } {
  const missing = required.filter(key => {
    const value = params[key];
    // undefined와 null만 누락으로 처리
    // 0, false, 빈 문자열('')은 유효한 값으로 간주
    return value === undefined || value === null;
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Supabase 에러 처리 헬퍼
export function handleSupabaseError(error: unknown, context?: string) {
  const contextMsg = context ? `${context}: ` : '';

  if (error && typeof error === 'object' && 'message' in error) {
    return handleServerError('INTERNAL_ERROR', `${contextMsg}${error.message}`, error);
  }

  return handleServerError('INTERNAL_ERROR', `${contextMsg}데이터베이스 오류`, error);
}

// 성공 응답 헬퍼
export function successResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}
