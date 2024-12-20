import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function UserVoted({ pollId }: { pollId: bigint }) {
  const [hasVoted, setHasVoted] = useState<boolean | undefined>(undefined);

  // Хук для чтения данных о том, проголосовал ли пользователь
  const { data: userHasVoted } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [pollId, useAccount().address],
  });

  useEffect(() => {
    if (userHasVoted !== undefined) {
      setHasVoted(userHasVoted);
    }
  }, [userHasVoted]);

  if (hasVoted === undefined) {
    return (
      <div className="p-6 bg-orange-200 text-orange-900 rounded-2xl shadow-lg mt-6 flex justify-center items-center">
        <p className="text-lg font-medium">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-orange-200 text-orange-900 rounded-2xl shadow-lg mt-6 flex flex-col items-center">
      <p className="text-xl font-semibold text-center">
        {hasVoted ? "Вы уже проголосовали в этом голосовании." : "Вы ещё не проголосовали в этом голосовании."}
      </p>
      <p className="text-sm mt-2 text-center">
        {hasVoted ? "Спасибо за участие!" : "Вы можете проголосовать, выбрав один из вариантов выше."}
      </p>
    </div>
  );
}
