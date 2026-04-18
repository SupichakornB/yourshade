import { capitalizeFirst } from "@/lib/string";
import clsx from "clsx";

type OptionValue = string;

type OptionRowProps<T extends OptionValue> = {
  previewImage: File | null;
  value: T | null;
  onSelect: (value: T) => void;
  options: { value: T; bgColor: string }[];
};

export default function OptionRow<T extends OptionValue>({
  previewImage,
  value,
  onSelect,
  options,
}: OptionRowProps<T>) {
  const imageUrl = previewImage ? URL.createObjectURL(previewImage) : null;

  return (
    <div className="grid md:flex md:justify-center gap-10">
      {options.map((opt) => {
        const selected = value === opt.value;

        return (
          <>
            <div className="grid gap-y-6 text-center justify-center">
              <div
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={clsx(
                  "cursor-pointer rounded-2xl w-[384px] h-[512px] xl:w-[660px] xl:h-[440px] 2xl:w-[1096px] 2xl:h-[720px] flex items-center justify-center shadow-xl transition-all border",
                  selected ? "border-2 border-[#8E1616]" : "border-[#7E7F83]",
                )}
                style={{ backgroundColor: opt.bgColor }}
              >
                {imageUrl && (
                  <div className="w-60 h-80 md:w-70 md:h-90 overflow-hidden bg-white shadow-lg [clip-path:ellipse(50%_50%_at_50%_50%)]">
                    <img
                      src={imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="text-[28px] text-center">
                {capitalizeFirst(opt.value)}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
