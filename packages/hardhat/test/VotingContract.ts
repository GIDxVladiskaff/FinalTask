import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { VotingContract } from "../typechain-types";

describe("VotingContract", function () {
  let votingContract: VotingContract;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  // Константы для тестов
  const TEST_QUESTION = "Test Question";
  const TEST_OPTIONS = ["Option 1", "Option 2"];
  const SHORT_DURATION = 1; // 1 секунда
  const LONG_DURATION = 3600; // 1 час

  // Функция для создания голосования
  async function createPoll(duration: number = LONG_DURATION) {
    await votingContract.createPoll(TEST_QUESTION, TEST_OPTIONS, duration);
  }

  // Функция для перемотки времени
  async function advanceTime(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
  }

  beforeEach(async () => {
    const votingContractFactory = await ethers.getContractFactory("VotingContract");
    votingContract = await votingContractFactory.deploy();
    await votingContract.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Poll Creation", () => {
    it("Should create a poll successfully", async () => {
      await createPoll();

      const poll = await votingContract.getPollDetails(0);
      expect(poll.question).to.equal(TEST_QUESTION);
      expect(poll.options).to.deep.equal(TEST_OPTIONS);
      expect(poll.isActive).to.equal(true);
      expect(poll.creator).to.equal(owner.address);
      expect(poll.endTime).to.be.greaterThan(0);
    });

    it("Should not allow poll creation with less than 2 options", async () => {
      await expect(votingContract.createPoll(TEST_QUESTION, ["Option 1"], LONG_DURATION)).to.be.revertedWith(
        "There must be at least two possible answers",
      );
    });

    it("Should not allow poll creation with zero duration", async () => {
      await expect(votingContract.createPoll(TEST_QUESTION, TEST_OPTIONS, 0)).to.be.revertedWith(
        "The duration must be greater than zero",
      );
    });
  });

  describe("Voting", () => {
    beforeEach(async () => {
      await createPoll();
    });

    it("Should allow a user to vote", async () => {
      await votingContract.connect(addr1).vote(0, 0);
      const hasVoted = await votingContract.hasUserVoted(0, addr1.address);
      expect(hasVoted).to.equal(true);
    });

    it("Should prevent duplicate voting", async () => {
      await votingContract.connect(addr1).vote(0, 0);
      await expect(votingContract.connect(addr1).vote(0, 0)).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting after poll end time", async () => {
      await advanceTime(LONG_DURATION + 1);
      await expect(votingContract.connect(addr1).vote(0, 0)).to.be.revertedWith("The voting is completed");
    });

    it("Should not allow voting with an invalid option index", async () => {
      await expect(votingContract.connect(addr1).vote(0, 2)).to.be.revertedWith("Invalid option index");
    });
  });

  describe("Poll Ending", () => {
    it("Should allow only the creator to end the poll", async () => {
      await createPoll(SHORT_DURATION);

      // Перемотка времени, чтобы голосование завершилось
      await advanceTime(SHORT_DURATION + 1);

      await votingContract.endPoll(0);
      const poll = await votingContract.getPollDetails(0);
      expect(poll.isActive).to.equal(false);
    });

    it("Should not allow ending the poll prematurely", async () => {
      await createPoll();
      await expect(votingContract.endPoll(0)).to.be.revertedWith("Voting is still active");
    });

    it("Should not allow non-creator to end the poll", async () => {
      await createPoll(SHORT_DURATION);

      // Перемотка времени, чтобы голосование завершилось
      await advanceTime(SHORT_DURATION + 1);

      await expect(votingContract.connect(addr1).endPoll(0)).to.be.revertedWith(
        "Only the creator can complete the voting",
      );
    });
  });

  describe("Poll Results", () => {
    it("Should return poll results correctly", async () => {
      await createPoll();

      await votingContract.connect(addr1).vote(0, 0);
      await votingContract.connect(addr2).vote(0, 1);

      // Перемотка времени, чтобы голосование завершилось
      await advanceTime(LONG_DURATION + 1);

      await votingContract.endPoll(0);

      const results = await votingContract.getResults(0);
      expect(results.options).to.deep.equal(TEST_OPTIONS);
      expect(results.voteCounts[0]).to.equal(1n);
      expect(results.voteCounts[1]).to.equal(1n);
    });

    it("Should not allow getting results of an active poll", async () => {
      await createPoll();
      await expect(votingContract.getResults(0)).to.be.revertedWith("The voting is not active");
    });
  });
});
