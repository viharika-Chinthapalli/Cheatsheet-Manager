/**
 * Component for generating prompt templates for exam question creation.
 */

import {
  generateMCQPrompt,
  generateDescriptivePrompt,
  generateExamPaperPrompt,
} from '../utils/promptTemplates';

interface PromptTemplatesProps {
  cheatsheetContent: string;
}

/**
 * PromptTemplates component provides UI for generating various prompt templates.
 *
 * Args:
 *   cheatsheetContent: The combined cheatsheet content to use in prompts.
 */
export function PromptTemplates({ cheatsheetContent }: PromptTemplatesProps) {
  if (!cheatsheetContent) {
    return null;
  }

  const handleGeneratePrompt = (promptText: string, type: string) => {
    // Create a textarea to show the prompt and allow copying
    const textarea = document.createElement('textarea');
    textarea.value = promptText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert(`${type} prompt copied to clipboard!`);
  };

  const handleMCQ = () => {
    const numQuestions = parseInt(
      prompt('How many MCQs would you like to generate?', '5') || '5'
    );
    const difficulty = prompt(
      'Difficulty level (easy/medium/hard):',
      'medium'
    ) as 'easy' | 'medium' | 'hard';
    const promptText = generateMCQPrompt(cheatsheetContent, numQuestions, difficulty);
    handleGeneratePrompt(promptText, 'MCQ');
  };

  const handleDescriptive = () => {
    const numQuestions = parseInt(
      prompt('How many descriptive questions would you like to generate?', '3') || '3'
    );
    const questionType = prompt(
      'Question type (definition/explanation/application/analysis):',
      'application'
    ) as 'definition' | 'explanation' | 'application' | 'analysis';
    const promptText = generateDescriptivePrompt(cheatsheetContent, numQuestions, questionType);
    handleGeneratePrompt(promptText, 'Descriptive');
  };

  const handleExamPaper = () => {
    const numMCQs = parseInt(prompt('Number of MCQs:', '10') || '10');
    const numDescriptive = parseInt(prompt('Number of descriptive questions:', '5') || '5');
    const duration = parseInt(prompt('Exam duration (minutes):', '60') || '60');
    const promptText = generateExamPaperPrompt(cheatsheetContent, numMCQs, numDescriptive, duration);
    handleGeneratePrompt(promptText, 'Exam Paper');
  };

  return (
    <div className="prompt-templates">
      <h3>Generate Question Prompts</h3>
      <p className="prompt-templates-description">
        Use these templates to generate prompts for AI tools (like ChatGPT) to create exam questions.
      </p>
      <div className="prompt-templates-buttons">
        <button onClick={handleMCQ} className="prompt-button">
          Generate MCQ Prompt
        </button>
        <button onClick={handleDescriptive} className="prompt-button">
          Generate Descriptive Question Prompt
        </button>
        <button onClick={handleExamPaper} className="prompt-button">
          Generate Complete Exam Paper Prompt
        </button>
      </div>
    </div>
  );
}




