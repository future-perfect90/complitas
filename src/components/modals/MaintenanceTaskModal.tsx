import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { MaintenanceTask } from '../../types';
import {
	completeMaintenanceTask,
	createMaintenanceTask,
} from '../../utils/api';
import { Button } from '../Button';
import FileUpload from '../FileUpload';
import Label from '../Label';
import Modal from '../Modal';
import PresignedDocument from '../PresignedDocument';
import Telephone from '../Telephone';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	initialData?: MaintenanceTask;
	completed?: boolean;
	propertyId?: string;
}

const MaintenanceTaskModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
	completed,
	propertyId,
}) => {
	const [id, setId] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [typeOfWork, setTypeOfWork] = useState('');
	const [evidence, setEvidence] = useState('');
	const [completedAt, setCompletedAt] = useState('');
	const [name, setName] = useState('');
	const [contactName, setContactName] = useState('');
	const [contactAddress, setContactAddress] = useState('');
	const [contactNumber, setContactNumber] = useState('');
	const [changeEvidence, setChangeEvidence] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (initialData) {
			setId(initialData.id || '');
			setTitle(initialData.title);
			setDescription(initialData.description);
			setTypeOfWork(initialData.typeOfWork);
		} else {
			setId('');
			setTitle('');
			setDescription('');
			setTypeOfWork('');
		}
		setEvidence('');
		setCompletedAt('');
	}, [initialData, isOpen, submitted]);

	const handleSubmit = async () => {
		if (completed) {
			if (
				!evidence ||
				!completedAt ||
				!name ||
				!contactName ||
				!contactAddress ||
				!contactNumber
			) {
				toast.error('Please fill in all required fields to complete the task.');
				return;
			}
		} else {
			if (!title || !typeOfWork || !description) {
				toast.error('Please fill in all required fields to create a task.');
				return;
			}
		}

		if (completed) {
			await completeMaintenanceTask(
				{
					evidence,
					completedAt,
					propertyId,
					name,
					contactName,
					contactAddress,
					contactNumber,
				},
				id
			);
			setSubmitted(true);
		} else {
			await createMaintenanceTask({
				title,
				description,
				typeOfWork,
				propertyId,
			});
			setSubmitted(true);
		}
		onSuccess();
		onClose();
	};

	const handleUploadComplete = (fileName: string) => {
		setEvidence(fileName);
		setChangeEvidence(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={completed ? 'Complete Maintenance Task' : 'Add Maintenance Task'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextField
						label="Title *"
						value={title}
						onChange={(e: any) => setTitle(e.target.value)}
						disabled={completed}
						required={!completed}
					/>
					<TextField
						label="Type of Work *"
						value={typeOfWork}
						onChange={(e: any) => setTypeOfWork(e.target.value)}
						disabled={completed}
						required={!completed}
					/>
				</div>
				<div className="grid mb-4">
					<Label label="Description *" />
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
						disabled={completed}
					/>
				</div>

				{completed && (
					<div className="grid gap-4">
						<Label label="Evidence *" />
						{evidence && !changeEvidence ?
							<div className="flex items-center space-x-4">
								<PresignedDocument
									fileName={evidence}
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									directory={`maintenance/`}
									linkTextPrefix="Evidence"
								/>
								<button
									onClick={() => setChangeEvidence(true)}
									className="text-sm text-blue-600 hover:underline">
									<img
										src="/change.svg"
										className="w-4 h-4"
										alt="Change"
									/>
								</button>
							</div>
						:	<FileUpload
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								onUploadComplete={handleUploadComplete}
								directory={`maintenance/`}
								label="Upload Evidence"
							/>
						}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<TextField
								label="Company Name *"
								value={name}
								onChange={(e: any) => setName(e.target.value)}
								required
							/>
							<TextField
								label="Company Contact Name *"
								value={contactName}
								onChange={(e: any) => setContactName(e.target.value)}
								required
							/>
						</div>
						<div>
							<Label label="Company Address *" />
							<textarea
								value={contactAddress}
								onChange={(e) => setContactAddress(e.target.value)}
								className="w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
								required
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Telephone
								label="Contact Number *"
								value={contactNumber}
								onChange={(contactNumber) => setContactNumber(contactNumber)}
								required
							/>
							<TextField
								label="Completed At *"
								value={completedAt}
								onChange={(e: any) => setCompletedAt(e.target.value)}
								type="date"
								required
							/>
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					<Button
						label={completed ? 'Complete task' : 'Create task'}
						className="bg-green-400 py-2 px-5"
						onClick={handleSubmit}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default MaintenanceTaskModal;
