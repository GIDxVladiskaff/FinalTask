import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    try {
      // Выполняем транзакцию на завершение голосования
      await writeContractAsync({
        functionName: "endPoll", // Имя функции контракта для завершения голосования
        args: [pollId], // Аргумент: идентификатор голосования
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold">Завершить голосование</h3>
      <p>Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndPoll} // Завершаем голосование при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`mt-4 px-6 py-2 rounded-lg ${isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить голосование"}
      </button>
    </div>
  );
}
