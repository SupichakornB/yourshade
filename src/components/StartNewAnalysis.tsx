'use client'

export default function StartNewAnalysis({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-2xl p-6 mx-6 w-[567px] shadow-xl">
        <h2 className="text-[20px] xl:text-[24px] 2xl:text-[36px] font-semibold text-[#8E1616] mb-2">
          Start a New Analysis?
        </h2>
        <p className="text-[16px] xl:text-[16px] 2xl:text-[24px] text-gray-500 mb-6">
          This will clear your current result and take you back to the beginning.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-normal text-[#8E1616] border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-normal text-white bg-[#8E1616] hover:bg-[#6a1818] transition-colors"
          >
            Start new
          </button>
        </div>
      </div>
    </div>
  )
}