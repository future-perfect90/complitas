import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import TextField from '../TextField';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	userUuid: string;
}

const ChangePasswordModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	userUuid,
}) => {
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("New passwords don't match.");
			return;
		}
		if (newPassword.length < 8) {
			toast.error('New password must be at least 8 characters long.');
			return;
		}

		setIsSubmitting(true);
		try {
			await changePassword(userUuid, newPassword);
			onSuccess();
		} catch (error) {
			toast.error(`Failed to change password. ${error}. Please try again.`);
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Change Password">
			<form onSubmit={handleSubmit} className="space-y-4">
				<TextField
					label="New Password"
					type={showPassword ? 'text' : 'password'}
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>
				<TextField
					label="Confirm New Password"
					type={showPassword ? 'text' : 'password'}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<div className="flex items-center">
					<input
						id="show-password"
						type="checkbox"
						checked={showPassword}
						onChange={() => setShowPassword(!showPassword)}
						className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="show-password"
						className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
						Show passwords
					</label>
				</div>
				<div className="flex justify-end gap-2 pt-4">
					<Button
						type="button"
						label="Cancel"
						onClick={onClose}
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4"
					/>
					<Button
						type="submit"
						label={isSubmitting ? 'Updating...' : 'Update Password'}
						disabled={isSubmitting}
						className="bg-green-600 hover:bg-green-700 text-white py-2 px-4"
					/>
				</div>
			</form>
		</Modal>
	);
};

export default ChangePasswordModal;
