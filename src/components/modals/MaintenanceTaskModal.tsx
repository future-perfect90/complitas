import { isEqual } from 'lodash';
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
import Textarea from '../Textarea';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	initialData?: MaintenanceTask;
	completed?: boolean;
	propertyId?: string;
}

interface FormErrors {
	id?: string;
	propertyId?: string;
	createdAt?: string;
	title?: string;
	description?: string;
	typeOfWork?: string;
	evidence?: string;
	completedAt?: string;
	completedBy?: string;
	name?: string;
	contactName?: string;
	contactAddress?: string;
	contactNumber?: string;
}

const MaintenanceTaskModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
	completed,
	propertyId,
}) => {
	// const [id, setId] = useState('');
	// const [title, setTitle] = useState('');
	// const [description, setDescription] = useState('');
	// const [typeOfWork, setTypeOfWork] = useState('');
	const [evidence, setEvidence] = useState('');
	// const [completedAt, setCompletedAt] = useState('');
	// const [name, setName] = useState('');
	// const [contactName, setContactName] = useState('');
	// const [contactAddress, setContactAddress] = useState('');
	// const [contactNumber, setContactNumber] = useState('');
	const [changeEvidence, setChangeEvidence] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const emptyForm: Partial<MaintenanceTask> = {
		id: '',
		title: '',
		description: '',
		typeOfWork: '',
		evidence: '',
		completedAt: '',
		completedBy: '',
		propertyId: '',
		createdAt: '',
		name: '',
		contactName: '',
		contactAddress: '',
		contactNumber: '',
	};

	const [formData, setFormData] = useState<Partial<MaintenanceTask>>(
		initialData || emptyForm
	);

	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		setFormData(initialData || emptyForm);
	}, [initialData]);

	const validate = (
		data: Partial<MaintenanceTask>,
		completed = false
	): FormErrors => {
		const newErrors: FormErrors = {};

		if (completed) {
			if (!evidence?.trim()) newErrors.evidence = 'Evidence is required.';
			if (!data.completedAt?.trim())
				newErrors.completedAt = 'Completed at is required.';
			if (!data.name?.trim()) newErrors.name = 'Company name is required.';
			if (!data.contactName?.trim())
				newErrors.contactName = 'Contact name is required.';
			if (!data.contactAddress?.trim())
				newErrors.contactAddress = 'Contact address is required.';
			if (!data.contactNumber?.trim())
				newErrors.contactNumber = 'Contact number is required.';
			if (data.contactNumber && data.contactNumber.length < 13)
				newErrors.contactNumber =
					'Contact number must be at least 13 characters.';
		}
		if (!data.title?.trim()) newErrors.title = 'Title is required.';
		if (!data.description?.trim())
			newErrors.description = 'Description is required.';
		if (!data.typeOfWork?.trim())
			newErrors.typeOfWork = 'Type of work is required.';

		return newErrors;
	};

	const handleSubmit = async () => {
		console.log('Submitting form data:', formData);

		const validationErrors = validate(formData, completed);
		console.log('Errors:', validationErrors);
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			try {
				if (initialData) {
					if (isEqual(initialData, formData)) {
						toast.info('No changes have been made.');
						return;
					}
				}
				if (completed) {
					await completeMaintenanceTask(
						{
							evidence,
							completedAt: formData.completedAt!,
							propertyId,
							name: formData.name!,
							contactName: formData.contactName!,
							contactAddress: formData.contactAddress!,
							contactNumber: formData.contactNumber!,
						},
						formData.id!
					);
					setSubmitted(true);
				} else {
					await createMaintenanceTask({
						title: formData.title!,
						description: formData.description!,
						typeOfWork: formData.typeOfWork!,
						propertyId,
					});
					setSubmitted(true);
				}
				onSuccess();
				handleClose();
			} catch (error) {
				console.error('Error submitting form:', error);
			}
		}
	};

	const handleUploadComplete = (fileName: string) => {
		setEvidence(fileName);
		setChangeEvidence(false);
	};

	const handleChange = (field: keyof MaintenanceTask, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleClose = () => {
		onClose();
		setErrors({});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={completed ? 'Complete Maintenance Task' : 'Add Maintenance Task'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextField
						label="Title *"
						value={formData.title || ''}
						onChange={(e) => handleChange('title', e.target.value)}
						disabled={completed}
						error={errors.title}
					/>
					<TextField
						label="Type of Work *"
						value={formData.typeOfWork || ''}
						onChange={(e) => handleChange('typeOfWork', e.target.value)}
						disabled={completed}
						error={errors.typeOfWork}
					/>
				</div>
				<div className="grid mb-4">
					<Textarea
						label="Description *"
						value={formData.description || ''}
						onChange={(e) => handleChange('description', e.target.value)}
						disabled={completed}
						error={errors.description}
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
									<img src="/change.svg" className="w-4 h-4" alt="Change" />
								</button>
							</div>
						:	<FileUpload
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								onUploadComplete={handleUploadComplete}
								directory={`maintenance/`}
								label="Upload Evidence"
								error={errors.evidence}
							/>
						}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<TextField
								label="Company Name *"
								value={formData.name || ''}
								onChange={(e) => handleChange('name', e.target.value)}
								required
								error={errors.name}
							/>
							<TextField
								label="Company Contact Name *"
								value={formData.contactName || ''}
								onChange={(e) => handleChange('contactName', e.target.value)}
								required
								error={errors.contactName}
							/>
						</div>
						<div>
							<Textarea
								label="Company Address *"
								value={formData.contactAddress || ''}
								onChange={(e) => handleChange('contactAddress', e.target.value)}
								required
								error={errors.contactAddress}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Telephone
								label="Contact Number *"
								value={formData.contactNumber || ''}
								onChange={(value) => handleChange('contactNumber', value)}
								required
								error={errors.contactNumber}
							/>
							<TextField
								label="Completed At *"
								value={formData.completedAt || ''}
								onChange={(e) => handleChange('completedAt', e.target.value)}
								type="date"
								required
								error={errors.completedAt}
							/>
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={handleClose}
						className="py-2 px-5"
						style="secondary"
					/>
					<Button
						label={completed ? 'Complete task' : 'Create task'}
						className="py-2 px-5"
						onClick={handleSubmit}
						style="primary"
						disabled={submitted}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default MaintenanceTaskModal;
