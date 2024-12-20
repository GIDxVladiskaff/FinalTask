import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateVoting() {
  // Состояние для вопроса, вариантов ответа, текущего ввода варианта и длительности
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  // Добавление нового варианта ответа
  const addOption = () => {
    if (optionInput.trim()) {
      setOptions(prevOptions => [...prevOptions, optionInput.trim()]);
      setOptionInput("");
    }
  };

  // Создание голосования
  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      try {
        await writeContractAsync({
          functionName: "createPoll",
          args: [question, options, BigInt(duration)],
        });
      } catch (error) {
        console.error("Ошибка при создании голосования:", error);
        alert("Произошла ошибка при создании голосования. Пожалуйста, попробуйте снова.");
      }
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Создать голосование</h2>

        {/* Поле ввода вопроса */}
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-brown-600 mb-2">
            Вопрос голосования
          </label>
          <input
            id="question"
            type="text"
            placeholder="Введите вопрос"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full p-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Поле ввода варианта ответа и кнопка добавления */}
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Добавить вариант ответа"
            value={optionInput}
            onChange={e => setOptionInput(e.target.value)}
            className="flex-1 p-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={addOption}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Добавить
          </button>
        </div>

        {/* Список добавленных вариантов */}
        {options.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-brown-700 mb-2">Добавленные варианты:</h3>
            <ul className="space-y-2">
              {options.map((opt, idx) => (
                <li key={idx} className="text-brown-600 p-2 bg-beige-200 rounded-lg">
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Поле ввода длительности */}
        <div className="mb-6">
          <label htmlFor="duration" className="block text-sm font-medium text-brown-600 mb-2">
            Длительность (в секундах)
          </label>
          <input
            id="duration"
            type="number"
            placeholder="Введите длительность"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-full p-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Кнопка создания голосования */}
        <button
          onClick={createPoll}
          disabled={isMining}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            isMining ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 transition duration-300"
          }`}
        >
          {isMining ? "Создание..." : "Создать голосование"}
        </button>
      </div>
    </div>
  );
}
