"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = {
  month: string;
  value: number;
};

type Props = {
  monthlyData: MonthlyData[];
};

function MonthlyChart({
  monthlyData,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        月別支出推移
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;