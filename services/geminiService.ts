
import { GoogleGenAI, Type } from "@google/genai";
import type { Cost, Suggestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateSuggestions(cost: Cost): Promise<Suggestion[]> {
    const prompt = `I am paying ${cost.cost} USD ${cost.billingCycle === 'Monthly' ? 'per month' : 'per year'} for a service called "${cost.name}" in the "${cost.category}" category. Please suggest up to 3 alternative services that offer similar features for a lower price for a small e-commerce business. For each alternative, provide its name, an estimated monthly or annual price, and a brief reason why it's a good alternative.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    alternativeName: {
                                        type: Type.STRING,
                                        description: 'The name of the alternative service.'
                                    },
                                    estimatedCost: {
                                        type: Type.STRING,
                                        description: 'The estimated monthly or annual cost of the alternative service (e.g., "$25/month" or "$250/year").'
                                    },
                                    reason: {
                                        type: Type.STRING,
                                        description: 'A brief reason why this is a good alternative for a small e-commerce business.'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        let jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        
        if (result && result.suggestions) {
            return result.suggestions as Suggestion[];
        }

        return [];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to fetch suggestions from AI.");
    }
}
