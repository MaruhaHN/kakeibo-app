"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      router.replace("/");
    }
  };

  checkUser();
}, [router]);
  const signUp = async () => {
     if (!email || !password) {
    alert("メールアドレスとパスワードを入力してください");
    return;
  }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

   if (error) {
  setMessage(error.message);
} else {
  setMessage("登録しました。メールを確認してください");
}
  };

 const signIn = async () => {
   setLoading(true);
  setMessage("");
 if (!email || !password) {
  setMessage("メールアドレスとパスワードを入力してください");
   setLoading(false);
  return;
}
  if (password.length < 8) {
  setMessage("パスワードは8文字以上にしてください");
   setLoading(false);
  return;
}
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
 
  console.log(error);
  console.log(data);
  

  if (error) {
    setMessage(error.message);
     setLoading(false);
  } else {
    router.push("/"); // ←これ追加（重要）
  }
};




  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">

    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

      <h1 className="text-3xl font-bold text-center mb-6">
        💰 家計簿アプリ
      </h1>

      <p className="text-gray-500 text-center mb-6">
        ログインしてください
      </p>
{message && (
  <p className="text-red-500 text-sm mb-4 text-center">
    {message}
  </p>
)}

      <input
        className="border rounded-lg p-3 w-full mb-4"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => {
  setEmail(e.target.value);
  setMessage("");
}}
      />


      <div className="relative mb-6">

  <input
    className="border rounded-lg p-3 w-full pr-12"
    type={showPassword ? "text" : "password"}
    placeholder="パスワード"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      setMessage("");
    }}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3 text-gray-500"
  >
    {showPassword ? "🙈" : "👁"}
  </button>

</div>


      <button
  onClick={signIn}
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white w-full py-3 rounded-lg mb-3 transition"
>
  {loading ? "ログイン中..." : "ログイン"}
</button>


      <button
        onClick={signUp}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full py-3 rounded-lg transition"
      >
        新規登録
      </button>

    </div>

  </div>
);
}