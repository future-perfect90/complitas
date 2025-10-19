import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import LoadingSpinner from '../components/Loading';
import PropertyModal from '../components/modals/PropertyModal';
import SearchInput from '../components/SearchInput';
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
					<h1 className="text-2xl text-[#212529] dark:text-[#F8F9FA] font-bold">
						Property List
					</h1>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:w-auto">
					<SearchInput
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder="Search properties..."
					/>
					<Button
						label="Add Property"
						onClick={() => {
							setEditData(undefined);
							setIsModalOpen(true);
						}}
						className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
						style="primary"
					/>
				</div>
			</div>
			{filteredProperties.length > 0 ?
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProperties.map((p) => (
						<Card key={p.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="text-xl font-bold">{p.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="mt-3">
									<p className="font-semibold text-[#212529] dark:text-[#F8F9FA]">
										Address
									</p>
									<p>
										{p.address1}
										{p.address2 && `, ${p.address2}`}
									</p>
								</div>
								<div>
									<p className="font-semibold text-[#212529] dark:text-[#F8F9FA]">
										Telephone
									</p>
									<p>{p.telephone}</p>
								</div>
								<div>
									<p className="font-semibold text-[#212529] dark:text-[#F8F9FA]">
										Email
									</p>
									<p className="break-words">{p.managerEmail}</p>
								</div>
							</CardContent>
							<div className="p-2 flex flex-wrap justify-end gap-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
								<Button
									label="View"
									onClick={() => p.id && navigate(`/properties/${p.id}`)}
									className="px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1"
									style="primary"
								/>
								<Button
									label="Edit"
									onClick={() => p.id && handleEdit(p.id)}
									className="px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1"
									style="secondary"
								/>
								<Button
									label="Delete"
									onClick={() => p.id && handleDelete(p.id)}
									className="px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1"
									style="tertiary"
								/>
							</div>
						</Card>
					))}
				</div>
			:	<div className="max-w-5xl mx-auto text-center">
					<p className="text-[#6C757D] dark:text-[#F8F9FA]">
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
