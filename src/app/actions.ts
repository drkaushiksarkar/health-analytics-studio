"use server";

import { generateReport } from '@/ai/flows/generate-report-from-prompt';

export async function downloadReportAction(prompt: string) {
  try {
    // In a real app, you would add more details to the prompt
    // or use a more structured input for the GenAI flow.
    const augmentedPrompt = `${prompt}. The report should include a summary of key metrics and a table of weekly data. Add a provenance footer with model version 'dv-model-v1.2' and generation date.`;

    const result = await generateReport({ prompt: augmentedPrompt });
    
    // Simulate a PDF response if the prompt asks for it, as the base flow may not always return PDF
    if (prompt.toLowerCase().includes('pdf') && result.format !== 'PDF') {
      result.format = 'PDF';
      result.report = Buffer.from('Simulated PDF content for the report.').toString('base64');
    } else if (result.format !== 'CSV') { // Default to CSV if not PDF
        result.format = 'CSV';
        result.report = Buffer.from('date,cases,predicted\n2023-10-01,50,55\n2023-10-08,60,62').toString('base64');
    }


    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating report:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}
