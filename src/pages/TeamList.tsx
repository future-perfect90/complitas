import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TeamAssignmentModal from '../components/modals/TeamAssignmentModal';
import TeamMembersModal from '../components/modals/TeamMembersModal';
import TeamModal from '../components/modals/TeamModal';
import { type OptionType } from '../components/MultiSelect';
import { useAuthMeta } from '../context/AuthProvider';
import type { Team } from '../types';
import { getTeamMembers, getTeams } from '../utils/api';

interface Member {
	id: string;
	name: string;
	email: string;
}

const TeamList: React.FC = () => {
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isLoading = authMeta?.isLoading;

	const [teams, setTeams] = useState<Team[]>([]);
	const [noTeamMembers, setNoTeamMembers] = useState<OptionType[]>([]);
	const [teamMembers, setTeamMembers] = useState<Member[]>([]);

	const [modal, setModal] = useState<{
		type: 'create' | 'assign' | 'view' | null;
		teamId?: string;
		teamName?: string;
	}>({ type: null });

	const fetchTeams = useCallback(async () => {
		if (!companyUuid) return;
		try {
			const data = await getTeams(companyUuid);
			setTeams(data);
		} catch {
			console.error('Failed to load teams.');
		}
	}, [companyUuid]);

	const fetchUsersWithNoTeam = useCallback(async () => {
		if (!companyUuid) return;
		try {
			const users = await getTeamMembers(companyUuid, false);
			const options = users.map((u: Member) => ({
				value: u.id,
				label: `${u.name} (${u.email})`,
			}));
			setNoTeamMembers(options);
		} catch {
			toast.error('Problem retrieving user list');
		}
	}, [companyUuid]);

	const fetchTeamMembers = useCallback(async () => {
		if (!companyUuid) return;
		try {
			const members = await getTeamMembers(companyUuid, true);
			setTeamMembers(members);
		} catch {
			console.error('Problem retrieving user list');
		}
	}, [companyUuid]);

	useEffect(() => {
		if (!isLoading && companyUuid) {
			fetchTeams();
			fetchTeamMembers();
		}
	}, [companyUuid, isLoading, fetchTeams, fetchTeamMembers]);

	const handleAssignClick = async (teamId: string, teamName: string) => {
		setModal({ type: 'assign', teamId, teamName });
		await fetchUsersWithNoTeam();
	};

	const handleViewMembersClick = (teamId: string, teamName: string) => {
		setModal({ type: 'view', teamId, teamName });
	};

	const closeModal = () => setModal({ type: null });

	if (isLoading) {
		return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Teams</h1>
				<button
					onClick={() => setModal({ type: 'create' })}
					className="px-4 py-2 bg-green-600 text-white rounded">
					Add Team
				</button>
			</div>

			<div className="bg-white shadow rounded overflow-hidden">
				<table className="min-w-full min-w-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-right text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{teams.length > 0 ?
							teams.map((t) => (
								<tr key={t.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{t.name}</td>
									<td className="px-4 py-2 flex gap-2 justify-end">
										<button
											onClick={() => t.id && handleAssignClick(t.id, t.name)}
											className="px-2 py-1 bg-blue-500 text-white rounded">
											Assign Members
										</button>
										<button
											onClick={() =>
												t.id && handleViewMembersClick(t.id, t.name)
											}
											className="px-2 py-1 bg-green-500 text-white rounded">
											View Members
										</button>
									</td>
								</tr>
							))
						:	<tr className="border-t">
								<td
									colSpan={2}
									className="px-4 py-2 text-center text-slate-800">
									No teams found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>

			{/* Create team */}
			<TeamModal
				isOpen={modal.type === 'create'}
				onClose={closeModal}
				onSuccess={fetchTeams}
			/>

			{/* Assign members */}
			<TeamAssignmentModal
				isOpen={modal.type === 'assign'}
				onClose={closeModal}
				onSuccess={async () => {
					await fetchTeams();
					await fetchUsersWithNoTeam();
					await fetchTeamMembers();
				}}
				teamId={modal.teamId || ''}
				teamName={modal.teamName || ''}
				noTeamMembers={noTeamMembers}
			/>

			{/* View members */}
			<TeamMembersModal
				isOpen={modal.type === 'view'}
				onClose={closeModal}
				onSuccess={async () => {
					await fetchTeams();
					await fetchTeamMembers();
				}}
				teamId={modal.teamId || ''}
				teamName={modal.teamName || ''}
				teamMembers={teamMembers}
			/>
		</div>
	);
};

export default TeamList;
