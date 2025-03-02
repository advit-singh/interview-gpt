'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const interviewType = searchParams.get('type');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Mock data - in a real app, this would come from an API call
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'Tell me about a time when you had to solve a complex technical problem. What was your approach?',
          category: 'Problem Solving',
          difficulty: 'medium',
        },
        {
          id: '2',
          question: 'How do you stay updated with the latest technologies in your field?',
          category: 'Professional Development',
          difficulty: 'easy',
        },
        {
          id: '3',
          question: 'Describe a situation where you had to work under pressure to meet a deadline.',
          category: 'Work Ethic',
          difficulty: 'medium',
        },
        {
          id: '4',
          question: 'What is your approach to debugging a complex issue in production?',
          category: 'Technical Skills',
          difficulty: 'hard',
        },
        {
          id: '5',
          question: 'How do you handle disagreements with team members about technical decisions?',
          category: 'Teamwork',
          difficulty: 'medium',
        },
      ];

      setQuestions(mockQuestions);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [interviewType]);

  const toggleQuestion = (id: string) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Form
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Interview Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {interviewType === 'technical' ? 'Technical' : 'Behavioral'} interview preparation
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {questions.map((question) => (
              <motion.div
                key={question.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {question.question}
                    </h3>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-0.5 rounded">
                      {question.category}
                    </span>
                  </div>

                  {expandedQuestion === question.id && (
                    <motion.div
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggested Approach:</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {question.answer || 'Use the STAR method (Situation, Task, Action, Result) to structure your answer. Provide specific examples from your experience that demonstrate your skills and achievements relevant to this question.'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={() => window.print()}
              >
                Save Questions
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
