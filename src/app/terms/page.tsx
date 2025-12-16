'use client';

import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="mx-auto h-screen max-w-3xl bg-white px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">이용약관</h1>

      <section className="space-y-6 text-sm leading-relaxed text-gray-700">
        <article>
          <h2 className="mb-2 font-semibold">제1조 (목적)</h2>
          <p>
            본 약관은 산타 임명장 웹서비스(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자
            간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제2조 (서비스의 내용)</h2>
          <p>서비스는 다음과 같은 기능을 제공합니다.</p>
          <ul className="ml-5 list-disc">
            <li>간단한 성격테스트 질문 제공</li>
            <li>성격테스트 결과를 바탕으로 생성된 산타 이미지 및 임명장 제공</li>
            <li>이용자가 작성한 200자 이내 메시지를 포함한 산타 임명장 링크 생성 및 공유 기능</li>
          </ul>
          <p className="mt-2">
            본 서비스는 오락 및 재미를 목적으로 제공되며, 어떠한 전문적 진단이나 평가를 제공하지
            않습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제3조 (이용자의 의무)</h2>
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="ml-5 list-disc">
            <li>타인의 권리, 명예, 개인정보를 침해하는 행위</li>
            <li>욕설, 비방, 혐오 표현, 음란하거나 불쾌감을 주는 내용의 작성</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
          </ul>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제4조 (저작권)</h2>
          <p>
            서비스에서 제공되는 이미지, 문구, 디자인 등 모든 콘텐츠에 대한 저작권은 서비스
            제공자에게 귀속됩니다. 단, 이용자가 작성한 메시지의 저작권은 이용자에게 귀속됩니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제5조 (서비스 제공의 중단)</h2>
          <p>
            서비스 제공자는 시스템 점검, 장애, 기타 불가피한 사유가 발생한 경우 서비스 제공을
            일시적으로 중단할 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제6조 (면책조항)</h2>
          <p>
            본 서비스는 무료로 제공되며, 서비스 이용과 관련하여 발생한 손해에 대하여 서비스 제공자는
            관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.
          </p>
        </article>

        <article>
          <h2 className="mb-2 font-semibold">제7조 (약관의 변경)</h2>
          <p>
            본 약관은 관련 법령을 위반하지 않는 범위 내에서 변경될 수 있으며, 변경 시 서비스 내
            공지를 통해 안내합니다.
          </p>
        </article>

        <article>
          <p className="text-xs text-gray-500">본 약관은 서비스 공개일부터 적용됩니다.</p>
        </article>
      </section>
      <div className="mt-10 flex w-full justify-center">
        <Button onClick={() => router.back()} label="돌아가기" />
      </div>
    </main>
  );
}
