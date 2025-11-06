import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import UserAssignmentModal from '../components/modals/UserAssignmentModal';
import UserModal from '../components/modals/UserModal';
import SearchInput from '../components/SearchInput';
import { useAuthMeta } from '../context/AuthProvider';
import { useSearch } from '../hooks/useSearch';
import type { User } from '../types';
import { getUsers } from '../utils/api';

const UserList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState<User | undefined>(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [modal, setModal] = useState<{
		type: 'viewAssignProperties' | null;
		user?: User;
	}>({ type: null });

	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isSuperAdmin = authMeta?.roles?.includes('SuperAdmin');

	const fetchUsers = async (companyUuid: string) => {
		try {
			const data = await getUsers(companyUuid);
			setUsers(data);
		} catch {
			toast.error('Failed to load users.');
		}
	};

	const handleOpenUserAssignmentModal = async (user: User) => {
		setModal({ type: 'viewAssignProperties', user });
	};

	useEffect(() => {
		if (companyUuid || isSuperAdmin) {
			fetchUsers(companyUuid);
		}
	}, [companyUuid, isSuperAdmin]);

	const userSearchKeys = useMemo(() => ['name', 'email'], []);
	const filteredUsers = useSearch(
		users,
		searchTerm,
		userSearchKeys as (keyof User)[]
	);

	// const handleEdit = async (id: string) => {
	// 	try {
	// 		const user = await getUser(id);
	// 		setEditData(user);
	// 		setIsModalOpen(true);
	// 	} catch {
	// 		toast.error('Error fetching user data.');
	// 	}
	// };

	// const handleDelete = async (id: string) => {
	// 	if (!window.confirm('Are you sure you want to delete this user?')) return;
	// 	try {
	// 		await deleteUser(id);
	// 		toast.success('User deleted successfully!');
	// 		fetchCompanies();
	// 	} catch {
	// 		toast.error('Error deleting user.');
	// 	}
	// };

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<div>
					<h1 className="text-2xl font-bold">User List</h1>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:w-auto">
					<SearchInput
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder="Search users..."
					/>
					<Button
						label="Add User"
						onClick={() => {
							setEditData(undefined);
							setIsModalOpen(true);
						}}
						className="p-2 float-right"
						style="primary"
					/>
				</div>
			</div>
			{filteredUsers.length > 0 ?
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredUsers.map((user) => (
						<Card
							key={user.id}
							className="rounded-xl shadow-lg flex flex-col justify-between">
							<CardHeader>
								<CardTitle className="text-xl font-bold">
									{user.name}
									<Button
										label="Assign"
										className="float-right py-1 px-4"
										onClick={() => handleOpenUserAssignmentModal(user)}
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-5 text-sm">
								<div className="mt-3">
									<p className="font-semibold text-[#212529] dark:text-[#F8F9FA]">
										Email
									</p>
									<p>{user.email}</p>
								</div>
								{isSuperAdmin && user.company && (
									<div>
										<p className="font-semibold text-[#212529] dark:text-[#F8F9FA]">
											Company
										</p>
										<p>{user.company}</p>
									</div>
								)}
							</CardContent>
							{/* <div className="p-4 flex flex-wrap justify-end gap-2 border-t border-gray-200 dark:border-gray-700 mt-4">
								<Button
									label="Edit"
									onClick={() => user.id && handleEdit(user.id)}
									className="px-2 sm:px-3 py-1 bg-blue-500 text-[#F8F9FA] rounded text-xs sm:text-sm"
								/>
								<Button
									label="Delete"
									onClick={() => user.id && handleDelete(user.id)}
									className="px-2 sm:px-3 py-1 bg-red-500 text-[#F8F9FA] rounded text-xs sm:text-sm"
								/>
							</div> */}
						</Card>
					))}
				</div>
			:	<div className="max-w-5xl mx-auto text-center py-16">
					<p className="text-[#6C757D] dark:text-[#F8F9FA]">No users found.</p>
				</div>
			}
			<UserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={() => fetchUsers(companyUuid)}
				initialData={editData}
			/>
			{modal.type === 'viewAssignProperties' && modal.user && (
				<UserAssignmentModal
					isOpen={modal.type === 'viewAssignProperties'}
					onClose={() => setModal({ type: null })}
					onSuccess={() => fetchUsers(companyUuid)}
					userId={modal.user.id ?? ''}
					userName={modal.user.name}
					companyId={companyUuid}
				/>
			)}
		</div>
	);
};

export default UserList;
