import Button from '@/components/Button/Button';

interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      label="🖊️"
      radius="full"
      size="sm"
      className="absolute -right-3 bottom-3 h-4 w-8 bg-white text-xs"
      onClick={onClick} // 실제로 클릭 시 전달된 함수 호출
    />
  );
}
