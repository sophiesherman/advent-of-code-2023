import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) => rawInput.split(/\r?\n/);

const add = (accumulator, a) => accumulator + a;

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput);

  const numbers = inputs.map((input) => {
    const strippedNumber = input.replace(/\D+/g, "");
    return +(strippedNumber[0] + strippedNumber[strippedNumber.length - 1]);
  });
  return numbers.reduce(add, 0);
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput);

  const validNums = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  function matchesNumWord(index, input) {
    const newInput = input.substring(index);
    for (const numIdx in validNums) {
      if (newInput.startsWith(validNums[numIdx])) {
        return String(numIdx);
      }
    }
  }

  const numbers = inputs.map((input) => {
    let firstMatch, lastMatch;
    input.split("").forEach((char, index) => {
      let match = false;

      if (char >= "0" && char <= "9") {
        match = true;
      } else {
        const numMatch = matchesNumWord(index, input);
        if (numMatch) {
          match = true;
          char = numMatch;
        }
      }
      if (match) {
        firstMatch = !firstMatch ? char : firstMatch;
        lastMatch = char;
      }
    });

    return +(firstMatch + lastMatch);
  });

  return numbers.reduce(add, 0);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
