import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthMeta } from '../../context/AuthProvider';
import type { Property } from '../../types';
import { getPropertiesCompletion } from '../../utils/api';
import LoadingSpinner from '../Loading';

interface PropertyWithCompletion extends Property {
	propertyDetailsCompletion: number;
	complianceCompletion: number;
}

const AssignedPropertiesWidget: React.FC = () => {
	const [properties, setProperties] = useState<PropertyWithCompletion[]>([]);
	const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
	const authMeta = useAuthMeta();
	const companyUuid = authMeta?.companyUuid || '';
	const userUuid = authMeta?.userUuid || '';
	const isLoading = authMeta?.isLoading;
	const navigate = useNavigate();
	const headers = [
		{ key: 'name', label: 'Property' },
		{ key: 'propertyDetailsCompletion', label: 'Property Completion %' },
		{ key: 'complianceCompletion', label: 'Compliance Completion %' },
	];

	const fetchProperties = useCallback(
		async (companyUuid: string, userUuid: string) => {
			try {
				setIsPropertiesLoading(true);
				const data = await getPropertiesCompletion(companyUuid, userUuid);
				console.log(data);
				setProperties(data);
			} catch {
				console.log('Failed to load properties.');
			} finally {
				setIsPropertiesLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		if (!isLoading && companyUuid && userUuid) {
			fetchProperties(companyUuid, userUuid);
		}
	}, [companyUuid, userUuid, isLoading, fetchProperties]);

	if (isLoading || isPropertiesLoading) {
		return <LoadingSpinner message={'Loading properties...'} />;
	}

	const hasData = properties && properties.length > 0;

	return (
		<div className="font-sans bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950/50 p-6 flex flex-col">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				My Properties
			</h3>
			<div className="flex-1 overflow-hidden flex flex-col">
				{!hasData ?
					<div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 italic">
						<p>No properties currently assigned.</p>
					</div>
				:	<div className="flex-1 overflow-y-auto">
						<table className="w-full border-collapse">
							<thead className="sticky top-0 bg-white dark:bg-gray-800">
								<tr>
									{headers.map((header) => (
										<th
											key={header.key}
											className="p-3 pt-0 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											{header.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{properties.map((property) => (
									<tr
										key={property.id}
										onClick={() => navigate(`/properties/${property.id}`)}
										className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer`}>
										<td
											className={`p-3 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200`}>
											{property.name}
										</td>
										<td
											className={`p-3 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200`}>
											{property.propertyDetailsCompletion.toFixed(2)}%{' '}
											{property.propertyDetailsCompletion === 100 && (
												<span>
													<img
														src="/complitas_logo_without_text.png"
														alt="Icon"
														className="inline-block w-6 h-7 ml-3"
													/>
												</span>
											)}
										</td>
										<td
											className={`p-3 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200`}>
											{property.complianceCompletion.toFixed(2)}%{' '}
											{property.complianceCompletion === 100 && (
												<span>
													<img
														src="/complitas_logo_without_text.png"
														alt="Icon"
														className="inline-block w-6 h-7 ml-3"
													/>
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				}
			</div>
		</div>
	);
};

export default AssignedPropertiesWidget;
