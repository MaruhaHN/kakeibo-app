type Expense = {
  id: string;
  amount: number;
  category: string;
  memo: string;
  expense_date: string;
};

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        支出一覧
      </h2>

      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="bg-white rounded-xl shadow p-5 mb-4 hover:shadow-lg transition"
        >
          <p className="text-lg font-bold">
            {exp.category}：¥{exp.amount}
          </p>

          <p className="text-gray-500">
            {exp.expense_date}
          </p>

          <p className="mt-2">
            {exp.memo}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(exp)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition"
            >
              編集
            </button>

            <button
              onClick={() => onDelete(exp.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </>
  );
}