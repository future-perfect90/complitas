import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Company, User } from '../../types';
import { createUser, getCompanies } from '../../utils/api';
import { Button } from '../Button';
import Label from '../Label';
import Modal from '../Modal';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	initialData?: User;
}

const UserModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	initialData,
}) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedCompany, setSelectedCompany] = useState('');

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setEmail(initialData.email);
		} else {
			setName('');
			setEmail('');
			setPassword('');
			setSelectedCompany('');
		}
	}, [initialData, isOpen]);

	useEffect(() => {
		if (isOpen && !initialData) {
			const fetchCompanies = async () => {
				try {
					const data = await getCompanies();
					setCompanies(data);
				} catch (error) {
					toast.error('Failed to load companies.');
				}
			};
			fetchCompanies();
		}
	}, [isOpen, initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			toast.error('Invalid email address.');
			return;
		}

		if (!initialData && !selectedCompany) {
			toast.error('Please select a company.');
			return;
		}

		try {
			if (initialData) {
				// Update user logic can go here
			} else {
				await createUser(
					{
						name,
						email,
						password,
					},
					selectedCompany
				);
				toast.success('User created successfully!');
			}
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving user.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={initialData ? 'Edit User' : 'Add User'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<TextField
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<TextField
						label="Email Address"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					{!initialData && (
						<>
							<TextField
								label="Password"
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								required
							/>
							<div className="">
								<Label label="Company" />
								<select
									value={selectedCompany}
									onChange={(e) => setSelectedCompany(e.target.value)}
									className="w-full border rounded px-2 py-2 text-gray-900"
									required>
									<option value="" disabled>
										Select a company
									</option>
									{companies.map((company) => (
										<option key={company.id} value={company.id}>
											{company.name}
										</option>
									))}
								</select>
							</div>
						</>
					)}
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					<Button
						label={initialData ? 'Update' : 'Create'}
						className="bg-green-400 py-2 px-5"
					/>
				</div>
			</form>
		</Modal>
	);
};

export default UserModal;
