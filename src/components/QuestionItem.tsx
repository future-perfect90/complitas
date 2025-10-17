import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { saveAnswer } from '../utils/api';
import FileUpload from './FileUpload';
import PresignedDocument from './PresignedDocument';
import TextField from './TextField';
import ConfirmationModal from './modals/ConfirmationModal';

export interface Answer {
	reportId: string;
	propertyId: string;
	questionId: string;
	answer: 'Yes' | 'No' | 'NA' | null;
	fileUrl?: string;
	fileName?: string;
	validUntil?: string | null;
	dateCompleted?: string;
}

interface QuestionItemProps {
	questionObject: {
		id: string;
		question: string;
		uploadRequired: boolean | 0 | 1;
		validUntil: boolean | 0 | 1;
		dateCompleted: boolean | 0 | 1;
	};
	reportId: string;
	propertyId: string;
	savedAnswer?: Answer;
}

export default function QuestionItem({
	questionObject,
	savedAnswer,
	propertyId,
	reportId,
}: QuestionItemProps) {
	const [currentAnswer, setCurrentAnswer] = useState<Answer>(
		savedAnswer || {
			questionId: questionObject.id,
			answer: null,
			reportId: reportId,
			propertyId: propertyId,
		}
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [isReplacingFile, setIsReplacingFile] = useState(false);
	const [newFile, setNewFile] = useState<string | null>(null);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const [dateToConfirm, setDateToConfirm] = useState<string | null>(null);

	const handleSave = async (answerPayload: Answer) => {
		setIsSaving(true);
		setError('');

		try {
			await saveAnswer(answerPayload);
			setCurrentAnswer(answerPayload);
			setIsReplacingFile(false); // Hide upload form after successful save
			toast.success('Answer saved successfully');
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

		handleSave({
			...currentAnswer,
			answer: newAnswer,
			propertyId: propertyId,
			fileUrl: undefined,
			fileName: undefined,
		});
	};

	const handleUploadComplete = (fileName: string, fileUrl: string) => {
		setNewFile(fileName);
		handleSave({
			...currentAnswer,
			answer: 'Yes',
			fileUrl,
			fileName,
			propertyId,
		});
		toast.success('File uploaded successfully');
		setIsReplacingFile(false);
	};

	const handleValidUntilBlur = () => {
		const newDate = currentAnswer.validUntil;
		if (!newDate) {
			handleSave({ ...currentAnswer, propertyId, validUntil: null });
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const selectedDate = new Date(newDate);

		if (selectedDate < today) {
			setDateToConfirm(newDate);
			setIsConfirmationModalOpen(true);
		} else {
			handleSave({ ...currentAnswer, propertyId });
		}
	};

	const confirmDateAndSave = () => {
		if (dateToConfirm) {
			handleSave({ ...currentAnswer, validUntil: dateToConfirm, propertyId });
		}
		setIsConfirmationModalOpen(false);
		setDateToConfirm(null);
	};

	const cancelDateSelection = () => {
		setCurrentAnswer((prev) => ({
			...prev,
			validUntil: savedAnswer?.validUntil || null,
		}));
		setIsConfirmationModalOpen(false);
		setDateToConfirm(null);
	};

	return (
		<div className="p-4 relative">
			<div className="flex justify-between items-start">
				<p className="font-semibold text-[#212529] dark:text-slate-300 pr-4">
					{questionObject.question}
				</p>
				{isSaving && <span className="text-sm text-[#F8F9FA]">Saving...</span>}
			</div>
			<div className="flex items-center justify-left space-x-4 mt-2">
				{['Yes', 'No', 'NA'].map((option) => (
					<label
						key={option}
						className="flex items-center space-x-1 cursor-pointer  text-[#212529] dark:text-[#F8F9FA]">
						<input
							type="radio"
							name={questionObject.id}
							value={option}
							checked={currentAnswer.answer === option}
							onChange={handleResponseChange}
							disabled={isSaving}
							className="form-radio h-4 w-4"
						/>
						<span>{option}</span>
					</label>
				))}
				{questionObject.validUntil === 1 && (
					<div className="flex items-center space-x-2">
						<TextField
							label="Valid until: "
							type="date"
							layout="horizontal"
							value={currentAnswer.validUntil?.split('T')[0] ?? ''}
							onChange={(e) => {
								setCurrentAnswer((prev) => ({
									...prev,
									validUntil: e.target.value || null,
								}));
							}}
							onBlur={handleValidUntilBlur}
						/>
					</div>
				)}
				{questionObject.dateCompleted === 1 && (
					<div className="flex items-center space-x-2">
						<TextField
							label="Date Completed: "
							type="date"
							layout="horizontal"
							value={currentAnswer.dateCompleted?.split('T')[0] ?? ''}
							onChange={(e) => {
								setCurrentAnswer((prev) => ({
									...prev,
									dateCompleted: e.target.value,
								}));
							}}
							onBlur={() => handleSave({ ...currentAnswer, propertyId })}
						/>
					</div>
				)}
			</div>
			{questionObject.uploadRequired === 1 && currentAnswer.answer === 'Yes' && (
				<div className="">
					{currentAnswer.fileName && !isReplacingFile ? (
						<div className="flex items-center space-x-4">
							<PresignedDocument
								fileName={newFile ?? currentAnswer.fileName}
								uploadApiUrl={`${
									import.meta.env.VITE_API_BASE_URL
								}/document/presignedUrl.php`}
								directory={`compliance/${reportId}/`}
								linkTextPrefix="Evidence"
							/>
							<button
								onClick={() => setIsReplacingFile(true)}
								className="text-sm">
								<img src="/change.svg" className="w-4 h-4" alt="Change" />
							</button>
						</div>
					) : (
						<FileUpload
							uploadApiUrl={`${
								import.meta.env.VITE_API_BASE_URL
							}/document/presignedUrl.php`}
							directory={`compliance/${reportId}/`}
							onUploadComplete={handleUploadComplete}
							label="Upload evidence"
						/>
					)}
				</div>
			)}

			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={cancelDateSelection}
				onConfirm={confirmDateAndSave}
				title="Past Date Confirmation"
				message="The date you have selected is in the past. Are you sure you want to proceed?"
				confirmText="Yes, I'm sure"
				cancelText="No, cancel"
			/>
		</div>
	);
}
