import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  // Чтение количества существующих голосований
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  // Функция для рендеринга списка голосований
  const renderPolls = () => {
    if (!pollCount) return <p className="text-white">Загрузка...</p>;
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />);
    }
    return polls;
  };

  return (
    <div className="p-6 bg-orange-500 text-white rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-2xl text-center">Нет активных голосований</p>}
    </div>
  );
}

// Компонент для каждого отдельного голосования
function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [BigInt(pollId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!data) return <p className="text-white">Загрузка...</p>;

  const [question, options, , isActive] = data;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
      <h3 className="text-2xl font-bold text-blue-900 mb-4">{question}</h3>
      <ul className="space-y-4 mb-6">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-blue-900 text-lg">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote",
                    args: [BigInt(pollId), BigInt(idx)],
                  })
                }
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg hover:bg-yellow-500 transition duration-300 font-medium"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="text-red-500 text-center text-lg font-medium">Голосование завершено</p>}
      {isActive && (
        <div className="flex justify-center mt-6">
          <EndPoll pollId={pollId} />
        </div>
      )}
      <HasUserVoted pollId={pollId} />
    </div>
  );
}
