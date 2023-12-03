import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) => rawInput.split(/\r?\n/);

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput).map((input) => input.trim());

  // Map out symbol and number locations
  const symbolLocations = {};
  const numLocations = {};

  inputs.forEach((current, index) => {
    numLocations[index] = [];
    symbolLocations[index] = [];

    let currNumber = "";
    let currNumIndexes = [];

    function resetCurrNumber() {
      if (currNumber) {
        numLocations[index].push([currNumber, currNumIndexes]);
        currNumber = "";
        currNumIndexes = [];
      }
    }

    current.split("").forEach((char, charIndex) => {
      if (char === ".") {
        resetCurrNumber();
      } else if (char >= "0" && char <= "9") {
        currNumber = `${currNumber}${char}`;
        currNumIndexes.push(charIndex);

        if (charIndex === current.length - 1) {
          resetCurrNumber();
        }
      } else {
        resetCurrNumber();
        // symbol
        symbolLocations[index].push(charIndex);
      }
    });
  });

  // Determine if number is valid (adjacent to a symbol)
  const numbersToAdd = [];
  Object.entries(numLocations).forEach(([row, items]) => {
    items.forEach(([number, indexes]) => {
      let addNumber = false;

      // Add one less and one more to account for diagonal cases
      indexes = [indexes[0] - 1, ...indexes, indexes[indexes.length - 1] + 1];

      indexes.forEach((idx) => {
        if (
          // Previous row
          (symbolLocations[+row - 1] &&
            symbolLocations[+row - 1].includes(idx)) ||
          // Current row
          symbolLocations[+row].includes(idx) ||
          // Next row
          (symbolLocations[+row + 1] &&
            symbolLocations?.[+row + 1].includes(idx))
        ) {
          addNumber = true;
        }
      });

      if (addNumber) {
        numbersToAdd.push(+number);
      }
    });
  });

  return numbersToAdd.reduce(_.add, 0);
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput).map((input) => input.trim());

  // Map out gear and number locations
  const gearLocations = {};
  const numLocations = {};
  inputs.forEach((current, index) => {
    numLocations[index] = [];
    gearLocations[index] = [];

    let currNumber = "";
    let currNumIndexes = [];

    function resetCurrNumber() {
      if (currNumber) {
        numLocations[index].push([currNumber, currNumIndexes]);
        currNumber = "";
        currNumIndexes = [];
      }
    }

    current.split("").forEach((char, charIndex) => {
      if (char === ".") {
        resetCurrNumber();
      } else if (char >= "0" && char <= "9") {
        currNumber = `${currNumber}${char}`;
        currNumIndexes.push(charIndex);

        if (charIndex === current.length - 1) {
          resetCurrNumber();
        }
      } else if (char === "*") {
        resetCurrNumber();
        gearLocations[index].push(charIndex);
      }
    });
  });

  // Determine if gear valid (has exactly two adjacent part numbers)
  const numbersToAdd = [];
  function getGearPartNumbers(rowNumLocations, gearLocation) {
    const numbers = [];
    rowNumLocations.forEach(([number, numIndexes]) => {
      // Add one less and one more to account for diagonal cases
      numIndexes = [
        numIndexes[0] - 1,
        ...numIndexes,
        numIndexes[numIndexes.length - 1] + 1,
      ];
      if (numIndexes.includes(gearLocation)) {
        numbers.push(+number);
      }
    });

    return numbers;
  }
  Object.entries(gearLocations).forEach(([row, indexes]) => {
    indexes.forEach((gearLocation) => {
      let gearNumbers = [];

      // Previous row
      if (numLocations[+row - 1]) {
        gearNumbers = [
          ...gearNumbers,
          ...getGearPartNumbers(numLocations[+row - 1], gearLocation),
        ];
      }

      // Current row
      if (numLocations[row]) {
        gearNumbers = [
          ...gearNumbers,
          ...getGearPartNumbers(numLocations[row], gearLocation),
        ];
      }

      // Next row
      if (numLocations[+row + 1]) {
        gearNumbers = [
          ...gearNumbers,
          ...getGearPartNumbers(numLocations[+row + 1], gearLocation),
        ];
      }

      if (gearNumbers.length == 2) {
        numbersToAdd.push(gearNumbers.reduce(_.multiply, 1));
      }
    });
  });

  return numbersToAdd.reduce(_.add, 0);
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
