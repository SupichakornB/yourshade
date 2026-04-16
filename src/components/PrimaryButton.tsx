"use client";

import clsx from "clsx";

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        "py-3 p-6 rounded-full cursor-pointer text-center text-white bg-[#8E1616]",
        isDisabled && "cursor-not-allowed text-[#7E7F83] bg-[#D7D7D9] ",
        className
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          {/* <Spinner /> */}
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
