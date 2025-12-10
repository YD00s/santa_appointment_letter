
interface Props {
  santaType: number;
}

const COLOR_MAP: Record<number, string> = {
  1: '🎅',
  2: '🧝',
  3: '🦌',
  4: '🎁',
  5: '🌟',
  6: '❄️',
  7: '🍪',
  8: '🔔',
};

export default function CertificateBadge({ santaType }: Props) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
      {COLOR_MAP[santaType] ?? ''}
    </div>
  );
}
