interface ProgressTextProps {
  current: number;
  total?: number;
}

export default function ProgressText({
  current,
  total = 5,
}: ProgressTextProps) {
  return (
    <div className="mb-6 text-center text-2xl">
      <span>{current}</span> / {total}
    </div>
  );
}
