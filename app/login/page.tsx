"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async () => {
    setErrorMessage("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      alert("登録しました");
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setErrorMessage("ログインに失敗しました");
        return;
      }

      router.push("/");
    }
  };


  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        bg-gradient-to-br
        from-blue-400
        via-sky-300
        to-indigo-400
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white/90
          backdrop-blur
          rounded-3xl
          shadow-2xl
          p-8
          border
          border-white/50
        "
      >

        <div className="text-center mb-8">

          <div
            className="
              mx-auto
              mb-4
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-blue-500
              text-4xl
              shadow-lg
            "
          >
            💰
          </div>


          <h1
            className="
              text-3xl
              font-black
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-blue-600
              to-cyan-400
            "
          >
            青い箱 家計簿
          </h1>


          <p className="mt-2 text-gray-500">
            あなた専用の支出管理アプリ
          </p>

        </div>



        {errorMessage && (
          <p className="
            mb-4
            text-red-500
            text-sm
          ">
            ⚠ {errorMessage}
          </p>
        )}



        <div className="space-y-4">

          <input
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-200
            "
            placeholder="メールアドレス"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <input
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-200
            "
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


{/* デモアカウント入力 */}
  <button
    onClick={() => {
      setEmail("demo@aoihako.com");
      setPassword("demo123");
    }}
    className="
      w-full
      rounded-xl
      bg-green-500
      py-3
      font-bold
      text-white
      transition
      hover:bg-green-600
    "
  >
    デモアカウントを入力
  </button>




          <button
            onClick={handleAuth}
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
            "
          >
            {isSignup ? "新規登録" : "ログイン"}
          </button>


          <button
            onClick={() =>
              setIsSignup(!isSignup)
            }
            className="
              w-full
              rounded-xl
              bg-gray-100
              py-3
              font-bold
              text-gray-700
              transition
              hover:bg-gray-200
            "
          >
            {isSignup
              ? "ログインへ戻る"
              : "新規登録はこちら"}
          </button>

        </div>


        <p
          className="
            mt-8
            text-center
            text-xs
            text-gray-400
          "
        >
          Created by 青い箱
        </p>

      </div>

    </div>
  );
}

