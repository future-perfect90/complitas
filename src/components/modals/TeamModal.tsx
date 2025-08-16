import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../../context/AuthProvider';
import { createTeam } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const TeamModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
	const [name, setName] = useState('');
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await createTeam(name, companyUuid);
			toast.success('Team created successfully!');

			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving team.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={'Create Team'}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<TextField
						label="Name"
						value={name}
						onChange={(e: any) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button label="Cancel" onClick={onClose} className="bg-red-400 py-2 px-5" />
					<Button label="Create" className="bg-green-400 py-2 px-5" />
				</div>
			</form>
		</Modal>
	);
};

export default TeamModal;
