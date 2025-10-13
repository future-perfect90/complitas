import { useAuth0 } from '@auth0/auth0-react';
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

const PropertyModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
}) => {
	const { user } = useAuth0();
	const [name, setName] = useState('');
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [address3, setAddress3] = useState('');
	const [city, setCity] = useState('');
	const [county, setCounty] = useState('');
	const [country, setCountry] = useState('');
	const [postCode, setPostCode] = useState('');
	const [managerName, setManagerName] = useState('');
	const [telephone, setTelephone] = useState('');
	const [managerEmail, setManagerEmail] = useState('');
	const [id, setId] = useState('');

	useEffect(() => {
		if (initialData) {
			setId(initialData.id || '');
			setName(initialData.name);
			setAddress1(initialData.address1);
			setAddress2(initialData.address2 || '');
			setAddress3(initialData.address3 || '');
			setCity(initialData.city);
			setCounty(initialData.county);
			setCountry(initialData.country);
			setPostCode(initialData.postCode);
			setManagerName(initialData.managerName);
			setTelephone(initialData.telephone);
			setManagerEmail(initialData.managerEmail);
		} else {
			setId('');
			setName('');
			setAddress1('');
			setAddress2('');
			setAddress3('');
			setCity('');
			setCounty('');
			setCountry('');
			setPostCode('');
			setManagerName('');
			setTelephone('');
			setManagerEmail('');
		}
	}, [initialData]);

	const handleSubmit = async () => {
		// Validation
		const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!name.trim() || !address1.trim()) {
			toast.error('Please fill in all required fields.');
			return;
		}
		if (!phoneRegex.test(telephone)) {
			toast.error('Invalid phone number.');
			return;
		}
		if (!emailRegex.test(managerEmail)) {
			toast.error('Invalid email address.');
			return;
		}

		try {
			if (initialData) {
				await updateProperty(
					{
						name,
						address1,
						address2,
						address3,
						city,
						county,
						country,
						postCode,
						managerName,
						telephone,
						managerEmail,
					},
					id
				);
				toast.success('Property updated successfully!');
			} else {
				const companyId = user?.['https://complitas.dev/company_uuid'] || '';
				await createProperty(
					{
						name,
						address1,
						address2,
						address3,
						city,
						county,
						country,
						postCode,
						managerEmail,
						telephone,
						managerName,
					},
					companyId
				);
				toast.success('Property created successfully!');
			}
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving property.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={initialData ? 'Edit Property' : 'Add Property'}>
			<div className="grid grid-cols-2 gap-4">
				<TextField
					label="Property Name"
					value={name}
					onChange={(e: any) => setName(e.target.value)}
					required
				/>
				<TextField
					label="Address Line 1"
					value={address1}
					onChange={(e: any) => setAddress1(e.target.value)}
					required
				/>
				<TextField
					label="Address Line 2"
					value={address2}
					onChange={(e: any) => setAddress2(e.target.value)}
				/>
				<TextField
					label="Address Line 3"
					value={address3}
					onChange={(e: any) => setAddress3(e.target.value)}
				/>
				<TextField
					label="Town/City"
					value={city}
					onChange={(e: any) => setCity(e.target.value)}
				/>
				<TextField
					label="County"
					value={county}
					onChange={(e: any) => setCounty(e.target.value)}
				/>
				<TextField
					label="Post Code"
					value={postCode}
					onChange={(e: any) => setPostCode(e.target.value)}
				/>
				<TextField
					label="Country"
					value={country}
					onChange={(e: any) => setCountry(e.target.value)}
				/>
				<TextField
					label="Manager Name"
					value={managerName}
					onChange={(e: any) => setManagerName(e.target.value)}
					tooltip={true}
					tooltipContent="Property manager name"
				/>
				<Telephone
					label="Telephone Number"
					value={telephone}
					onChange={(telephone) => setTelephone(telephone)}
					required
				/>
				<TextField
					label="Email Address"
					type="email"
					value={managerEmail}
					onChange={(e: any) => setManagerEmail(e.target.value)}
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
