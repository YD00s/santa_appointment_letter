// 산타 결과 카드
interface Props {
  title: string;
  description: string;
  image: string;
}

export default function SantaCard({ title, description, image }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-md">
      <img src={image} alt={title} className="mx-auto mb-6 h-40 w-40 object-contain" />
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <p className="leading-relaxed whitespace-pre-line text-gray-600">{description}</p>
    </div>
  );
}
