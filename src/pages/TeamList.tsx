import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import LoadingSpinner from '../components/Loading';
import TeamAssignmentModal from '../components/modals/TeamAssignmentModal';
import TeamMembersModal from '../components/modals/TeamMembersModal';
import TeamModal from '../components/modals/TeamModal';
import TeamPropertiesModal from '../components/modals/TeamPropertiesModal';
import { type OptionType } from '../components/MultiSelect';
import { useAuthMeta } from '../context/AuthProvider';
import type { Property, Team } from '../types';
import { getTeamMembers, getTeamProperties, getTeams } from '../utils/api';

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

	//UPDATE TYPE
	const [assignedProperties, setAssignedProperties] = useState<Property[]>([]);
	const [unassignedProperties, setUnassignedProperties] = useState<
		OptionType[]
	>([]);

	const [modal, setModal] = useState<{
		type: 'create' | 'assign' | 'view' | 'viewAssignProperties' | null;
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
			const users = await getTeamMembers(companyUuid, '');
			const options = users.map((u: Member) => ({
				value: u.id,
				label: `${u.name} (${u.email})`,
			}));
			setNoTeamMembers(options);
		} catch {
			toast.error('Problem retrieving user list');
		}
	}, [companyUuid]);

	const fetchTeamMembers = useCallback(
		async (teamId: string) => {
			if (!companyUuid) return;
			try {
				const members = await getTeamMembers(companyUuid, teamId);
				setTeamMembers(members);
			} catch {
				console.error('Problem retrieving user list');
			}
		},
		[companyUuid]
	);

	const fetchProperties = useCallback(async () => {
		if (!companyUuid) return;
		try {
			const unassignedProperties = await getTeamProperties(companyUuid, '');
			const options =
				unassignedProperties && unassignedProperties.length > 0 ?
					unassignedProperties.map((u: Property) => ({
						value: u.id,
						label: `${u.name} (${u.managerEmail})`,
					}))
				:	[];
			setUnassignedProperties(options);
		} catch (e) {
			console.error('Problem retrieving property list', e);
		}
	}, [companyUuid]);

	const fetchTeamProperties = useCallback(
		async (teamId: string) => {
			if (!companyUuid) return;
			try {
				const assignProperties = await getTeamProperties(companyUuid, teamId);
				setAssignedProperties(assignProperties);
			} catch {
				console.error('Problem retrieving team property list');
			}
		},
		[companyUuid]
	);

	useEffect(() => {
		if (!isLoading && companyUuid) {
			fetchTeams();
		}
	}, [companyUuid, isLoading, fetchTeams]);

	const handleAssignClick = async (teamId: string, teamName: string) => {
		setModal({ type: 'assign', teamId, teamName });
		await fetchUsersWithNoTeam();
	};

	const handleViewMembersClick = async (teamId: string, teamName: string) => {
		setModal({ type: 'view', teamId, teamName });
		await fetchTeamMembers(teamId);
	};

	const handleViewAssignProperty = async (teamId: string, teamName: string) => {
		setModal({ type: 'viewAssignProperties', teamId, teamName });
		await fetchProperties();
		await fetchTeamProperties(teamId);
	};

	const closeModal = () => setModal({ type: null });

	if (isLoading) {
		return <LoadingSpinner message={'Loading teams...'} />;
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Teams</h1>
				<button
					onClick={() => setModal({ type: 'create' })}
					className="px-4 py-2 bg-green-600 text-[#F8F9FA] rounded">
					Add Team
				</button>
			</div>

			<div className="bg-white shadow rounded-lg overflow-x-auto">
				<table className="min-w-full min-w-xl w-full border dark:border-none">
					<thead className="bg-gray-400">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{teams.length > 0 ?
							teams.map((t) => (
								<tr key={t.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{t.name}</td>
									<td className="px-4 py-2 flex gap-2 justify-end">
										<Button
											label="Assign Members"
											onClick={() => t.id && handleAssignClick(t.id, t.name)}
											className="p-2 bg-blue-500 text-[#F8F9FA] rounded"
										/>
										<Button
											label="View Members"
											onClick={() =>
												t.id && handleViewMembersClick(t.id, t.name)
											}
											className="p-2 bg-green-500 text-[#F8F9FA] rounded"
										/>
										<Button
											label="View properties"
											onClick={() =>
												t.id && handleViewAssignProperty(t.id, t.name)
											}
											className="p-2 bg-purple-500 text-[#F8F9FA] rounded"
										/>
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
					await fetchTeamMembers(modal.teamId || '');
				}}
				teamId={modal.teamId || ''}
				teamName={modal.teamName || ''}
				teamMembers={teamMembers}
			/>

			{/* View/Assign Properties */}
			<TeamPropertiesModal
				isOpen={modal.type === 'viewAssignProperties'}
				onClose={closeModal}
				onSuccess={async () => {
					await fetchProperties();
					await fetchTeamProperties(modal.teamId || '');
				}}
				teamId={modal.teamId || ''}
				teamName={modal.teamName || ''}
				assignedProperties={assignedProperties}
				unassignedProperties={unassignedProperties}
			/>
		</div>
	);
};

export default TeamList;
