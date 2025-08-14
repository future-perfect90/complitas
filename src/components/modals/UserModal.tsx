import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { createUser } from '../../utils/api';
import { Button } from '../Button';
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

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setEmail(initialData.email);
		} else {
			setName('');
			setEmail('');
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			toast.error('Invalid email address.');
			return;
		}

		// const companyIdFromToken = '156659f4-77b3-11f0-910a-6a02ccf97a78';
		const companyIdFromToken = 'e81e211c-77bb-11f0-910a-6a02ccf97a78'; //metropolitan

		try {
			if (initialData) {
				// await updateUser(
				// 	{
				// 		name,
				// 		address1,
				// 		address2,
				// 		address3,
				// 		city,
				// 		county,
				// 		country,
				// 		postCode,
				// 		managerName,
				// 		telephone,
				// 		email,
				// 	},
				// 	id
				// );
				//toast.success('User updated successfully!');
			} else {
				await createUser(
					{
						name,
						email,
						password,
					},
					companyIdFromToken
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
						onChange={(e: any) => setName(e.target.value)}
						required
					/>
					<TextField
						label="Email Address"
						type="email"
						value={email}
						onChange={(e: any) => setEmail(e.target.value)}
						required
					/>
					<TextField
						label="Password"
						type="password"
						onChange={(e: any) => setPassword(e.target.value)}
						value={password}
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

export default UserModal;
