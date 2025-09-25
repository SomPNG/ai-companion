import { GoogleGenAI, Type } from "@google/genai";
import { QuizData } from '../types';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        emotion: {
            type: Type.STRING,
            description: "The primary emotion detected from the user's text (e.g., Frustration, Confusion, Curiosity, Excitement).",
        },
        topic: {
            type: Type.STRING,
            description: "The main learning topic identified from the user's text.",
        },
        quizTitle: {
            type: Type.STRING,
            description: "A fun and engaging title for the quiz, related to the topic.",
        },
        questions: {
            type: Type.ARRAY,
            description: "An array of 10 multiple-choice questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    questionText: {
                        type: Type.STRING,
                        description: "The text of the quiz question.",
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 strings representing the possible answers.",
                        items: {
                            type: Type.STRING,
                        },
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer from the 'options' array.",
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief, simple explanation for why the correct answer is right."
                    }
                },
                required: ["questionText", "options", "correctAnswer", "explanation"],
            },
        },
    },
    required: ["emotion", "topic", "quizTitle", "questions"],
};


export const analyzeAndCreateQuiz = async (userInput: string): Promise<QuizData> => {
    try {
        const prompt = `You are an empathetic AI learning companion for students. A student will express their feelings about a topic they are studying. Your task is to analyze their text to understand their primary emotion and the learning topic. Based on this, you must generate a fun, multiple-choice quiz with 10 questions to help them engage with the topic in a more positive way. The student's input is: "${userInput}". Ensure the quiz questions are educational but presented in a light, encouraging tone. Provide your response in the specified JSON format.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const quizData: QuizData = JSON.parse(jsonText);
        
        // Basic validation
        if (!quizData.questions || quizData.questions.length === 0) {
            throw new Error("Generated quiz has no questions.");
        }

        return quizData;

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        throw new Error("Failed to generate the quiz. The AI might be busy, please try again.");
    }
};