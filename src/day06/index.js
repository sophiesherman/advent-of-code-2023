import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) =>
  rawInput.split(/\r?\n/).map((input) => input.trim());

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput);
  class Race {
    constructor(time, distance) {
      this.time = time;
      this.distance = distance;
    }

    getRecordOptionsCount() {
      let count = 0;
      for (let i = 0; i <= this.time; i++) {
        const hold = i;
        const speed = i;
        const moveTime = this.time - hold;

        const distanceMade = speed * moveTime;

        if (distanceMade > this.distance) {
          count++;
        }
      }
      return count;
    }
  }

  function transformLine(line) {
    return line
      .split(":")[1]
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e.length > 0)
      .map(Number);
  }

  function registerRaces(times, distances) {
    return _.range(0, times.length).map(
      (raceNum) => new Race(times[raceNum], distances[raceNum]),
    );
  }

  const times = transformLine(inputs[0]);
  const distances = transformLine(inputs[1]);
  const races = registerRaces(times, distances);

  const recordOptionsCounts = races.map((race) => race.getRecordOptionsCount());
  return recordOptionsCounts.reduce(_.multiply, 1);
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput);

  class Race {
    constructor(time, distance) {
      this.time = time;
      this.distance = distance;
    }

    getRecordOptionsCount() {
      let count = 0;
      for (let i = 0; i <= this.time; i++) {
        const hold = i;
        const speed = i;
        const moveTime = this.time - hold;

        const distanceMade = speed * moveTime;

        if (distanceMade > this.distance) {
          count++;
        }
      }
      return count;
    }
  }

  function transformLine(line) {
    return Number(
      line
        .split(":")[1]
        .split(" ")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .join(""),
    );
  }

  const time = transformLine(inputs[0]);
  const distance = transformLine(inputs[1]);
  const race = new Race(time, distance);

  return race.getRecordOptionsCount();
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
