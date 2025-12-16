import IconButton from '@/components/IconButton/IconButton';

interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <IconButton
      icon="IC_Edit"
      variant="secondary"
      size="sm"
      ariaLabel="이름 수정 버튼"
      className="duration text-gray900 absolute -right-3 -bottom-3"
      onClick={onClick} // 실제로 클릭 시 전달된 함수 호출
    />
  );
}
