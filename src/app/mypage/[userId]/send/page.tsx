import { SantaId } from '@/lib/constants/santaData';
import SendPageContent from './SendPageContent';
import { notFound } from 'next/navigation';

interface Props {
  params: { userId: string };
  searchParams: { santaId: SantaId };
}

export default function SendPage({ params, searchParams }: Props) {
  const santaId = Number(searchParams.santaId);

  if(!santaId || santaId < 1 || santaId > 8) {
    notFound();
  }
  return (
    <div>
      <main className="flex flex-col justify-center">
        <SendPageContent santaId={santaId} userId={params.userId}/>
      </main>
    </div>
  );
}

// import SendPageContent from './SendPageContent';

// export default function SendPage() {
//   return (
//     <div>
//       <main className="flex flex-col justify-center">
//         <SendPageContent />
//       </main>
//     </div>
//   );
// }

