import { useAuth0 } from '@auth0/auth0-react';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Property } from '../../types';
import { createProperty, updateProperty } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import Telephone from '../Telephone';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	initialData?: Property;
}

const emptyForm: Partial<Property> = {
	name: '',
	address1: '',
	address2: '',
	address3: '',
	city: '',
	county: '',
	country: '',
	postCode: '',
	managerName: '',
	telephone: '',
	managerEmail: '',
};

const PropertyModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
}) => {
	const { user } = useAuth0();
	const [form, setForm] = useState<Partial<Property>>(initialData || emptyForm);

	useEffect(() => {
		setForm(initialData || emptyForm);
	}, [initialData]);

	const handleSubmit = async () => {
		// Validation
		const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!form.name?.trim() || !form.address1?.trim()) {
			toast.error('Please fill in all required fields.');
			return;
		}
		if (form.telephone && !phoneRegex.test(form.telephone)) {
			toast.error('Invalid phone number.');
			return;
		}
		if (form.managerEmail && !emailRegex.test(form.managerEmail)) {
			toast.error('Invalid email address.');
			return;
		}

		try {
			if (initialData) {
				if (isEqual(initialData, form)) {
					toast.info('No changes have been made.');
					return;
				}
			}

			if (initialData) {
				await updateProperty(form, form.id!);
				toast.success('Property updated successfully!');
			} else {
				const companyId = user?.['https://complitas.dev/company_uuid'] || '';
				await createProperty(form, companyId);
				toast.success('Property created successfully!');
			}
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving property.');
		}
	};

	const handleFieldChange = (field: keyof Property, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={initialData ? 'Edit Property' : 'Add Property'}>
			<div className="grid grid-cols-2 gap-4">
				<TextField
					label="Property Name"
					value={form.name || ''}
					onChange={(e) => handleFieldChange('name', e.target.value)}
					required
				/>
				<TextField
					label="Address Line 1"
					value={form.address1 || ''}
					onChange={(e) => handleFieldChange('address1', e.target.value)}
					required
				/>
				<TextField
					label="Address Line 2"
					value={form.address2 || ''}
					onChange={(e) => handleFieldChange('address2', e.target.value)}
				/>
				<TextField
					label="Address Line 3"
					value={form.address3 || ''}
					onChange={(e) => handleFieldChange('address3', e.target.value)}
				/>
				<TextField
					label="Town/City"
					value={form.city || ''}
					onChange={(e) => handleFieldChange('city', e.target.value)}
				/>
				<TextField
					label="County"
					value={form.county || ''}
					onChange={(e) => handleFieldChange('county', e.target.value)}
				/>
				<TextField
					label="Post Code"
					value={form.postCode || ''}
					onChange={(e) => handleFieldChange('postCode', e.target.value)}
				/>
				<TextField
					label="Country"
					value={form.country || ''}
					onChange={(e) => handleFieldChange('country', e.target.value)}
				/>
				<TextField
					label="Manager Name"
					value={form.managerName || ''}
					onChange={(e) => handleFieldChange('managerName', e.target.value)}
					tooltip={true}
					tooltipContent="Property manager name"
				/>
				<Telephone
					label="Telephone Number"
					value={form.telephone || ''}
					onChange={(value) => handleFieldChange('telephone', value)}
					required
				/>
				<TextField
					label="Email Address"
					type="email"
					value={form.managerEmail || ''}
					onChange={(e) => handleFieldChange('managerEmail', e.target.value)}
					required
				/>
			</div>
			<div className="flex justify-end gap-2 mt-4">
				<Button
					label="Cancel"
					onClick={onClose}
					className="py-2 px-5"
					style="secondary"
				/>
				<Button
					label={initialData ? 'Update' : 'Create'}
					onClick={handleSubmit}
					className="py-2 px-5"
					style="primary"
				/>
			</div>
		</Modal>
	);
};

export default PropertyModal;
