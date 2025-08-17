import React from 'react';
import { toast } from 'react-toastify';
import { removeFromTeam } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teamId: string;
	teamName: string;
	teamMembers: Member[];
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
	teamId,
	teamName,
	teamMembers,
}) => {

	const handleRemove = async (userId: string) => {
		try {
			await removeFromTeam(userId, teamId);
			toast.success('Member removed from team!');
			onSuccess();
		} catch {
			toast.error('Error removing from team.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={`View ${teamName} members`}>
			{teamMembers && teamMembers.length > 0 ?
				<div className="grid grid-cols-2 gap-4">
					<table className="min-w-full min-w-xl">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 text-left text-slate-800">Name</th>
								<th className="px-4 py-2 text-left text-slate-800">Email</th>
								<th className="px-4 py-2 text-left text-slate-800">Action</th>
							</tr>
						</thead>
						<tbody>
							{teamMembers.map((members: Member) => (
								<tr className="border-t" key={members.id}>
									<td className="px-4 py-2 text-slate-400">{members.name}</td>
									<td className="px-4 py-2 text-slate-400">{members.email}</td>
									<td>
										<Button
											label="Remove"
											onClick={() => handleRemove(members.id)}
											className="bg-red-400 py-1 px-3"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			:	<div>
					<p className={'text-slate-400'}>No users in team</p>
				</div>
			}
			<div className="flex justify-end gap-2 mt-4">
				<Button
					label="Cancel"
					onClick={onClose}
					className="bg-red-400 py-2 px-5"
				/>
			</div>
		</Modal>
	);
};

export default TeamMembersModal;
