/**
 * Prompt templates for generating exam questions from cheatsheets.
 */

/**
 * Generates a prompt template for creating Multiple Choice Questions (MCQs).
 *
 * Args:
 *   cheatsheetContent: The combined cheatsheet content.
 *   numQuestions: Number of MCQs to generate (default: 5).
 *   difficulty: Difficulty level (default: 'medium').
 *
 * Returns:
 *   Formatted prompt string for MCQ generation.
 */
export function generateMCQPrompt(
  cheatsheetContent: string,
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): string {
  return `You are an expert exam content creator. Based on the following cheatsheet content, generate ${numQuestions} high-quality Multiple Choice Questions (MCQs) at ${difficulty} difficulty level.

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Only one option should be correct
- Questions should test understanding, not just memorization
- Include a brief explanation for the correct answer
- Format each question clearly

Cheatsheet Content:
${cheatsheetContent}

Please generate the MCQs in the following format:

Question 1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [Letter]
Explanation: [Brief explanation]

[Repeat for all questions]`;
}

/**
 * Generates a prompt template for creating descriptive/long-form questions.
 *
 * Args:
 *   cheatsheetContent: The combined cheatsheet content.
 *   numQuestions: Number of descriptive questions to generate (default: 3).
 *   questionType: Type of descriptive question (default: 'application').
 *
 * Returns:
 *   Formatted prompt string for descriptive question generation.
 */
export function generateDescriptivePrompt(
  cheatsheetContent: string,
  numQuestions: number = 3,
  questionType: 'definition' | 'explanation' | 'application' | 'analysis' = 'application'
): string {
  const questionTypeDescriptions = {
    definition: 'definitions and key concepts',
    explanation: 'explanations of processes or mechanisms',
    application: 'practical applications and problem-solving scenarios',
    analysis: 'analysis and comparison of concepts',
  };

  return `You are an expert exam content creator. Based on the following cheatsheet content, generate ${numQuestions} high-quality descriptive questions that require ${questionTypeDescriptions[questionType]}.

Requirements:
- Questions should be clear and specific
- Each question should require a detailed answer (2-5 paragraphs)
- Include a sample answer or marking scheme
- Questions should test deep understanding of the concepts
- Vary the complexity and scope of questions

Cheatsheet Content:
${cheatsheetContent}

Please generate the descriptive questions in the following format:

Question 1: [Question text]
Expected Answer Points:
- [Key point 1]
- [Key point 2]
- [Key point 3]
[Sample answer or detailed explanation]

[Repeat for all questions]`;
}

/**
 * Generates a prompt template for creating a complete exam paper.
 *
 * Args:
 *   cheatsheetContent: The combined cheatsheet content.
 *   numMCQs: Number of MCQs to include (default: 10).
 *   numDescriptive: Number of descriptive questions to include (default: 5).
 *   examDuration: Duration of exam in minutes (default: 60).
 *
 * Returns:
 *   Formatted prompt string for exam paper generation.
 */
export function generateExamPaperPrompt(
  cheatsheetContent: string,
  numMCQs: number = 10,
  numDescriptive: number = 5,
  examDuration: number = 60
): string {
  return `You are an expert exam content creator. Based on the following cheatsheet content, create a complete exam paper.

Exam Specifications:
- Duration: ${examDuration} minutes
- Multiple Choice Questions: ${numMCQs} questions
- Descriptive Questions: ${numDescriptive} questions
- Total Marks: ${numMCQs * 1} (MCQs) + ${numDescriptive * 5} (Descriptive) = ${numMCQs * 1 + numDescriptive * 5} marks

Cheatsheet Content:
${cheatsheetContent}

Please create the exam paper in the following format:

=== EXAM PAPER ===

SECTION A: MULTIPLE CHOICE QUESTIONS (${numMCQs} × 1 = ${numMCQs} marks)
[Generate ${numMCQs} MCQs with 4 options each]

SECTION B: DESCRIPTIVE QUESTIONS (${numDescriptive} × 5 = ${numDescriptive * 5} marks)
[Generate ${numDescriptive} descriptive questions with expected answer points]

=== MARKING SCHEME ===
[Provide detailed marking scheme for all questions]`;
}


