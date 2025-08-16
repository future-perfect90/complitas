import React, { useEffect, useState } from 'react';
import { type MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../../context/AuthProvider';
import { assignToTeam, getTeamMembers } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import MultiSelect, { type OptionType } from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teamId: string;
	teamName: string;
}

interface Member {
	id: string;
	name: string;
	email: string;
}

const TeamAssignmentModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	teamId,
	teamName,
}) => {
	const [members, setMembers] = useState<OptionType[]>([]);
	const [chosenMembers, setChosenMembers] = useState<MultiValue<OptionType>>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';

	const fetchUsersWithNoTeam = async (companyUuid: string) => {
		setLoading(true);
		try {
			const selectableUsers = await getTeamMembers(companyUuid, false);
			const memberOptions = selectableUsers.map((member: Member) => ({
				value: member.id,
				label: `${member.name} (${member.email})`,
			}));
			setMembers(memberOptions);
		} catch {
			toast.error('Problem retrieving user list');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (companyUuid) {
			fetchUsersWithNoTeam(companyUuid);
		}
	}, [companyUuid]);

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
			fetchUsersWithNoTeam(companyUuid);
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
				{members && members.length > 0 ?
					<div className="grid grid-cols-2 gap-4">
						<MultiSelect
							options={members}
							value={chosenMembers}
							onChange={setChosenMembers}
							isDisabled={loading}
						/>
					</div>
				:	<div>
						<p className={'text-slate-400'}>No users available to add.</p>
					</div>
				}
				<div className="flex justify-end gap-2 mt-4">
					<Button label="Cancel" onClick={onClose} className="bg-red-400 py-2 px-5" />
					{members && members.length > 0 && (
						<Button label="Add members" className="bg-green-400 py-2 px-5" />
					)}
				</div>
			</form>
		</Modal>
	);
};

export default TeamAssignmentModal;
