export default function SantaLoading() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-6">
      <div className="flex h-28 w-28 animate-pulse items-center justify-center rounded-full bg-red-500">
        <svg className="h-14 w-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 17.8l2.1-2.1M17.7 6.3l2.1-2.1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-lg font-medium">산타 인증서를 만드는 중이에요…</div>
      <div className="h-1 w-48 overflow-hidden rounded bg-gray-200">
        <div className="animate-load h-full bg-red-500" style={{ width: '40%' }} />
      </div>

      <style jsx>{`
        .animate-load {
          animation: load 2s infinite ease-in-out;
        }
        @keyframes load {
          0% {
            transform: translateX(-100%);
            width: 30%;
          }
          50% {
            transform: translateX(0%);
            width: 60%;
          }
          100% {
            transform: translateX(100%);
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
}
