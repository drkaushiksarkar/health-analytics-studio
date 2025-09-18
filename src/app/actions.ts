"use server";

import { generateReport } from '@/ai/flows/generate-report-from-prompt';
import { answerQuestion } from '@/ai/flows/data-qa';
import { riskData, featureImportanceData, genlandDistricts } from '@/lib/data';

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

export async function searchAction(question: string) {
    if (!question) {
        return { success: false, error: "Please provide a question." };
    }

    try {
        const dataDescription = `The dashboard contains the following data sources:
        - Risk Heatmap Data: Contains non-spatial risk scores for specific locations. Includes 'location', 'risk_category' ('High', 'Medium', 'Low'), 'risk_score' (0-100), and 'change' (weekly score change).
        - Feature Importance Data: Shows the drivers of the prediction model. Includes 'feature' (e.g., 'Rainfall (14d lag)') and 'importance' (a positive or negative score).
        - Weather Data: Current weather panels. Includes 'Temperature', 'Humidity', and 'Rainfall' with their values.
        - Disease Incidence Map: A map of 'Genland' with districts. Each district has a name and an 'incidence' rate (0.0 to 1.0).
        - Time Series Data: Not directly available for search, but provides historical and predicted case counts.`;

        // Since weatherData is now fetched live on the client, we'll create a representative sample for the AI's context.
        const weatherDataSample = [
            { label: 'Temperature', value: '30.5°C' },
            { label: 'Humidity', value: '88%' },
            { label: 'Rainfall', value: '5mm' },
        ];

        const dataSample = JSON.stringify({
            riskData,
            featureImportanceData,
            weatherData: weatherDataSample,
            genlandDistricts
        }, null, 2);

        const result = await answerQuestion({
            question,
            dataDescription,
            dataSample
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error in search action:", error);
        return { success: false, error: (error as Error).message || "An unexpected error occurred during search." };
    }
}
