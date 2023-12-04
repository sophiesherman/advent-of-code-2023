import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) =>
  rawInput.split(/\r?\n/).map((input) => input.trim());

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput);
  let totalPoints = 0;

  inputs.forEach((item) => {
    const allNumbers = item.trim().split(":")[1];
    const [winningNumbers, numbersIHave] = allNumbers
      .split(" | ")
      .map((nums) => nums.split(" ").filter((num) => num.length > 0));

    let points = 0;

    // Find numbers that match and add points
    winningNumbers
      .filter((num) => numbersIHave?.includes(num))
      .forEach((matchingNums, idx) => {
        points = idx > 0 ? points * 2 : points + 1;
      });

    totalPoints += +points;
  });

  return totalPoints;
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput);
  const numOfGames = inputs.length;
  const cardsWonLookup = {};

  inputs.forEach((item) => {
    const [card, allNumbers] = item.trim().split(":");
    const cardNum = card.trim().split("Card ")[1].trim();
    const cardsWon = [];

    const [winningNumbers, numbersIHave] = allNumbers
      .split(" | ")
      .map((nums) => nums.split(" ").filter((num) => num.length > 0));

    let nextCard = +cardNum + 1;

    // Find numbers that match and add cards won
    winningNumbers
      .filter((num) => numbersIHave.includes(num))
      .forEach(() => {
        if (nextCard <= numOfGames) {
          cardsWon.push(nextCard);
        }
        nextCard += 1;
      });

    cardsWonLookup[cardNum] = cardsWon;
  });

  const scratchCardCopies = {};

  function addScratchCardCopy(cardNum) {
    scratchCardCopies[cardNum] = (scratchCardCopies[cardNum] || 0) + 1;
  }

  function addDeepScratchCardCopies(cardNum) {
    cardsWonLookup[cardNum].forEach((winningCardNum) => {
      addScratchCardCopy(winningCardNum);
      if (cardsWonLookup[winningCardNum]) {
        addDeepScratchCardCopies(winningCardNum);
      }
    });
  }

  Object.keys(cardsWonLookup).forEach((cardNum) => {
    // Original
    addScratchCardCopy(cardNum);

    // Others
    addDeepScratchCardCopies(cardNum);
  });

  return Object.values(scratchCardCopies).reduce(_.add, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
