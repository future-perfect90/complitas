import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/modals/Loading';
import PropertyModal from '../components/modals/PropertyModal';
import { useAuthMeta } from '../context/AuthProvider';
import { useSearch } from '../hooks/useSearch';
import type { Property } from '../types';
import { deleteProperty, getProperties, getProperty } from '../utils/api';

const PropertyList: React.FC = () => {
	const [properties, setProperties] = useState<Property[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [editData, setEditData] = useState<Property | undefined>(undefined);
	const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const isLoading = authMeta?.isLoading;
	const navigate = useNavigate();

	const fetchProperties = useCallback(async (companyUuid: string) => {
		try {
			setIsPropertiesLoading(true);
			const data = await getProperties(companyUuid);
			setProperties(data);
		} catch {
			toast.error('Failed to load properties.');
		} finally {
			setIsPropertiesLoading(false);
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

	if (isLoading || isPropertiesLoading) {
		return <LoadingSpinner message={'Loading properties...'} />;
	}
	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<div>
					<h1 className="text-2xl font-bold">Property List</h1>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:w-auto">
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
			{filteredProperties.length > 0 ?
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProperties.map((p) => (
						<Card
							key={p.id}
							className="rounded-xl shadow-lg flex flex-col justify-between">
							<CardHeader>
								<CardTitle className="text-xl font-bold">{p.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="mt-3">
									<p className="font-semibold text-gray-600 dark:text-gray-400">
										Address
									</p>
									<p>
										{p.address1}
										{p.address2 && `, ${p.address2}`}
									</p>
								</div>
								<div>
									<p className="font-semibold text-gray-600 dark:text-gray-400">
										Telephone
									</p>
									<p>{p.telephone}</p>
								</div>
								<div>
									<p className="font-semibold text-gray-600 dark:text-gray-400">
										Email
									</p>
									<p className="break-words">{p.managerEmail}</p>
								</div>
							</CardContent>
							<div className="p-4 flex flex-wrap justify-end gap-2 border-t border-gray-200 dark:border-gray-700 mt-4">
								<Button
									label="View"
									onClick={() => p.id && navigate(`/properties/${p.id}`)}
									className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
								/>
								<Button
									label="Edit"
									onClick={() => p.id && handleEdit(p.id)}
									className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
								/>
								<Button
									label="Delete"
									onClick={() => p.id && handleDelete(p.id)}
									className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
								/>
							</div>
						</Card>
					))}
				</div>
			:	<div className="max-w-5xl mx-auto text-center py-16">
					<p className="text-gray-500 dark:text-gray-400">
						No properties found.
					</p>
				</div>
			}
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
