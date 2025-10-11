import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import SearchInput from '../components/SearchInput';
import PropertyModal from '../components/modals/PropertyModal';
import { useAuthMeta } from '../context/AuthProvider';
import { useSearch } from '../hooks/useSearch';
import type { Property } from '../types';
import { deleteProperty, getProperties, getProperty } from '../utils/api';
import LoadingSpinner from '../components/modals/Loading';

const PropertyList: React.FC = () => {
	const [properties, setProperties] = useState<Property[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [editData, setEditData] = useState<Property | undefined>(undefined);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isLoading = authMeta?.isLoading;
	const navigate = useNavigate();

	const fetchProperties = useCallback(async (companyUuid: string) => {
		try {
			const data = await getProperties(companyUuid);
			setProperties(data);
		} catch {
			toast.error('Failed to load properties.');
		}
	}, []);

	useEffect(() => {
		if (!isLoading && companyUuid) {
			fetchProperties(companyUuid);
		}
	}, [companyUuid, isLoading, fetchProperties]);

	const propertySearchKeys = useMemo(
		() => ['name', 'address1', 'address2', 'telephone', 'managerEmail'],
		[]
	);
	const filteredProperties = useSearch(
		properties,
		searchTerm,
		propertySearchKeys as (keyof Property)[]
	);

	const handleEdit = async (id: string) => {
		try {
			const property = await getProperty(id);
			setEditData(property);
			setIsModalOpen(true);
		} catch {
			toast.error('Error fetching property data.');
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this property?'))
			return;
		try {
			await deleteProperty(id);
			toast.success('Property deleted successfully!');
			await fetchProperties(companyUuid);
		} catch {
			toast.error('Error deleting property.');
		}
	};

	if (isLoading) {
		return <LoadingSpinner message={'Loading properties...'} />;
	}
	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<div>
					<h1 className="text-2xl font-bold">Property List</h1>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
					<SearchInput
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder="Search properties..."
					/>
					<button
						onClick={() => {
							setEditData(undefined);
							setIsModalOpen(true);
						}}
						className="px-4 py-2 bg-green-600 text-white rounded w-full sm:w-auto">
						Add Property
					</button>
				</div>
			</div>
			<div className="bg-white shadow rounded-lg overflow-x-auto">
				<table className="min-w-full min-w-xl w-full border dark:border-none">
					<thead className="bg-gray-400">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-left text-slate-800">Address</th>
							<th className="px-4 py-2 text-left text-slate-800">Telephone</th>
							<th className="px-4 py-2 text-left text-slate-800">Email</th>
							<th className="px-4 py-2 text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredProperties.length > 0 ?
							filteredProperties.map((p) => (
								<tr key={p.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{p.name}</td>
									<td className="px-4 py-2 text-slate-800">
										{p.address1}
										{p.address2 && `, ${p.address2}`}
									</td>
									<td className="px-4 py-2 text-slate-800">{p.telephone}</td>
									<td className="px-4 py-2 text-slate-800">{p.managerEmail}</td>
									<td className="px-4 py-2 flex gap-2">
										<Button
											label="View"
											onClick={() => p.id && navigate(`/properties/${p.id}`)}
											className="px-2 py-1 bg-green-500 text-white rounded"
										/>
										<Button
											label="Edit"
											onClick={() => p.id && handleEdit(p.id)}
											className="px-2 py-1 bg-blue-500 text-white rounded"
										/>
										<Button
											label="Delete"
											onClick={() => p.id && handleDelete(p.id)}
											className="px-2 py-1 bg-red-500 text-white rounded"
										/>
									</td>
								</tr>
							))
						:	<tr className="border-t">
								<td
									colSpan={5}
									className="px-4 py-2 text-slate-800 justify-center text-center">
									No properties found
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
			<PropertyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={() => fetchProperties(companyUuid)}
				initialData={editData}
			/>
		</div>
	);
};

export default PropertyList;
