// src/components/QuestionItem.tsx
import React, { useState } from 'react';
import { saveAnswer } from '../utils/api';
import FileUpload from './FileUpload';

export interface Answer {
	reportId: string;
	questionId: string;
	answer: 'Yes' | 'No' | 'NA' | null;
	fileUrl?: string;
	fileName?: string;
}

interface QuestionItemProps {
	questionObject: {
		id: string;
		question: string;
		uploadRequired: boolean | 0 | 1;
	};
	reportId: string;
	savedAnswer?: Answer;
}

export default function QuestionItem({
	questionObject,
	savedAnswer,
	reportId,
}: QuestionItemProps) {
	const [currentAnswer, setCurrentAnswer] = useState<Answer>(
		savedAnswer || {
			questionId: questionObject.id,
			answer: null,
			reportId: reportId,
		}
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');

	const handleSave = async (answerPayload: Answer) => {
		setIsSaving(true);
		setError('');
		try {
			await saveAnswer(answerPayload);
			setCurrentAnswer(answerPayload);
		} catch (err) {
			setError('Failed to save. Please try again.');
			console.error('Save failed:', err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newAnswer = e.target.value as Answer['answer'];

		setCurrentAnswer((prev) => ({ ...prev, answer: newAnswer }));

		if (newAnswer !== 'Yes') {
			handleSave({
				...currentAnswer,
				answer: newAnswer,
				fileUrl: undefined,
				fileName: undefined,
			});
		}
	};

	const handleUploadComplete = (fileUrl: string, fileName: string) => {
		handleSave({ ...currentAnswer, answer: 'Yes', fileUrl, fileName });
	};

	const showFileUpload =
		questionObject.uploadRequired && currentAnswer.answer === 'Yes';
	return (
		<div className="p-4 border-b border-gray-200 relative">
			<div className="flex justify-between items-start">
				<p className="font-semibold text-gray-800 pr-4">
					{questionObject.question}
				</p>
				{isSaving && <span className="text-sm text-gray-400">Saving...</span>}
			</div>
			<div className="flex items-center space-x-4 mt-2">
				{['Yes', 'No', 'NA'].map((option) => (
					<label
						key={option}
						className="flex items-center space-x-1 cursor-pointer text-slate-600">
						<input
							type="radio"
							name={questionObject.id}
							value={option}
							checked={currentAnswer.answer === option}
							onChange={handleResponseChange}
							disabled={isSaving}
							className="form-radio h-4 w-4 text-purple-600"
						/>
						<span>{option}</span>
					</label>
				))}
			</div>
			{showFileUpload && (
				<div className="mt-4 pl-4 border-l-2 border-purple-200">
					{currentAnswer.fileUrl ?
						<p className="text-sm text-green-600 mb-2">
							✅ File uploaded: {currentAnswer.fileName}
						</p>
					:	<FileUpload
							uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
							directory={`compliance/${reportId}/`}
							onUploadComplete={handleUploadComplete}
							label="Upload evidence"
						/>
					}
				</div>
			)}
			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
		</div>
	);
}
