import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Team } from '../../types';
import { assignToTeam, getUsersWithNoTeam } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import MultiSelect from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teams: Team[];
}

interface Member {
	id: string;
	name: string;
	email: string;
}

const TeamMembersModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	teams,
}) => {
	const [teamMembers, setTeamMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);

	const teamOptions = teams.map((team) => ({
		value: team.id,
		name: team.name,
	}));

	const fetchTeamMembers = async (companyUuid: string) => {
		setLoading(true);
		try {
			const selectableUsers = await getUsersWithNoTeam(companyUuid);
			const memberOptions = selectableUsers.map((member: Member) => ({
				value: member.id,
				label: `${member.name} (${member.email})`,
			}));
			setMembers(memberOptions);
		} catch {
			toast.error('Problem retrieving user list123');
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
							options={teams}
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
					<Button label="Cancel" onClick={onClose} className="bg-red-400" />
					{members && members.length > 0 && (
						<Button label="Add members" className="bg-green-400" />
					)}
				</div>
			</form>
		</Modal>
	);
};

export default TeamMembersModal;
