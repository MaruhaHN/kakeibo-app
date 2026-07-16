"use client";

type Props = {
  totalAmount: number;
  totalCount: number;
};

export default function SummaryCards({
  totalAmount,
  totalCount,
}: Props) {
  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      gap-4
      mb-6
    ">

      <div className="
        bg-white/90
        backdrop-blur
        rounded-3xl
        shadow-xl
        border
        border-white
        p-6
        transition
        hover:-translate-y-1
        hover:shadow-2xl
      ">
        <p className="
          text-gray-500
          text-sm
          mb-2
        ">
          💰 今月の支出
        </p>

        <p className="
          text-3xl
          font-black
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-blue-600
          to-cyan-400
        ">
          ¥{totalAmount.toLocaleString()}
        </p>
      </div>


      <div className="
        bg-white/90
        backdrop-blur
        rounded-3xl
        shadow-xl
        border
        border-white
        p-6
        transition
        hover:-translate-y-1
        hover:shadow-2xl
      ">
        <p className="
          text-gray-500
          text-sm
          mb-2
        ">
          📝 支出件数
        </p>

        <p className="
          text-3xl
          font-black
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-blue-600
          to-cyan-400
        ">
          {totalCount}件
        </p>
      </div>

    </div>
  );
}

