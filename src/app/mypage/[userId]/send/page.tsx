import { notFound } from 'next/navigation';

import SendPageContent from './SendPageContent';

interface Props {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ santaId?: string }>;
}

export default async function SendPage({ params, searchParams }: Props) {
  const { userId } = await params;
  const { santaId: santaIdRaw } = await searchParams;

  const santaId = Number(santaIdRaw);

  if (!santaId || santaId < 1 || santaId > 8) {
    console.log(`santaId: ${santaId}`);
    notFound();
  }
  return (
    <div>
      <main className="flex flex-col justify-center">
        <SendPageContent santaId={santaId} userId={userId} />
      </main>
    </div>
  );
}
