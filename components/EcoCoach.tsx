import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { type Activities, type Emissions } from '../types';
import { BrainCircuitIcon } from './icons';

interface EcoCoachProps {
  activities: Activities;
  emissions: Emissions;
}

interface AIFeedback {
  summary: string;
  impactArea: {
    name: string;
    explanation: string;
  };
  tips: {
    tip: string;
  }[];
  motivation: string;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A short, encouraging summary of the user's impact." },
    impactArea: {
      type: Type.OBJECT,
      description: "The single biggest impact area and a brief explanation.",
      properties: {
        name: { type: Type.STRING, description: "The name of the category (e.g., 'Transport', 'Food')." },
        explanation: { type: Type.STRING, description: "A brief explanation of why it's the highest impact area." },
      },
      required: ['name', 'explanation'],
    },
    tips: {
      type: Type.ARRAY,
      description: "2-3 actionable and creative tips to reduce footprint in the specific impact area.",
      items: {
        type: Type.OBJECT,
        properties: {
          tip: { type: Type.STRING, description: "A single, actionable tip." },
        },
        required: ['tip'],
      },
    },
    motivation: { type: Type.STRING, description: "A short, motivational message to keep the user going." },
  },
  required: ['summary', 'impactArea', 'tips', 'motivation'],
};


const EcoCoach: React.FC<EcoCoachProps> = ({ activities, emissions }) => {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAIFeedback = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    const total = emissions.transport + emissions.energy + emissions.food;
    if (total === 0) {
      setError("Please log some activities first to get feedback.");
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `
        You are an encouraging and knowledgeable Eco-Coach. Analyze my daily carbon footprint data and provide personalized feedback in a friendly, conversational tone.
        Return the data in the specified JSON format.

        My total footprint today is ${total.toFixed(1)} kg CO2e.
        Here's the breakdown:
        - Transport: ${emissions.transport.toFixed(1)} kg
        - Energy: ${emissions.energy.toFixed(1)} kg
        - Food: ${emissions.food.toFixed(1)} kg

        My activities were:
        - Transport Method: ${activities.transport_method || 'Not specified'}
        - Commute Distance: ${activities.commute_distance || '0'} miles
        - Flights this month: ${activities.flights_month || '0'}
        - Home Type: ${activities.home_type || 'Not specified'}
        - Heating: ${activities.heating_type || 'Not specified'}
        - Electricity: ${activities.electricity_source || 'Not specified'}
        - Diet: ${activities.diet_type || 'Not specified'}
        - Meals: ${activities.meal_ratio || 'Not specified'}
        - Food Waste: ${activities.food_waste || 'Not specified'}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      const parsedFeedback = JSON.parse(response.text.trim());
      setFeedback(parsedFeedback);

    } catch (err) {
      console.error(err);
      setError('Sorry, the Eco-Coach is unavailable right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 p-2 rounded-full mr-3">
          <BrainCircuitIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Eco-Coach AI</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Get personalized feedback and creative tips from our AI coach based on your daily activities.
      </p>
      
      <button 
        onClick={getAIFeedback}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing your day...
          </>
        ) : 'Get AI Feedback'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {feedback && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in">
          <div className="text-sm text-gray-800 space-y-3">
            <p>{feedback.summary}</p>
            <p>
              <strong>Biggest Impact Area: {feedback.impactArea.name}</strong>. {feedback.impactArea.explanation}
            </p>
            <div>
              <h4 className="font-semibold text-gray-900">Here are a few personalized tips:</h4>
              <ul className="list-disc space-y-1 ml-5 mt-1">
                {feedback.tips.map((item, index) => <li key={index}>{item.tip}</li>)}
              </ul>
            </div>
            <p className="pt-2 italic border-t border-gray-200">{feedback.motivation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoCoach;
