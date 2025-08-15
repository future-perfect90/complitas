import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UserModal from '../components/modals/UserModal';
import { useAuthMeta } from '../context/AuthProvider';

import type { User } from '../types';
import { getUsers } from '../utils/api';

const UserList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState<User | undefined>(undefined);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';

	const fetchUsers = async (companyUuid: string) => {
		try {
			const data = await getUsers(companyUuid);
			setUsers(data);
		} catch {
			toast.error('Failed to load users.');
		}
	};

	useEffect(() => {
		if (companyUuid) {
			fetchUsers(companyUuid);
		}
	}, [companyUuid]);

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
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">User List</h1>

				<button
					onClick={() => {
						setEditData(undefined);
						setIsModalOpen(true);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded">
					Add User
				</button>
			</div>
			<div className="bg-white shadow rounded overflow-hidden">
				<table className="min-w-full min-w-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-left text-slate-800">Email</th>
							<th className="px-4 py-2 text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users && users.length > 0 ?
							users.map((c) => (
								<tr key={c.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{c.name}</td>
									<td className="px-4 py-2 text-slate-800">{c.email}</td>
									{/* <td className="px-4 py-2 flex gap-2">
										<button
											onClick={() => c.id && handleEdit(c.id)}
											className="px-2 py-1 bg-blue-500 text-white rounded">
											Edit
										</button>
										<button
											onClick={() => c.id && handleDelete(c.id)}
											className="px-2 py-1 bg-red-500 text-white rounded">
											Delete
										</button>
									</td> */}
								</tr>
							))
						:	<tr className="border-t">
								<td
									colSpan={3}
									className="px-4 py-2 text-slate-800 justify-center text-center">
									No users found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
			<UserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={() => fetchUsers(companyUuid)}
				initialData={editData}
			/>
		</div>
	);
};

export default UserList;
