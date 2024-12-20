import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  // Хук для чтения данных о том, проголосовал ли пользователь
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "hasUserVoted", // Функция для проверки, проголосовал ли пользователь
    args: [pollId, userAddress], // Аргументы: идентификатор голосования и адрес пользователя
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md mt-4">
      {hasVoted ? (
        <p className="text-xl font-semibold">Вы уже проголосовали в этом голосовании.</p> // Если пользователь проголосовал
      ) : (
        <p className="text-xl font-semibold">Вы ещё не проголосовали в этом голосовании.</p> // Если пользователь не проголосовал
      )}
    </div>
  );
}
