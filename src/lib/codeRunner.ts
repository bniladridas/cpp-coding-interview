interface CodeRunResult {
  success: boolean;
  output: string;
  error?: string;
}

export async function runCppCode(code: string) {
  try {
    const response = await fetch('/api/run-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to run code');
    }

    const result = await response.json();

    return {
      success: result.success,
      output: result.output || 'No output generated'
    };
  } catch (error) {
    console.error('Code execution error:', error);
    return {
      success: false,
      output: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
