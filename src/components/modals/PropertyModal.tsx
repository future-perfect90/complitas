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

interface FormData {
	name: string;
	address1: string;
	address2: string;
	address3: string;
	town: string;
	city: string;
	county: string;
	postCode: string;
	country: string;
	managerName: string;
	managerEmail: string;
	telephone: string;
}

interface FormErrors {
	name?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	town?: string;
	city?: string;
	county?: string;
	postCode?: string;
	country?: string;
	managerName?: string;
	managerEmail?: string;
	telephone?: string;
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
	const [formData, setFormData] = useState<Partial<Property>>(
		initialData || emptyForm
	);
	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		setFormData(initialData || emptyForm);
	}, [initialData]);

	const validate = (data: Partial<Property>): FormErrors => {
		const newErrors: FormErrors = {};

		if (!data.name?.trim()) newErrors.name = 'Property name is required.';
		if (!data.address1?.trim())
			newErrors.address1 = 'Address line 1 is required.';
		if (!data.address2?.trim())
			newErrors.address2 = 'Address line 2 is required.';
		if (!data.city?.trim()) newErrors.city = 'Town/City is required.';
		if (!data.postCode?.trim()) newErrors.postCode = 'Postcode is required.';
		if (!data.managerName?.trim())
			newErrors.managerName = 'Manager name is required.';
		if (!data.managerEmail?.trim()) {
			newErrors.managerEmail = 'Manager email is required.';
		} else if (!/\S+@\S+\.\S+/.test(data.managerEmail)) {
			newErrors.managerEmail = 'Email is not valid.';
		}
		if (!data.telephone?.trim()) {
			newErrors.telephone = 'Telephone is required.';
		}

		return newErrors;
	};

	const handleSubmit = async () => {
		const validationErrors = validate(formData);
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			try {
				if (initialData) {
					if (isEqual(initialData, formData)) {
						toast.info('No changes have been made.');
						return;
					}
				}

				if (initialData) {
					await updateProperty(formData, formData.id!);
					toast.success('Property updated successfully!');
				} else {
					const companyId = user?.['https://complitas.dev/company_uuid'] || '';
					await createProperty(formData, companyId);
					toast.success('Property created successfully!');
				}
				onSuccess();
				handleClose();
			} catch {
				toast.error('Error saving property.');
			}
		}
	};

	const handleChange = (field: keyof FormData, value: string) => {
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
			title={initialData ? 'Edit Property' : 'Add Property'}>
			<div className="grid grid-cols-2 gap-4">
				<TextField
					label="Property Name"
					value={formData.name || ''}
					onChange={(e) => handleChange('name', e.target.value)}
					required
					error={errors.name}
				/>
				<TextField
					label="Address Line 1"
					value={formData.address1 || ''}
					onChange={(e) => handleChange('address1', e.target.value)}
					required
					error={errors.address1}
				/>
				<TextField
					label="Address Line 2"
					value={formData.address2 || ''}
					onChange={(e) => handleChange('address2', e.target.value)}
					error={errors.address2}
				/>
				<TextField
					label="Address Line 3"
					value={formData.address3 || ''}
					onChange={(e) => handleChange('address3', e.target.value)}
				/>
				<TextField
					label="Town/City"
					value={formData.city || ''}
					onChange={(e) => handleChange('city', e.target.value)}
					error={errors.city}
				/>
				<TextField
					label="County"
					value={formData.county || ''}
					onChange={(e) => handleChange('county', e.target.value)}
				/>
				<TextField
					label="Postcode"
					value={formData.postCode || ''}
					onChange={(e) => handleChange('postCode', e.target.value)}
					error={errors.postCode}
				/>
				<TextField
					label="Country"
					value={formData.country || ''}
					onChange={(e) => handleChange('country', e.target.value)}
				/>
				<TextField
					label="Manager Name"
					value={formData.managerName || ''}
					onChange={(e) => handleChange('managerName', e.target.value)}
					tooltip={true}
					tooltipContent="Property manager name"
					error={errors.managerName}
				/>
				<Telephone
					label="Telephone Number"
					value={formData.telephone || ''}
					onChange={(value) => handleChange('telephone', value)}
					required
					error={errors.telephone}
				/>
				<TextField
					label="Email Address"
					type="email"
					value={formData.managerEmail || ''}
					onChange={(e) => handleChange('managerEmail', e.target.value)}
					required
					error={errors.managerEmail}
				/>
			</div>
			<div className="flex justify-end gap-2 mt-4">
				<Button
					label="Cancel"
					onClick={handleClose}
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