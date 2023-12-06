import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput) =>
  rawInput.split(/\r?\n/).map((input) => input.trim());

const part1 = (rawInput) => {
  const inputs = parseInput(rawInput);

  const seeds = inputs[0]
    .split(": ")[1]
    .split(" ")
    .map((e) => +e);

  let currSource = "";
  let currDestination = "";

  let currSourceResult = {};
  let currDestinationResult = {};

  const mapOrder = {};

  inputs.slice(1).forEach((item, index) => {
    if (item.length === 0) {
      return;
    } else if (item.endsWith(":")) {
      [currSource, currDestination] = item.split(" map:")[0].split("-to-");
      currSourceResult[currSource] = [];
      currDestinationResult[currDestination] = [];

      mapOrder[currSource] = currDestination;
      return;
    } else if (item.length > 0) {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = item
        .trim()
        .split(" ")
        .map((item) => +item);

      const destinationRange = [
        destinationRangeStart,
        destinationRangeStart + rangeLength - 1,
      ];

      const sourceRange = [
        sourceRangeStart,
        sourceRangeStart + rangeLength - 1,
      ];

      currDestinationResult[currDestination].push(destinationRange);
      currSourceResult[currSource].push(sourceRange);
    }
  });

  const locations = [];
  seeds.forEach((seed, i) => {
    let currMapping = seed;
    Object.entries(mapOrder).forEach(([source, destinaton]) => {
      let mapped = false;

      currSourceResult[source].forEach((results, i) => {
        const [lowest, highest] = results;

        if (!mapped && currMapping >= lowest && currMapping <= highest) {
          const sourceOffset = currMapping - lowest;
          currMapping = currDestinationResult[destinaton][i][0] + sourceOffset;
          mapped = true;
        }
      });
      return;
    });

    locations.push(+currMapping);
  });

  return _.min(locations);
};

const part2 = (rawInput) => {
  const inputs = parseInput(rawInput);

  class Range {
    constructor(start, end, isTransformed = false) {
      this.start = start;
      this.end = end;
      this.isTransformed = isTransformed;
    }

    get length() {
      return this.end - this.start;
    }

    getIntersection(range) {
      if (this.end <= range.start || this.start >= range.end) return null;
      return new Range(
        Math.max(this.start, range.start),
        Math.min(this.end, range.end),
      );
    }

    subtractIntersection(intersection) {
      const result = [];
      if (this.start < intersection.start) {
        result.push(new Range(this.start, intersection.start));
      }
      if (this.end > intersection.end) {
        result.push(new Range(intersection.end, this.end));
      }
      return result;
    }
  }

  function getSeedRanges(seedLine) {
    const ranges = [];
    const seeds = seedLine.split(": ")[1].split(" ").map(Number);

    for (let i = 0; i < seeds.length; i += 2) {
      ranges.push(new Range(seeds[i], seeds[i] + seeds[i + 1]));
    }

    return ranges;
  }

  class Group {
    static destinaton = new Range();
    static source = new Range();

    constructor(groupString) {
      const [destinationStart, sourceStart, length] = groupString
        .trim()
        .split(" ")
        .map(Number);

      this.destination = new Range(destinationStart, destinationStart + length);
      this.source = new Range(sourceStart, sourceStart + length);
    }

    get offset() {
      return this.destination.start - this.source.start;
    }

    intersectRange(inputRange) {
      if (inputRange.isTransformed) return [inputRange];

      const intersection = this.source.getIntersection(inputRange);

      if (!intersection) return [inputRange];

      const transformed = new Range(
        intersection.start + this.offset,
        intersection.end + this.offset,
        true,
      );

      return [transformed, ...inputRange.subtractIntersection(intersection)];
    }
  }

  function getGroups(lines) {
    let groups = [];
    lines.forEach((item) => {
      if (item.endsWith(":")) {
        return;
      } else if (item.length === 0) {
        groups.push([]);
        return;
      } else if (item.length > 0) {
        groups[groups.length - 1].push(new Group(item));
      }
    });
    return groups;
  }

  const resetTransformed = (ranges) => {
    for (const range of ranges) {
      range.isTransformed = false;
    }
  };

  const calculateGroupTransform = (ranges, group) => {
    for (const item of group) {
      ranges = ranges.flatMap((range) => item.intersectRange(range));
    }
    return ranges;
  };

  const calculateLocation = (ranges, groups) => {
    for (const group of groups) {
      resetTransformed(ranges);
      ranges = calculateGroupTransform(ranges, group);
    }
    return ranges;
  };

  const getMin = (ranges) => {
    let min = Infinity;
    for (const range of ranges) {
      min = Math.min(min, range.start);
    }
    return min;
  };

  const seedRanges = getSeedRanges(inputs[0]);
  const groupMapping = getGroups(inputs.slice(1));
  return getMin(calculateLocation(seedRanges, groupMapping));
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
