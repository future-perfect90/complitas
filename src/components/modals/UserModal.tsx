import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../../context/AuthProvider';
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
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';

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

		try {
			if (initialData) {
				// await updateUser(
				// 	{
				// 		name,
				// 		email,
				// 	},
				// 	companyUuid
				// );
				//toast.success('User updated successfully!');
			} else {
				await createUser(
					{
						name,
						email,
						password,
					},
					companyUuid
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
					<Button label="Cancel" onClick={onClose} className="bg-red-400 py-2 px-5" />
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
