"use client";

import MonthlyChart from "@/components/MonthlyChart";
import CategoryChart from "@/components/CategoryChart";
import ExpenseList from "@/components/ExpenseList";
import SummaryCards from "@/components/SummaryCards";
import ReceiptScanner from "@/components/ReceiptScanner";
import Tesseract, { createWorker } from "tesseract.js";
import { useEffect, useState } from "react"; // ← useState追加
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
type CategoryData = {
  name: string;
  value: number;
};
type Expense = {
  id: string;
  amount: number;
  category: string;
  memo: string;
  expense_date: string;
  created_at: string;
};
export default function Home() {
  const router = useRouter();

  // ===== 追加① state =====
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [showReceiptConfirm, setShowReceiptConfirm] = useState(false);
  const readReceipt = async () => {

  if (!receiptImage) return;

  setOcrLoading(true);


  const worker = await createWorker("jpn");


  const result = await worker.recognize(
    receiptImage
  );


  const text = result.data.text;
  // カテゴリ自動判定

const lowerText = text.toLowerCase();


if(
  lowerText.includes("スーパー") ||
  lowerText.includes("コンビニ") ||
  lowerText.includes("食品") ||
  lowerText.includes("弁当") ||
  lowerText.includes("食")
){

  setCategory("食費");

}

else if(
  lowerText.includes("jr") ||
  lowerText.includes("駅") ||
  lowerText.includes("電車") ||
  lowerText.includes("バス")
){

  setCategory("交通費");

}

else if(
  lowerText.includes("薬") ||
  lowerText.includes("病院") ||
  lowerText.includes("ドラッグ")
){

  setCategory("医療費");

}

else if(
  lowerText.includes("映画") ||
  lowerText.includes("ゲーム") ||
  lowerText.includes("カラオケ")
){

  setCategory("娯楽");

}

else if(
  lowerText.includes("amazon") ||
  lowerText.includes("洗剤") ||
  lowerText.includes("日用品")
){

  setCategory("日用品");

}

else{

  setCategory("その他");

}
// 店名候補
const lines = text
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);


if(lines.length > 0){

  setMemo(lines[0]);

}
const dateMatch = text.match(
  /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})/
);


if(dateMatch){

  const year = dateMatch[1];
  const month =
    dateMatch[2].padStart(2,"0");

  const day =
    dateMatch[3].padStart(2,"0");


  setDate(
    `${year}-${month}-${day}`
  );

}

  console.log(text);
const priceMatch = text.match(
  /(合計|税込|総額|支払|お買上|計)[^\d]*(\d{1,6})/
);


if(priceMatch){

  setAmount(
    priceMatch[2]
  );

}else{

  const numbers = text.match(
    /\d{3,}/g
  );


  if(numbers){

    const price =
      numbers
      .map(Number)
      .sort((a,b)=>b-a)[0];


    setAmount(
      price.toString()
    );

  }

}

 

  await worker.terminate();


  setOcrLoading(false);
setShowReceiptConfirm(true);
};

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiptImage,setReceiptImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
  new Date().toISOString().slice(0, 7)
);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ===== 追加② データ取得 =====
 const fetchExpenses = async () => {
  setLoading(true);

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
  setErrorMessage("データの取得に失敗しました");
  setLoading(false);
  return;
}

setExpenses(data || []);

setLoading(false);
};
 const filteredExpenses = expenses.filter((exp) => {
  const matchMonth =
    exp.expense_date.startsWith(selectedMonth);

  const matchCategory =
    selectedCategory === "すべて" ||
    exp.category === selectedCategory;

  return matchMonth && matchCategory;
});

const totalAmount = filteredExpenses.reduce(
  (sum, exp) => sum + exp.amount,
  0
);

const totalCount = filteredExpenses.length;



const categoryData: CategoryData[] = Object.values(
  filteredExpenses.reduce<Record<string, CategoryData>>(
    (acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = {
          name: exp.category,
          value: 0,
        };
      }

      acc[exp.category].value += exp.amount;

      return acc;
    },
    {}
  )
);
const topCategories = [...categoryData]
  .sort((a, b) => b.value - a.value)
  .slice(0, 3);


const monthlyData = Object.values(
  expenses.reduce<Record<string, {month:string; value:number}>>(
    (acc, exp) => {

      const month =
        exp.expense_date.slice(0, 7);

      if (!acc[month]) {
        acc[month] = {
          month,
          value: 0,
        };
      }

      acc[month].value += exp.amount;

      return acc;

    },
    {}
  )
);

const currentMonthTotal = totalAmount;

const currentDate = new Date(selectedMonth + "-01");

const previousMonth = new Date(currentDate);
previousMonth.setMonth(previousMonth.getMonth() - 1);

const previousMonthString =
  previousMonth.toISOString().slice(0, 7);

const previousMonthTotal = expenses
  .filter((exp) =>
    exp.expense_date.startsWith(previousMonthString)
  )
  .reduce((sum, exp) => sum + exp.amount, 0);

const diff = currentMonthTotal - previousMonthTotal;


const deleteExpense = async (id: string) => {

  const confirmDelete = window.confirm(
    "この支出を削除しますか？"
  );

  if (!confirmDelete) {
    return;
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (!error) {
    setSuccessMessage("✅ 削除しました");

    fetchExpenses();

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }
};








  // ===== 追加③ 登録処理 =====
  const addExpense = async () => {
  setErrorMessage("");
  setSuccessMessage("");
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

if (error) {
  setErrorMessage("登録に失敗しました");
  return;
}

if (!error) {
  setAmount("");
  setCategory("");
  setMemo("");
  setDate("");

  setSuccessMessage("✅ 登録しました");

  fetchExpenses();

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
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
  <>
    {loading ? (
      <p className="text-center mt-10">
        読み込み中...
      </p>
    ) : (
      <div
className="
min-h-screen
flex
justify-center
px-4
bg-gradient-to-br
from-blue-100
via-sky-50
to-indigo-100
"
>
<div
className="
w-full
max-w-4xl
mt-10
mb-10
p-6
sm:p-8
bg-white/90
backdrop-blur
rounded-3xl
shadow-2xl
border
border-white
"
>
    <div className="flex justify-between items-center mb-8">
  <div>
    <h1
className="
text-center
text-4xl
sm:text-5xl
font-black
text-transparent
bg-clip-text
bg-gradient-to-r
from-blue-600
to-cyan-400
"
>
💰 青い箱 家計簿
</h1>

    <p className="
text-center
mt-2
text-gray-500
">
      毎日の支出を管理しましょう
    </p>
   {errorMessage && (
  <p className="text-red-500 mt-2">
    ⚠ {errorMessage}
  </p>
)}

{successMessage && (
  <p className="text-green-600 mt-2">
    {successMessage}
  </p>
)}
  </div>

  <button
    onClick={logout}
    className="
rounded-xl
bg-red-500
px-5
py-3
text-white
transition
hover:bg-red-600
"
  >
    ログアウト
  </button>
</div>

<div className="bg-blue-50 rounded-3xl shadow-lg p-5 mb-6">
  <h2 className="font-bold text-lg mb-4">
    🔎 絞り込み
  </h2>

  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="flex-1 rounded-xl border border-gray-200 p-3"
    />

    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="flex-1 rounded-xl border border-gray-200 p-3"
    >
  <option value="すべて">
    すべて
  </option>

  <option value="食費">
    🍚 食費
  </option>

  <option value="交通費">
    🚃 交通費
  </option>

  <option value="日用品">
    🧻 日用品
  </option>

  <option value="娯楽">
    🎮 娯楽
  </option>

  <option value="交際費">
    🍻 交際費
  </option>

  <option value="医療費">
    🏥 医療費
  </option>

  <option value="その他">
    📦 その他
  </option>
</select>
</div>
</div>
<SummaryCards
  totalAmount={totalAmount}
  totalCount={totalCount}
/>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

  <div className="
bg-white/90
backdrop-blur
rounded-3xl
shadow-2xl
border
border-white
p-6
">
    <p className="text-gray-500 text-sm">
      📈 前月との差
    </p>

    <p
      className={`text-3xl font-bold ${
        diff >= 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {diff >= 0 ? "+" : "-"}¥
      {Math.abs(diff).toLocaleString()}
    </p>
  </div>

  <div className="
bg-white/90
backdrop-blur
rounded-3xl
shadow-2xl
border
border-white
p-6
">
    <p className="text-gray-500 text-sm">
      💰 前月の支出
    </p>

    <p className="text-3xl font-bold text-blue-600">
      ¥{previousMonthTotal.toLocaleString()}
    </p>
  </div>

</div>

<div className="
bg-white/90
backdrop-blur
rounded-3xl
shadow-2xl
border
border-white
p-6
mb-6
">
  <h2 className="text-xl font-bold mb-4">
    🏆 支出ランキング TOP3
  </h2>

  {topCategories.length === 0 ? (
    <p className="text-gray-400">
      データがありません
    </p>
  ) : (
    topCategories.map((item, index) => (
      <div
        key={item.name}
        className="flex justify-between items-center py-3 border-b last:border-none"
      >
        <div className="font-semibold">
          {index === 0 && "🥇 "}
          {index === 1 && "🥈 "}
          {index === 2 && "🥉 "}
          {item.name}
        </div>

        <div className="text-blue-600 font-bold">
          ¥{item.value.toLocaleString()}
        </div>
      </div>
    ))
  )}
</div>
<CategoryChart
  categoryData={categoryData}
/>





<MonthlyChart monthlyData={monthlyData} />


      {/* ===== 追加④ 入力フォーム ===== */}
      <div
className="
bg-gradient-to-br
from-blue-50
to-cyan-50
rounded-3xl
shadow-xl
border
border-white
p-6
mb-8
"
>
      <h2 className="text-xl font-bold mb-4">支出登録</h2>
    


<label
className="
w-full
block
text-center
rounded-xl
bg-cyan-500
py-3
text-white
font-bold
cursor-pointer
hover:bg-cyan-600
mb-4
"
>
📷 レシートを撮影

<input
type="file"
accept="image/*"
capture="environment"
hidden
onChange={(e)=>{

if(e.target.files){
setReceiptImage(e.target.files[0]);
}

}}
/>

</label>
{receiptImage && (
<img
src={URL.createObjectURL(receiptImage)}
className="
rounded-xl
shadow
mb-4
"
/>
)}
{showReceiptConfirm && (
<div
className="
bg-white
rounded-3xl
shadow-lg
p-6
mb-6
border
border-blue-100
"
>

<h3 className="
text-xl
font-bold
mb-4
text-blue-600
">
📄 読み取り結果
</h3>


<p>
💰 金額：
¥{amount}
</p>


<p>
📂 カテゴリ：
{category}
</p>


<p>
📅 日付：
{date}
</p>


<p>
📝 メモ：
{memo}
</p>


<button
className="
mt-4
w-full
rounded-xl
bg-blue-600
py-3
text-white
font-bold
"
onClick={async () => {
  await addExpense();
  setShowReceiptConfirm(false);
}}
>
この内容で登録
</button>


</div>
)}
{receiptImage && (
<button
className="
w-full
rounded-xl
bg-purple-600
py-3
text-white
font-bold
mb-4
hover:bg-purple-700
"
onClick={readReceipt}
>

{ocrLoading
?
"読み取り中..."
:
"🤖 レシートを読み取る"
}

</button>
)}

     <input
  type="number"
  placeholder="金額"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
transition
focus:border-blue-500
focus:ring-4
focus:ring-blue-200
mb-3
"
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
  className="
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
transition
focus:border-blue-500
focus:ring-4
focus:ring-blue-200
mb-3
"
/>

      <br />

      <input
  type="text"
  placeholder="メモ"
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
  className="
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
transition
focus:border-blue-500
focus:ring-4
focus:ring-blue-200
mb-3
"
/>

      <br />

      {editingId ? (
  <button
    onClick={updateExpense}
   className="bg-sky-500 hover:bg-sky-600
text-white
px-6
py-3
w-full
rounded-lg
transition"
  >
    更新
  </button>
) : (
  <button
    onClick={addExpense}
    className="
w-full
rounded-xl
bg-blue-600
py-3
font-bold
text-white
shadow-lg
transition
hover:bg-blue-700
hover:-translate-y-1
active:scale-95
">
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
<footer className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
  Created by 青い箱
</footer>
</div>
</div>


)}
</>
);
}