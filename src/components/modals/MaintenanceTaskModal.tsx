import React, { useEffect, useState } from 'react';
import type { MaintenanceTask } from '../../types';
import {
	completeMaintenanceTask,
	createMaintenanceTask,
} from '../../utils/api';
import { Button } from '../Button';
import FileUpload from '../FileUpload';
import Label from '../Label';
import Modal from '../Modal';
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
	const [completedBy, setCompletedBy] = useState('');

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
		setCompletedBy('');
	}, [initialData, isOpen]);

	const handleSubmit = async () => {
		if (completed) {
			await completeMaintenanceTask(
				{
					evidence,
					completedAt,
					completedBy,
					propertyId,
				},
				id
			);
		} else {
			await createMaintenanceTask({
				title,
				description,
				typeOfWork,
				propertyId,
			});
		}
		onSuccess();
		onClose();
	};

	const handleUploadComplete = (url: string, fileName: string) => {
		setEvidence(fileName);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={completed ? 'Complete Maintenance Task' : 'Add Maintenance Task'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<TextField
						label="Title"
						value={title}
						onChange={(e: any) => setTitle(e.target.value)}
					/>
					<TextField
						label="Type of Work"
						value={typeOfWork}
						onChange={(e: any) => setTypeOfWork(e.target.value)}
					/>
				</div>
				<div className="grid">
					<Label label="Description" />
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
					/>
				</div>

				{completed && (
					<div className="grid gap-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Evidence
						</label>
						<FileUpload
							uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
							accept="image/*"
							onUploadComplete={handleUploadComplete}
							directory="company/logos/"
						/>
						<TextField
							label="Completed By"
							value={completedBy}
							onChange={(e: any) => setCompletedBy(e.target.value)}
						/>
						<Label label="Completed at" />
						<input
							type="date"
							value={completedAt}
							onChange={(e) => setCompletedAt(e.target.value)}
							className="w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
						/>
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
						onClick={() => handleSubmit()}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default MaintenanceTaskModal;
