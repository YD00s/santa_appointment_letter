export interface Letter {
  id: string;              // UUID 권장
  authorId: string;        // 작성자(= 링크 주인) Supabase auth.uid()
  recipientName: string;   // 링크 접속자 이름(받는 사람의 이름) 로그인 필요x
  content: string;         // 200자 제한
  santaId: number;         // 1~8 고정, nullable 불필요
  createdAt: string;
}