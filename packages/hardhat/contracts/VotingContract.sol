// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Смарт-контракт для голосования
 * @dev Позволяет создавать голосования, голосовать, завершать голосования с подсчетом голосов,
 * а также проверять, проголосовал ли пользователь.
 */
contract VotingContract {
    // Константы
    string public constant GREETING = "Building Unstoppable Apps!!!";

    // События
    event PollCreated(uint256 indexed pollId, string question, uint256 endTime, address indexed creator);
    event Voted(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    event PollEnded(uint256 indexed pollId, address indexed creator);

    // Структура, описывающая голосование
    struct Poll {
        string question; // Вопрос голосования
        string[] options; // Варианты ответа
        mapping(uint256 => uint256) voteCounts; // Количество голосов для каждого варианта
        mapping(address => bool) hasVoted; // Отслеживание проголосовавших участников
        uint256 endTime; // Время завершения голосования (в секундах)
        bool isActive; // Статус активности голосования
        address creator; // Создатель голосования
    }

    // Список всех созданных голосований
    Poll[] public polls;

    // Модификатор для проверки существования голосования
    modifier pollExists(uint256 _pollId) {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        _;
    }

    // Модификатор для проверки активности голосования
    modifier isActivePoll(uint256 _pollId) {
        require(polls[_pollId].isActive, "The voting is not active");
        _;
    }

    // Модификатор для проверки, что голосование завершено
    modifier isPollEnded(uint256 _pollId) {
        require(block.timestamp >= polls[_pollId].endTime, "The voting is still active");
        _;
    }

    // Модификатор для проверки, что пользователь не голосовал
    modifier hasNotVoted(uint256 _pollId) {
        require(!polls[_pollId].hasVoted[msg.sender], "You have already voted");
        _;
    }

    /**
     * @dev Создает новое голосование.
     * @param _question Вопрос голосования.
     * @param _options Варианты ответа для голосования.
     * @param _duration Продолжительность голосования в секундах.
     */
    function createPoll(string memory _question, string[] memory _options, uint256 _duration) public {
        require(_options.length > 1, "There must be at least two possible answers");
        require(_duration > 0, "The duration must be greater than zero");

        uint256 pollId = polls.length;
        polls.push();
        Poll storage newPoll = polls[pollId];
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.endTime = block.timestamp + _duration;
        newPoll.isActive = true;
        newPoll.creator = msg.sender;

        emit PollCreated(pollId, _question, newPoll.endTime, msg.sender);
    }

    /**
     * @dev Голосует за определенный вариант в голосовании.
     * @param _pollId ID голосования.
     * @param _optionIndex Индекс выбранного варианта.
     */
    function vote(uint256 _pollId, uint256 _optionIndex) public pollExists(_pollId) isActivePoll(_pollId) hasNotVoted(_pollId) {
        Poll storage poll = polls[_pollId];

        require(block.timestamp < poll.endTime, "The voting is completed");
        require(_optionIndex < poll.options.length, "Invalid option index");

        // Устанавливаем, что пользователь проголосовал
        poll.hasVoted[msg.sender] = true;
        // Увеличиваем счетчик голосов для выбранного варианта
        poll.voteCounts[_optionIndex]++;

        emit Voted(_pollId, msg.sender, _optionIndex);
    }

    /**
     * @dev Завершает голосование и деактивирует его.
     * @param _pollId ID голосования.
     */
    function endPoll(uint256 _pollId) public pollExists(_pollId) isActivePoll(_pollId) isPollEnded(_pollId) {
        Poll storage poll = polls[_pollId];

        require(msg.sender == poll.creator, "Only the creator can complete the voting");

        // Деактивируем голосование
        poll.isActive = false;

        emit PollEnded(_pollId, msg.sender);
    }

    /**
     * @dev Получает результаты голосования.
     * @param _pollId ID голосования.
     * @return options Массив вариантов ответа.
     * @return voteCounts Массив количества голосов для каждого варианта.
     */
    function getResults(uint256 _pollId) public view pollExists(_pollId) returns (string[] memory options, uint256[] memory voteCounts) {
        Poll storage poll = polls[_pollId];

        options = poll.options;
        voteCounts = new uint256[](poll.options.length);

        for (uint256 i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.voteCounts[i];
        }
    }

    /**
     * @dev Возвращает общее количество голосований.
     * @return Количество созданных голосований.
     */
    function getPollCount() public view returns (uint256) {
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
    function getPollDetails(uint256 _pollId) public view pollExists(_pollId) returns (
        string memory question,
        string[] memory options,
        uint256 endTime,
        bool isActive,
        address creator
    ) {
        Poll storage poll = polls[_pollId];
        return (poll.question, poll.options, poll.endTime, poll.isActive, poll.creator);
    }

    /**
     * @dev Проверяет, голосовал ли пользователь в данном голосовании.
     * @param _pollId ID голосования.
     * @param _voter Адрес пользователя.
     * @return True, если пользователь уже голосовал, иначе False.
     */
    function hasUserVoted(uint256 _pollId, address _voter) public view pollExists(_pollId) returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }
}