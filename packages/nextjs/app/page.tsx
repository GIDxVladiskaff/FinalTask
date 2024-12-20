"use client";

import { useEffect } from "react";
import CreatePoll from "../components/CreatePoll";
import PollList from "../components/PollList";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import PollResults from "~~/components/PollResults";

// Это хук для получения информации о пользователе

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      console.log("Пользователь подключен: ", address);
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Голосование</h1>

      {/* Компонент для создания нового голосования */}
      <CreatePoll />

      {/* Список всех голосований */}
      <PollList />

      {/* Список результатов */}
      <PollResults />
    </div>
  );
};

export default Page;
