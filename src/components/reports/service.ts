import {GoogleGenAI, Type} from '@google/genai';
import {GeminiAnalysis} from './types';

// Always use the process.env.API_KEY directly without fallbacks as per guidelines
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export const getReportInsights = async (
  reportTitle: string,
  description: string,
): Promise<GeminiAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a professional financial analysis summary for a report titled "${reportTitle}". The report is described as: "${description}". Assume realistic sample data for this type of report.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description:
                'A concise summary of what this report typically reveals.',
            },
            keyMetrics: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description:
                'Top 3 key metrics or KPIs usually found in this report.',
            },
            recommendation: {
              type: Type.STRING,
              description:
                'A strategic recommendation based on this type of data.',
            },
          },
          required: ['summary', 'keyMetrics', 'recommendation'],
        },
      },
    });

    // The text property is accessed as a property, not a method call
    const text = response.text;
    if (!text) throw new Error('No response from AI');
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Fallback data
    return {
      summary: `Detailed analysis of ${reportTitle} data over the selected period.`,
      keyMetrics: ['Volume Trend', 'Accuracy Rate', 'User Engagement'],
      recommendation:
        'Increase audit frequency to ensure data integrity during peak cycles.',
    };
  }
};
