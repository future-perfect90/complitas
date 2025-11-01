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
	dateType?: string;
	savedDate?: string | null;
}

interface QuestionItemProps {
	questionObject: {
		id: string;
		question: string;
		uploadRequired: boolean | 0 | 1;
		dateType: string;
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
	const [confirmationMessage, setConfirmationMessage] = useState<{
		title: string;
		message: string;
	}>({ title: '', message: '' });

	const handleSave = async (answerPayload: Answer) => {
		setIsSaving(true);
		setError('');

		try {
			console.log(answerPayload);
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

	const handleDateBlur = (dateType: string) => {
		const newDate = currentAnswer.savedDate;
		if (!newDate) {
			handleSave({ ...currentAnswer, propertyId, savedDate: null });
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const selectedDate = new Date(newDate);

		if (dateType === 'Valid until' && selectedDate < today) {
			setDateToConfirm(newDate);
			setConfirmationMessage({
				title: 'Past date confirmation',
				message:
					'The date you have selected is in the past. Are you sure you want to proceed?',
			});
			setIsConfirmationModalOpen(true);
		} else if (dateType === 'Date of inspection' && selectedDate > today) {
			setDateToConfirm(newDate);
			setConfirmationMessage({
				title: 'Future date of confirmation',
				message:
					'The date you have selected is in the future. Are you sure you want to proceed?',
			});
			setIsConfirmationModalOpen(true);
		} else {
			handleSave({ ...currentAnswer, propertyId });
		}
	};

	const confirmDateAndSave = () => {
		if (dateToConfirm) {
			handleSave({ ...currentAnswer, savedDate: dateToConfirm, propertyId });
		}
		setIsConfirmationModalOpen(false);
		setDateToConfirm(null);
	};

	const cancelDateSelection = () => {
		setCurrentAnswer((prev) => ({
			...prev,
			savedDate: savedAnswer?.savedDate || null,
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
				{currentAnswer.answer === 'Yes' && questionObject.dateType !== null && (
					<div className="flex items-center">
						<TextField
							label={`${questionObject.dateType}: `}
							type="date"
							layout="horizontal"
							value={currentAnswer.savedDate?.split('T')[0] ?? ''}
							onChange={(e) => {
								setCurrentAnswer((prev) => ({
									...prev,
									savedDate: e.target.value || null,
								}));
							}}
							onBlur={() => handleDateBlur(questionObject.dateType)}
						/>
					</div>
				)}
			</div>
			{currentAnswer.answer === 'Yes' &&
				questionObject.uploadRequired === 1 && (
					<div className="">
						{currentAnswer.fileName && !isReplacingFile ?
							<div className="flex items-center">
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
						:	<FileUpload
								uploadApiUrl={`${
									import.meta.env.VITE_API_BASE_URL
								}/document/presignedUrl.php`}
								directory={`compliance/${reportId}/`}
								onUploadComplete={handleUploadComplete}
								label="Upload evidence"
							/>
						}
					</div>
				)}

			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={cancelDateSelection}
				onConfirm={confirmDateAndSave}
				title={confirmationMessage?.title}
				message={confirmationMessage?.message}
				confirmText="Yes, I'm sure"
				cancelText="No, cancel"
			/>
		</div>
	);
}
