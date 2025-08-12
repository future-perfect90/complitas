import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropertyModal from '../components/PropertyModal';
import type { Property } from '../types';
import { deleteProperty, getProperties, getProperty } from '../utils/api';

const PropertyList: React.FC = () => {
	const [properties, setProperties] = useState<Property[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState<Property | undefined>(undefined);

	const fetchProperties = async () => {
		try {
			//TODO::GET THIS FROM THE USERS LOGGED IN TOKEN
			const companyId = '156659f4-77b3-11f0-910a-6a02ccf97a78'; //first port
			// const companyId = 'e81e211c-77bb-11f0-910a-6a02ccf97a78'; //metropolitan

			const data = await getProperties(companyId);
			console.log(data);
			setProperties(data);
		} catch {
			console.log('Failed to load properties.');
		}
	};

	useEffect(() => {
		fetchProperties();
		console.log(properties);
	}, []);

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
			fetchProperties();
		} catch {
			toast.error('Error deleting property.');
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Property List</h1>

				<button
					onClick={() => {
						setEditData(undefined);
						setIsModalOpen(true);
					}}
					className="px-4 py-2 bg-green-600 text-white rounded">
					Add Property
				</button>
			</div>
			<div className="bg-white shadow rounded overflow-hidden">
				<table className="min-w-full min-w-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-slate-800">Name</th>
							<th className="px-4 py-2 text-left text-slate-800">Address</th>
							<th className="px-4 py-2 text-left text-slate-800">Telephone</th>
							<th className="px-4 py-2 text-left text-slate-800">Email</th>
							<th className="px-4 py-2 text-slate-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{properties && properties.length > 0 ?
							properties.map((p) => (
								<tr key={p.id} className="border-t">
									<td className="px-4 py-2 text-slate-800">{p.name}</td>
									<td className="px-4 py-2 text-slate-800">
										{p.address1}
										{p.address2 && `, ${p.address2}`}
									</td>
									<td className="px-4 py-2 text-slate-800">{p.telephone}</td>
									<td className="px-4 py-2 text-slate-800">{p.email}</td>
									<td className="px-4 py-2 flex gap-2">
										<button
											onClick={() => p.id && handleEdit(p.id)}
											className="px-2 py-1 bg-blue-500 text-white rounded">
											Edit
										</button>
										<button
											onClick={() => p.id && handleDelete(p.id)}
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
				onSuccess={fetchProperties}
				initialData={editData}
			/>
		</div>
	);
};

export default PropertyList;
