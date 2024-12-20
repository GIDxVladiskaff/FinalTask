"use client";

import { useEffect } from "react";
import CreatePoll from "../components/CreatePoll";
import PollList from "../components/PollList";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import PollResults from "~~/components/PollResults";

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Убираем console.log, так как он не нужен в продакшене
    // Если нужно что-то сделать при подключении, добавьте логику здесь
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <h1 className="text-4xl font-bold text-center text-orange-900 mb-12">Голосование</h1>

      <div className="flex flex-col items-center space-y-8">
        {/* Компонент для создания нового голосования */}
        {isConnected ? (
          <CreatePoll />
        ) : (
          <div className="p-6 bg-orange-200 text-orange-900 rounded-2xl shadow-lg w-full max-w-2xl text-center">
            <p className="text-lg font-medium">Подключитесь к вашему кошельку, чтобы создать новое голосование.</p>
          </div>
        )}

        {/* Разделитель */}
        <div className="w-full max-w-2xl border-t border-orange-300" />

        {/* Список всех голосований */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Список голосований</h2>
          <PollList />
        </div>

        {/* Разделитель */}
        <div className="w-full max-w-2xl border-t border-orange-300" />

        {/* Список результатов */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Результаты голосований</h2>
          <PollResults />
        </div>
      </div>
    </div>
  );
};

export default Page;
