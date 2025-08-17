import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TeamAssignmentModal from '../components/modals/TeamAssignmentModal';
import TeamMembersModal from '../components/modals/TeamMembersModal';
import TeamModal from '../components/modals/TeamModal';
import { useAuthMeta } from '../context/AuthProvider';
import type { Team } from '../types';
import { getTeams } from '../utils/api';

const TeamList: React.FC = () => {
	const [id, setId] = useState('');
	const [teamName, setTeamName] = useState('');
	const [teams, setTeams] = useState<Team[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
	const [isTeamAssignmentModalOpen, setIsTeamAssignmentModalOpen] =
		useState(false);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isLoading = authMeta?.isLoading;

	const fetchTeams = async (companyUuid: string) => {
		try {
			const data = await getTeams(companyUuid);
			setTeams(data);
		} catch {
			console.log('Failed to load teams.');
		}
	};

	useEffect(() => {
		if (!isLoading && companyUuid) {
			fetchTeams(companyUuid);
		}
	}, [companyUuid, isLoading]);

	const handleAssignment = async (id: string, name: string) => {
		try {
			setId(id);
			setTeamName(name);
			setIsTeamAssignmentModalOpen(true);
		} catch {
			toast.error('Error fetching user data.');
		}
	};

	const viewMembers = async (id: string) => {
		try {
			setId(id);
			setViewMembersModalOpen(true);
		} catch {
			toast.error('Error viewing members');
		}
	};

	if (isLoading) {
		return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Teams</h1>

				<button
					onClick={() => {
						setIsModalOpen(true);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded">
					Add Team
				</button>
			</div>
			<div>
				<ul>
					<li>
						After removing last user, should show message that no users are left
					</li>
					<li>
						after adding members, they should be able to be viewed - get lists
						on main component and pass children to modal, so on success refetch
						data
					</li>
				</ul>
			</div>
			<div className="bg-white shadow rounded overflow-hidden">
				<table className="min-w-full min-w-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-left text-slate-800 text-right">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{teams && teams.length > 0 ?
							teams.map((t) => (
								<tr key={t.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{t.name}</td>

									<td className="px-4 py-2 flex gap-2 justify-end">
										<button
											onClick={() => t.id && handleAssignment(t.id, t.name)}
											className="px-2 py-1 bg-blue-500 text-white rounded">
											Assign members
										</button>
										<button
											onClick={() => t.id && viewMembers(t.id)}
											className="px-2 py-1 bg-green-500 text-white rounded">
											View Members
										</button>
									</td>
								</tr>
							))
						:	<tr className="border-t">
								<td
									colSpan={5}
									className="px-4 py-2 text-slate-800 justify-center text-center">
									No teams found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
			<TeamModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={() => companyUuid && fetchTeams(companyUuid)}
			/>
			<TeamAssignmentModal
				isOpen={isTeamAssignmentModalOpen}
				onClose={() => setIsTeamAssignmentModalOpen(false)}
				onSuccess={() => companyUuid && fetchTeams(companyUuid)}
				teamId={id}
				teamName={teamName}
			/>
			<TeamMembersModal
				isOpen={viewMembersModalOpen}
				onClose={() => setViewMembersModalOpen(false)}
				onSuccess={() => companyUuid && fetchTeams(companyUuid)}
				teamId={id}
				teamName={teamName}
			/>
		</div>
	);
};

export default TeamList;
