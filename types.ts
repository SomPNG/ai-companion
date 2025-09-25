
export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  emotion: string;
  topic: string;
  quizTitle: string;
  questions: QuizQuestion[];
}
