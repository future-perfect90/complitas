import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../../context/AuthProvider';
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
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isSuperAdmin = authMeta?.roles?.includes('SuperAdmin');

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
		if (isOpen && isSuperAdmin && !initialData) {
			const fetchCompanies = async () => {
				try {
					const companiesData = await getCompanies();
					setCompanies(companiesData);
				} catch (error) {
					toast.error('Failed to load companies.');
				}
			};
			fetchCompanies();
		} else {
			setSelectedCompany(companyUuid);
		}
	}, [isOpen, isSuperAdmin, initialData, companyUuid]);

	const handleSubmit = async () => {
		// Validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			toast.error('Invalid email address.');
			return;
		}

		const companyToAssign = isSuperAdmin ? selectedCompany : companyUuid;
		if (!companyToAssign) {
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
					companyToAssign
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
							{isSuperAdmin && (
								<div className="">
									<Label label="Company" />
									<select
										value={selectedCompany}
										onChange={(e) => setSelectedCompany(e.target.value)}
										className="w-full border rounded px-2 py-2 text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500"
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
							)}
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
						onClick={handleSubmit}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default UserModal;
