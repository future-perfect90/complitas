import React, { useEffect, useState } from 'react';
import type { MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import { updateNotificationPreferences } from '../../utils/api';
import { Button } from '../Button';
import Label from '../Label';
import Modal from '../Modal';
import MultiSelect, { type OptionType } from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	propertyId: string;
	currentPreferences: any[];
}

const preferenceOptions: OptionType[] = [
	{ value: '7', label: '1 Week' },
	{ value: '14', label: '2 Weeks' },
	{ value: '21', label: '3 Weeks' },
	{ value: '30', label: '1 Month' },
	{ value: '60', label: '2 Months' },
	{ value: '90', label: '3 Months' },
	{ value: '180', label: '6 Months' },
];

const NotificationPreferencesModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	propertyId,
	currentPreferences,
}) => {
	const [selectedPreferences, setSelectedPreferences] = useState<
		MultiValue<OptionType>
	>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const selected =
				currentPreferences?.map((p) => ({
					value: String(p.daysBeforeExpiry),
					label:
						preferenceOptions.find(
							(opt) => opt.value === String(p.daysBeforeExpiry)
						)?.label || `${p.daysBeforeExpiry} days`,
				})) || [];
			setSelectedPreferences(selected);
		}
	}, [isOpen, currentPreferences]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const days = selectedPreferences.map((p) => Number(p.value));
			await updateNotificationPreferences(propertyId, days);
			toast.success('Notification preferences updated successfully!');
			onSuccess();
			onClose();
		} catch (error) {
			console.error('Failed to update preferences', error);
			toast.error('Failed to update notification preferences.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Notification Preferences">
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<Label label="Select notification intervals" />
					<MultiSelect
						options={preferenceOptions}
						value={selectedPreferences}
						onChange={setSelectedPreferences}
						closeMenuOnSelect={false}
						menuPortalTarget={document.body}
					/>
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						type="button"
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					<Button
						type="submit"
						label={isSubmitting ? 'Saving...' : 'Save Preferences'}
						className="bg-green-400 py-2 px-5"
						disabled={isSubmitting}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default NotificationPreferencesModal;
