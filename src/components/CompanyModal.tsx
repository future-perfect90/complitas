import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Company } from '../types';
import { createCompany, updateCompany } from '../utils/api';
import { Button } from './Button';
import Modal from './Modal';
import TextField from './TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	initialData?: Company;
}

const CompanyModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
}) => {
	const [name, setName] = useState('');
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [address3, setAddress3] = useState('');
	const [city, setCity] = useState('');
	const [county, setCounty] = useState('');
	const [country, setCountry] = useState('');
	const [postCode, setPostCode] = useState('');
	const [vatNo, setVatNo] = useState('');
	const [companyRegNo, setCompanyRegNo] = useState('');
	const [telephone, setTelephone] = useState('');
	const [email, setEmail] = useState('');
	const [id, setId] = useState(0);

	useEffect(() => {
		if (initialData) {
			setId(initialData.id || 0);
			setName(initialData.name);
			setAddress1(initialData.address1);
			setAddress2(initialData.address2 || '');
			setAddress3(initialData.address3 || '');
			setCity(initialData.city);
			setCounty(initialData.county);
			setCountry(initialData.country);
			setPostCode(initialData.postCode);
			setVatNo(initialData.vatNo);
			setCompanyRegNo(initialData.companyRegNo);
			setTelephone(initialData.telephone);
			setEmail(initialData.email);
		} else {
			setId(0);
			setName('');
			setAddress1('');
			setAddress2('');
			setAddress3('');
			setCity('');
			setCounty('');
			setCountry('');
			setPostCode('');
			setVatNo('');
			setCompanyRegNo('');
			setTelephone('');
			setEmail('');
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
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
		if (!emailRegex.test(email)) {
			toast.error('Invalid email address.');
			return;
		}

		try {
			if (initialData) {
				await updateCompany({
					id,
					name,
					address1,
					address2,
					address3,
					city,
					county,
					country,
					postCode,
					vatNo,
					companyRegNo,
					telephone,
					email,
				});
				toast.success('Company updated successfully!');
			} else {
				await createCompany({
					name,
					address1,
					address2,
					address3,
					city,
					county,
					country,
					postCode,
					vatNo,
					companyRegNo,
					telephone,
					email,
				});
				toast.success('Company created successfully!');
			}
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving company.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={initialData ? 'Edit Company' : 'Add Company'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<TextField
						label="Company Name"
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
						label="City"
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
						label="Vat No"
						value={vatNo}
						onChange={(e: any) => setVatNo(e.target.value)}
					/>
					<TextField
						label="Company Reg No"
						value={companyRegNo}
						onChange={(e: any) => setCompanyRegNo(e.target.value)}
					/>
					<TextField
						label="Telephone Number"
						value={telephone}
						onChange={(e: any) => setTelephone(e.target.value)}
						required
					/>
					<TextField
						label="Email Address"
						type="email"
						value={email}
						onChange={(e: any) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button label="Cancel" onClick={onClose} className="bg-red-400" />
					<Button
						label={initialData ? 'Update' : 'Create'}
						className="bg-green-400"
					/>
				</div>
			</form>
		</Modal>
	);
};

export default CompanyModal;
