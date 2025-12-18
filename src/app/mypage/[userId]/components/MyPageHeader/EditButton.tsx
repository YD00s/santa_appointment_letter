import IconButton from '@/components/IconButton/IconButton';

interface EditButtonProps {
  className?: string;
  onClick: () => void;
}

export default function EditButton({ className, onClick }: EditButtonProps) {
  return (
    <IconButton
      icon="IC_Edit"
      variant="tertiary"
      size="sm"
      ariaLabel="이름 수정 버튼"
      className={`duration text-gray900 ${className}`}
      onClick={onClick} // 실제로 클릭 시 전달된 함수 호출
    />
  );
}
