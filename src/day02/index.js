import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) => rawInput.split(/\r?\n/);

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput);

  const maxColorAvailable = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const possibleGames = [];
  inputs.forEach((item) => {
    let possible = true;
    const [game, sets] = item.trim().split(":");

    sets.split("; ").forEach((set) => {
      set.split(", ").forEach((item) => {
        const [count, color] = item.trim().split(" ");
        if (+count > maxColorAvailable[color]) {
          possible = false;
        }
      });
    });

    if (possible) {
      const gameNumber = game.split(" ")[1];
      possibleGames.push(+gameNumber);
    }
  });

  return possibleGames.reduce(_.add, 0);
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput);

  const totals = [];
  inputs.forEach((item) => {
    const minColorRequired = {
      red: 0,
      green: 0,
      blue: 0,
    };
    const sets = item.split(":")[1];

    sets.split("; ").forEach((set) => {
      set.split(", ").forEach((item) => {
        const [count, color] = item.trim().split(" ");
        if (+count > minColorRequired[color]) {
          minColorRequired[color] = +count;
        }
      });
    });
    const cubeSetPower = Object.values(minColorRequired).reduce(_.multiply, 1);
    totals.push(cubeSetPower);
  });

  return totals.reduce(_.add, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
