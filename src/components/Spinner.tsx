interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number; // 스피너 가로/세로 크기 (px)
  strokeWidth?: number; // 테두리 두께(px)
  color?: string; // 테두리 색상
  speed?: number; // 회전 속도 (초)
  ariaLabel?: string;
}

const Spinner = ({
  size = 30,
  strokeWidth = 6,
  color = '#ff4747',
  speed = 1,
  ariaLabel = '로딩중',
}: SpinnerProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius; // 원의 둘레 길이

  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        animation: `spin ${speed}s linear infinite`,
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
      focusable="false"
    >
      {/* 배경 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e3e3e3"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* 바 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round" // round, butt, square
        strokeDasharray={circumference} // 전체 바 길이
        strokeDashoffset={circumference * 0.7} // 보이지 않는 바 길이 (선의 시작 위치를 오프셋만큼 밀어냄)
      />
    </svg>
  );
};

export default Spinner;
