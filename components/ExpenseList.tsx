"use client";

type Expense = {
  id: string;
  amount: number;
  category: string;
  memo: string;
  expense_date: string;
};

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

export default function ExpenseList({
  expenses,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">

      <h2 className="
        text-2xl
        font-black
        text-blue-600
        mb-4
      ">
        📦 支出一覧
      </h2>


      {expenses.length === 0 ? (
        <div className="
          bg-white/90
          rounded-3xl
          shadow-lg
          p-6
          text-center
          text-gray-400
        ">
          支出データがありません
        </div>
      ) : (

        expenses.map((expense) => (

          <div
            key={expense.id}
            className="
              bg-white/90
              backdrop-blur
              rounded-3xl
              shadow-lg
              border
              border-white
              p-5
              transition
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >

            <div className="
              flex
              justify-between
              items-start
              gap-3
            ">

              <div>

                <p className="
                  text-xl
                  font-bold
                  text-gray-800
                ">
                  {expense.category}
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
                  ¥{expense.amount.toLocaleString()}
                </p>


                {expense.memo && (
                  <p className="
                    mt-2
                    text-gray-500
                  ">
                    📝 {expense.memo}
                  </p>
                )}


                <p className="
                  mt-2
                  text-sm
                  text-gray-400
                ">
                  📅 {expense.expense_date}
                </p>

              </div>


              <div className="
                flex
                gap-2
              ">

                <button
                  onClick={() => onEdit(expense)}
                  className="
                    rounded-xl
                    bg-blue-500
                    px-3
                    py-2
                    text-white
                    hover:bg-blue-600
                    transition
                  "
                >
                  編集
                </button>


                <button
                  onClick={() => onDelete(expense.id)}
                  className="
                    rounded-xl
                    bg-red-500
                    px-3
                    py-2
                    text-white
                    hover:bg-red-600
                    transition
                  "
                >
                  削除
                </button>

              </div>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

