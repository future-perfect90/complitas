import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CompanyModal from '../components/modals/CompanyModal';
import type { Company } from '../types';
import { deleteCompany, getCompanies, getCompany } from '../utils/api';

const CompanyList: React.FC = () => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState<Company | undefined>(undefined);

	const fetchCompanies = async () => {
		try {
			const data = await getCompanies();
			setCompanies(data);
		} catch {
			toast.error('Failed to load companies.');
		}
	};

	useEffect(() => {
		fetchCompanies();
	}, []);

	const handleEdit = async (id: string) => {
		try {
			const company = await getCompany(id);
			setEditData(company);
			setIsModalOpen(true);
		} catch {
			toast.error('Error fetching company data.');
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this company?'))
			return;
		try {
			await deleteCompany(id);
			toast.success('Company deleted successfully!');
			fetchCompanies();
		} catch {
			toast.error('Error deleting company.');
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Company List</h1>

				<button
					onClick={() => {
						setEditData(undefined);
						setIsModalOpen(true);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded">
					Add Company
				</button>
			</div>
			<div className="bg-white shadow rounded overflow-hidden">
				<table className="min-w-full min-w-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">ID</th>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-left text-slate-800">Address</th>
							<th className="px-4 py-2 text-left text-slate-800">Telephone</th>
							<th className="px-4 py-2 text-left text-slate-800">Email</th>
							<th className="px-4 py-2 text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{companies && companies.length > 0 ?
							companies.map((c) => (
								<tr key={c.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{c.id}</td>
									<td className="px-4 py-2 text-slate-800">{c.name}</td>
									<td className="px-4 py-2 text-slate-800">
										{c.address1}
										{c.address2 && `, ${c.address2}`}
									</td>
									<td className="px-4 py-2 text-slate-800">{c.telephone}</td>
									<td className="px-4 py-2 text-slate-800">{c.email}</td>
									<td className="px-4 py-2 flex gap-2">
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
									</td>
								</tr>
							))
						:	<tr className="border-t">
								<td
									colSpan={5}
									className="px-4 py-2 text-slate-800 justify-center text-center">
									No companies found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
			<CompanyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchCompanies}
				initialData={editData}
			/>
		</div>
	);
};

export default CompanyList;
