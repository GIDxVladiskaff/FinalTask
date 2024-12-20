// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Смарт-контракт для голосования
 * @dev Позволяет создавать голосования, голосовать и завершать голосования с подсчетом голосов, а также проверять проголосовал ли пользователь
 */
contract VotingContract {
    string public greeting = "Building Unstoppable Apps!!!";

    // Структура, описывающая голосование
    struct Poll {
        string question; // Вопрос голосования
        string[] options; // Варианты ответа
        mapping(uint => uint) voteCounts; // Количество голосов для каждого варианта
        mapping(address => bool) hasVoted; // Отслеживание проголосовавших участников
        uint endTime; // Время завершения голосования
        bool isActive; // Статус активности голосования
        address creator; // Создатель голосования
    }

    // Список всех созданных голосований
    Poll[] public polls;

    /**
     * @dev Создает новое голосование.
     * @param _question Вопрос голосования.
     * @param _options Варианты ответа для голосования.
     * @param _duration Продолжительность голосования в секундах.
     */
    function createPoll(string memory _question, string[] memory _options, uint _duration) public {
        require(_options.length > 1, "There must be at least two possible answers");
        require(_duration > 0, "The duration must be greater than zero");

        Poll storage newPoll = polls.push();
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.endTime = block.timestamp + _duration;
        newPoll.isActive = true;
        newPoll.creator = msg.sender;
    }

    /**
     * @dev Голосует за определенный вариант в голосовании.
     * @param _pollId ID голосования.
     * @param _optionIndex Индекс выбранного варианта.
     */
    function vote(uint _pollId, uint _optionIndex) public {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        require(block.timestamp < poll.endTime, "The voting is completed");
        require(poll.isActive, "Voting is not active");
        require(!poll.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < poll.options.length, "Invalid option index");

        // Устанавливаем, что пользователь проголосовал
        poll.hasVoted[msg.sender] = true;
        // Увеличиваем счетчик голосов для выбранного варианта
        poll.voteCounts[_optionIndex]++;
    }

    /**
     * @dev Завершает голосование и деактивирует его.
     * @param _pollId ID голосования.
     */
    function endPoll(uint _pollId) public {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        require(block.timestamp >= poll.endTime, "Voting is still active");
        require(poll.isActive, "The voting has already been completed");
        require(msg.sender == poll.creator, "Only the creator can complete the voting");

        // Деактивируем голосование
        poll.isActive = false;
    }

    /**
     * @dev Получает результаты голосования.
     * @param _pollId ID голосования.
     * @return options Массив вариантов ответа.
     * @return voteCounts Массив количества голосов для каждого варианта.
     */
    function getResults(uint _pollId) public view returns (string[] memory options, uint[] memory voteCounts) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        options = poll.options;
        voteCounts = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.voteCounts[i];
        }
    }

    /**
     * @dev Возвращает общее количество голосований.
     * @return Количество созданных голосований.
     */
    function getPollCount() public view returns (uint) {
        return polls.length;
    }

    /**
     * @dev Возвращает информацию о голосовании по его ID.
     * @param _pollId ID голосования.
     * @return question Вопрос голосования.
     * @return options Массив вариантов ответа.
     * @return endTime Время завершения голосования.
     * @return isActive Статус активности голосования.
     * @return creator Адрес создателя голосования.
     */
    function getPollDetails(uint _pollId) public view returns (
        string memory question,
        string[] memory options,
        uint endTime,
        bool isActive,
        address creator
    ) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];
        return (poll.question, poll.options, poll.endTime, poll.isActive, poll.creator);
    }

    /**
     * @dev Проверяет, голосовал ли пользователь в данном голосовании.
     * @param _pollId ID голосования.
     * @param _voter Адрес пользователя.
     * @return True, если пользователь уже голосовал, иначе False.
     */
    function hasUserVoted(uint _pollId, address _voter) public view returns (bool) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];
        return poll.hasVoted[_voter];
    }
}
