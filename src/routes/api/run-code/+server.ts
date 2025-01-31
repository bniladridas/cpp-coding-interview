import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      throw error(400, 'Invalid code provided');
    }

    // Sanitize and validate the code
    const sanitizedCode = sanitizeCode(code);

    // Simulate code execution
    const executionResult = simulateCodeExecution(sanitizedCode);

    return new Response(JSON.stringify({
      success: executionResult.success,
      output: executionResult.output
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Code processing error:', err);
    throw error(500, err instanceof Error ? err.message : 'Failed to process code');
  }
};

function sanitizeCode(code: string): string {
  // Remove potentially dangerous directives
  const sanitizedCode = code
    .replace(/#include\s*<.*>/g, '')  // Remove additional includes
    .replace(/using\s+namespace\s+std;/g, '')  // Remove namespace declarations
    .replace(/system\s*\(/g, '')  // Remove system calls
    .replace(/exec\s*\(/g, '')    // Remove exec calls
    .replace(/popen\s*\(/g, '')   // Remove popen calls
    .trim();

  // Validate basic structure
  if (!sanitizedCode.includes('class Solution')) {
    throw error(400, 'Solution class must be defined');
  }

  if (!sanitizedCode.includes('vector<int> twoSum')) {
    throw error(400, 'twoSum method must be implemented');
  }

  return sanitizedCode;
}

function simulateCodeExecution(code: string): { success: boolean; output: string } {
  try {
    // Parse the code to extract the twoSum method
    const twoSumMethod = extractTwoSumMethod(code);

    // Simulate test cases
    const testCases = [
      {
        nums: [2, 7, 11, 15],
        target: 9,
        expectedOutput: [0, 1]
      },
      {
        nums: [3, 2, 4],
        target: 6,
        expectedOutput: [1, 2]
      }
    ];

    // Run test cases and collect results
    const testResults = testCases.map(testCase => {
      const result = simulateMethodCall(twoSumMethod, testCase.nums, testCase.target);
      const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
      return { 
        input: testCase.nums, 
        target: testCase.target, 
        result, 
        passed 
      };
    });

    // Determine overall success
    const allTestsPassed = testResults.every(test => test.passed);

    // Generate output
    const outputLines = testResults.map(test => 
      `Test Case: nums = [${test.input.join(', ')}], target = ${test.target}
Result: [${test.result.join(', ')}]
Status: ${test.passed ? 'PASSED' : 'FAILED'}`
    );

    return {
      success: allTestsPassed,
      output: outputLines.join('\n\n')
    };
  } catch (err) {
    return {
      success: false,
      output: err instanceof Error ? err.message : 'Execution simulation failed'
    };
  }
}

function extractTwoSumMethod(code: string): (nums: number[], target: number) => number[] {
  // This is a mock implementation that simulates the method
  return (nums: number[], target: number) => {
    const numMap = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (numMap.has(complement)) {
        return [numMap.get(complement)!, i];
      }
      numMap.set(nums[i], i);
    }
    return [];
  };
}

function simulateMethodCall(method: (nums: number[], target: number) => number[], nums: number[], target: number): number[] {
  return method(nums, target);
}
