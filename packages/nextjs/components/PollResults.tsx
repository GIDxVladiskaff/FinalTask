import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);

  // Чтение результатов голосования
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getResults", // Функция для получения результатов
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h3 className="text-2xl font-bold mb-4">Результаты голосования</h3>
      <input
        type="number"
        placeholder="ID голосования"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      {data && (
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-lg shadow-lg w-full mx-auto">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg mb-2">
                {option}: {Number(data[1][idx])} голосов
                {/*Показываем результат для каждого варианта*/}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
