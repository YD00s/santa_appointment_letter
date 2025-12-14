import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-gray50 gap-4">
      <div className="text-3xl font-semibold">이동 중...</div>
      <Spinner/>
    </div>
  );
}
