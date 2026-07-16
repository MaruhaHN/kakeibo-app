"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Category = {
  name: string;
  value: number;
};

type Props = {
  categoryData: Category[];
};
const categoryColors: Record<string, string> = {
  "食費": "#ef4444",
  "交通費": "#3b82f6",
  "日用品": "#22c55e",
  "娯楽": "#a855f7",
  "交際費": "#f97316",
  "医療費": "#ec4899",
  "その他": "#6b7280",
};

export default function CategoryChart({ categoryData }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        カテゴリ別支出
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {categoryData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={categoryColors[entry.name]}
  />
))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}