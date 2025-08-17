import React, { useState } from 'react';
import { type MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import { assignToTeam } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import MultiSelect, { type OptionType } from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teamId: string;
	teamName: string;
	noTeamMembers: OptionType[];
}

const TeamAssignmentModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	teamId,
	teamName,
	noTeamMembers,
}) => {
	const [chosenMembers, setChosenMembers] = useState<MultiValue<OptionType>>(
		[]
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await assignToTeam(
				chosenMembers.map((member) => ({
					value: member.value,
					name: member.label,
				})),
				teamId
			);
			toast.success('Members added successfully!');
			setChosenMembers([]);
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving team.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Add members to ${teamName}`}>
			<form onSubmit={handleSubmit}>
				{noTeamMembers && noTeamMembers.length > 0 ?
					<div className="grid grid-cols-2 gap-4">
						<MultiSelect
							options={noTeamMembers}
							value={chosenMembers}
							onChange={setChosenMembers}
						/>
					</div>
				:	<div>
						<p className={'text-slate-400'}>No users available to add.</p>
					</div>
				}
				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					{noTeamMembers && noTeamMembers.length > 0 && (
						<Button label="Add members" className="bg-green-400 py-2 px-5" />
					)}
				</div>
			</form>
		</Modal>
	);
};

export default TeamAssignmentModal;
