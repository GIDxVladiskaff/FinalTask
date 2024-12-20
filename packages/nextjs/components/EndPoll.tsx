import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  // Состояние для отображения статуса операции
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    if (window.confirm("Вы уверены, что хотите завершить голосование?")) {
      try {
        // Выполняем транзакцию на завершение голосования
        await writeContractAsync({
          functionName: "endPoll",
          args: [pollId],
        });
        setIsSuccess(true); // Устанавливаем успех
        setTimeout(() => setIsSuccess(false), 3000); // Сбрасываем через 3 секунды
      } catch (error) {
        console.error("Ошибка при завершении голосования:", error);
        alert("Произошла ошибка при завершении голосования. Пожалуйста, попробуйте снова.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="flex flex-col items-start justify-start space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl text-yellow-300">⚠️</span>
          <h3 className="text-2xl font-bold">Завершить голосование</h3>
        </div>
        <p className="text-lg">Вы уверены, что хотите завершить голосование? Это действие необратимо.</p>
        <button
          onClick={handleEndPoll}
          disabled={isMining || isSuccess}
          className={`px-6 py-3 rounded-none text-white font-medium flex items-center justify-center border-2 ${
            isMining
              ? "bg-gray-600 border-gray-600 cursor-not-allowed"
              : isSuccess
                ? "bg-green-600 border-green-600 cursor-not-allowed"
                : "bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition duration-300"
          }`}
        >
          {isMining ? (
            <>
              <span className="animate-spin mr-2">🔄</span> Завершение...
            </>
          ) : isSuccess ? (
            <>
              <span className="mr-2">✅</span> Голосование завершено!
            </>
          ) : (
            "Завершить голосование"
          )}
        </button>
      </div>
    </div>
  );
}
