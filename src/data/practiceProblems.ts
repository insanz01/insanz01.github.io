export interface TestCase {
  label: string;
  args: unknown[];
  expected: unknown;
  isHidden?: boolean;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium";
  topic: string;
  fnName: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  tests: TestCase[];
  normalizeResult?: (val: unknown) => unknown;
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    topic: "Hash Map",
    fnName: "twoSum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}\n`,
    tests: [
      { label: "Sample 1", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { label: "Sample 2", args: [[3, 2, 4], 6], expected: [1, 2] },
      { label: "Duplicates", args: [[3, 3], 6], expected: [0, 1], isHidden: true },
      { label: "Negatives", args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], isHidden: true },
    ],
  },
  {
    id: "valid-palindrome",
    title: "2. Valid Palindrome",
    difficulty: "Easy",
    topic: "Strings",
    fnName: "isPalindrome",
    description:
      "Given a string s, return true if it is a palindrome after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, or false otherwise.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    starterCode: `function isPalindrome(s) {\n  // Write your solution here\n  \n}\n`,
    tests: [
      { label: "Sample 1", args: ["A man, a plan, a canal: Panama"], expected: true },
      { label: "Sample 2", args: ["race a car"], expected: false },
      { label: "Empty / Space", args: [" "], expected: true, isHidden: true },
      { label: "Alphanumeric", args: ["0P"], expected: false, isHidden: true },
    ],
  },
  {
    id: "valid-parentheses",
    title: "3. Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    fnName: "isValid",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
    starterCode: `function isValid(s) {\n  // Write your solution here\n  \n}\n`,
    tests: [
      { label: "Sample 1", args: ["()[]{}"], expected: true },
      { label: "Sample 2", args: ["(]"], expected: false },
      { label: "Nested", args: ["({[]})"], expected: true, isHidden: true },
      { label: "Unclosed", args: ["(("], expected: false, isHidden: true },
    ],
  },
  {
    id: "max-subarray",
    title: "4. Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    fnName: "maxSubArray",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.",
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum 6.",
      },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: `function maxSubArray(nums) {\n  // Kadane's algorithm\n  \n}\n`,
    tests: [
      { label: "Sample 1", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { label: "Sample 2", args: [[1]], expected: 1 },
      { label: "All Negative", args: [[-3, -2, -5, -1]], expected: -1, isHidden: true },
      { label: "Mixed", args: [[5, 4, -1, 7, 8]], expected: 23, isHidden: true },
    ],
  },
  {
    id: "group-anagrams",
    title: "5. Group Anagrams",
    difficulty: "Medium",
    topic: "Hash Map",
    fnName: "groupAnagrams",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
      },
    ],
    constraints: ["1 <= strs.length <= 10^4", "strs[i] consists of lowercase English letters."],
    starterCode: `function groupAnagrams(strs) {\n  // Write your solution here\n  \n}\n`,
    normalizeResult: (val: unknown) => {
      if (!Array.isArray(val)) return val;
      return val
        .map((group) => (Array.isArray(group) ? [...group].map(String).sort() : group))
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    },
    tests: [
      {
        label: "Sample 1",
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]],
      },
      { label: "Single Empty", args: [[""]], expected: [[""]] },
      { label: "Single Char", args: [["a"]], expected: [["a"]], isHidden: true },
    ],
  },
];
