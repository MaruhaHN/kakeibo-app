
"use client";
import ExpenseList from "@/components/ExpenseList";
import { useEffect, useState } from "react"; // ← useState追加
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function Home() {
  const router = useRouter();

  // ===== 追加① state =====
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
  new Date().toISOString().slice(0, 7)
);
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ===== 追加② データ取得 =====
  const fetchExpenses = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setExpenses(data || []);
    }
  };


const filteredExpenses = expenses.filter((exp) =>
  exp.expense_date.startsWith(selectedMonth)
);

const totalAmount = filteredExpenses.reduce(
  (sum, exp) => sum + exp.amount,
  0
);

const totalCount = filteredExpenses.length;



const categoryData = Object.values(
  filteredExpenses.reduce((acc: any, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = {
        name: exp.category,
        value: 0,
      };
    }

    acc[exp.category].value += exp.amount;

    return acc;
  }, {})
);


const deleteExpense =
async (id: string) => {
  
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (!error) {
    fetchExpenses(); // 再取得して画面更新
  }
};








  // ===== 追加③ 登録処理 =====
  const addExpense = async () => {
    const { data } = await supabase.auth.getUser();
if (!amount || !category || !date) {
  alert("金額・カテゴリ・日付を入力してください。");
  return;
}
    if (!data.user) return;

    const { error } = await supabase.from("expenses").insert({
      user_id: data.user.id,
      amount: Number(amount),
      category,
      memo,
      expense_date: date,
    });

    if (!error) {
      setAmount("");
      setCategory("");
      setMemo("");
      setDate("");

      fetchExpenses(); // ← 追加（更新）
    }
  };






const updateExpense = async () => {
  const { error } = await supabase
    .from("expenses")
    .update({
      amount: Number(amount),
      category,
      memo,
      expense_date: date,
    })
    .eq("id", editingId);

  if (!error) {
    setEditingId(null);

    setAmount("");
    setCategory("");
    setMemo("");
    setDate("");

    fetchExpenses();
  }
};






  // ===== ログインチェック + 初回取得 =====
  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        fetchExpenses(); // ← 追加
      }
    };

    checkLogin();
  }, [router]);

  return (
  <div className="min-h-screen bg-gray-100">
  <div className="max-w-4xl mx-auto p-8">
    <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-4xl font-bold">
      💰 家計簿アプリ
    </h1>

    <p className="text-gray-500">
      毎日の支出を管理しましょう
    </p>
  </div>

  <button
    onClick={logout}
    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
  >
    ログアウト
  </button>
</div>

<input
  type="month"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="border rounded-lg p-2 mb-4"
/>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div className="bg-blue-100 rounded-xl p-5">
    <p className="text-gray-600">今月の支出</p>
    <p className="text-3xl font-bold">
      ¥{totalAmount.toLocaleString()}
    </p>
  </div>

  <div className="bg-green-100 rounded-xl p-5">
    <p className="text-gray-600">支出件数</p>
    <p className="text-3xl font-bold">
      {totalCount}件
    </p>
  </div>
</div>

<div className="bg-white rounded-xl shadow p-6 mb-6">
  <h2 className="text-xl font-bold mb-4">
    カテゴリ別支出
  </h2>

  <ResponsiveContainer width="100%" height={300}>
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
            fill={
              [
                "#3b82f6",
                "#22c55e",
                "#eab308",
                "#ef4444",
                "#a855f7",
              ][index % 5]
            }
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>



      {/* ===== 追加④ 入力フォーム ===== */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">支出登録</h2>

     <input
  type="number"
  placeholder="金額"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="border rounded-lg p-2 w-full mb-3"
/>

      <br />

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border rounded-lg p-2 w-full mb-3"
>
  <option value="">カテゴリを選択</option>
  <option value="食費">🍚 食費</option>
  <option value="交通費">🚃 交通費</option>
  <option value="日用品">🧻 日用品</option>
  <option value="娯楽">🎮 娯楽</option>
  <option value="交際費">🍻 交際費</option>
  <option value="医療費">🏥 医療費</option>
  <option value="その他">📦 その他</option>
</select>

      <br />

      <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="border rounded-lg p-2 w-full mb-3"
/>

      <br />

      <input
  type="text"
  placeholder="メモ"
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
  className="border rounded-lg p-2 w-full mb-3"
/>

      <br />

      {editingId ? (
  <button
    onClick={updateExpense}
    className="bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2
rounded-lg
transition"
  >
    更新
  </button>
) : (
  <button
    onClick={addExpense}
    className="bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2
rounded-lg
transition"
  >
    登録
  </button>
)}
</div>
   <ExpenseList
  expenses={filteredExpenses}
  onDelete={deleteExpense}
  onEdit={(exp) => {
    setEditingId(exp.id);
    setAmount(exp.amount.toString());
    setCategory(exp.category);
    setMemo(exp.memo);
    setDate(exp.expense_date);
  }}
/>   
    </div>
    </div>
  );
}
