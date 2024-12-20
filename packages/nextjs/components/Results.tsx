import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function Results() {
  const [pollId, setPollId] = useState<number>(-1);

  // Чтение результатов голосования
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getResults",
    args: [BigInt(pollId)],
  });

  return (
    <div className="p-8 bg-orange-900 text-white rounded-3xl shadow-3xl mx-auto max-w-2xl">
      <h3 className="text-3xl font-bold mb-6 text-center text-yellow-400">Результаты голосования</h3>
      <div className="flex flex-col items-center mb-6">
        <input
          type="number"
          placeholder="ID голосования"
          onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
          className="w-full max-w-md p-4 text-orange-900 rounded-2xl border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <button
          onClick={() => setPollId(pollId)} // Просто для демонстрации, можно добавить дополнительную логику
          className="mt-4 w-full max-w-md px-6 py-3 bg-yellow-400 text-orange-900 rounded-2xl hover:bg-yellow-500 transition duration-300 font-medium"
        >
          Показать результаты
        </button>
      </div>
      {data && (
        <div className="p-8 bg-yellow-400 text-orange-900 rounded-3xl shadow-3xl w-full mx-auto">
          <ul className="space-y-4">
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg flex justify-between items-center">
                <span className="font-medium">{option}</span>
                <span className="font-bold">{Number(data[1][idx])} голосов</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
