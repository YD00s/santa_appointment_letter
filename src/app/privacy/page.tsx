'use client';

import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="mx-auto h-screen max-w-3xl bg-white px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">개인정보처리방침</h1>

      <section className="space-y-6 text-sm leading-relaxed text-gray-700">
        <article>
          <h2 className="mb-2 font-semibold">1. 개인정보의 수집 항목</h2>
          <p>서비스는 다음과 같은 최소한의 개인정보를 수집합니다.</p>
          <ul className="ml-5 list-disc">
            <li>로그인 시: 카카오 계정 식별값(ID)</li>
            <li>서비스 이용 시: 이용자가 작성한 메시지(최대 200자)</li>
          </ul>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="ml-5 list-disc">
            <li>이용자 식별 및 서비스 제공</li>
            <li>산타 임명장 및 이미지 생성</li>
            <li>임명장 링크 생성 및 공유 기능 제공</li>
            <li>서비스 운영 및 품질 개선</li>
          </ul>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            개인정보는 서비스 이용 목적 달성 시까지 보유하며, 목적 달성 후 지체 없이 파기합니다. 단,
            관련 법령에 따라 보관이 필요한 경우에는 해당 법령을 따릅니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">4. 개인정보의 제3자 제공</h2>
          <p>
            서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령에 의거한
            요청이 있는 경우에 한하여 제공될 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">5. 개인정보 처리의 위탁</h2>
          <p>
            원활한 서비스 제공을 위하여 인증 및 데이터 저장 업무를 외부 서비스 (카카오,
            Supabase)에게 위탁할 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">6. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수 있으며, 서비스 내
            제공되는 방법을 통해 처리할 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">7. 개인정보의 안전성 확보 조치</h2>
          <p>
            서비스는 개인정보 보호를 위하여 합리적인 기술적·관리적 보호조치를 적용하고 있습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">8. 개인정보처리방침의 변경</h2>
          <p>
            본 방침은 관련 법령 또는 서비스 정책 변경에 따라 변경될 수 있으며, 변경 시 서비스 내
            공지를 통해 안내합니다.
          </p>
        </article>

        <article>
          <p className="text-xs text-gray-500">
            본 개인정보처리방침은 서비스 공개일부터 적용됩니다.
          </p>
        </article>
      </section>
      <div className="mt-10 flex w-full justify-center">
        <Button onClick={() => router.back()} label="돌아가기" />
      </div>
    </main>
  );
}
