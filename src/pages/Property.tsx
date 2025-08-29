import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import type { Property } from '../types';
import { getProperty } from '../utils/api';

export default function Property() {
	const { isAuthenticated } = useAuth0();
	const [property, setProperty] = useState<Property>();
	const { id } = useParams();
	useEffect(() => {
		const fetchProperty = async () => {
			try {
				const data = await getProperty(id ?? '');
				setProperty(data);
			} catch (error) {
				console.error('Error fetching property:', error);
			}
		};

		if (isAuthenticated) {
			fetchProperty();
		}
	}, [isAuthenticated]);

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Page Header */}
				<div className="flex items-center gap-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							My Property
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Manage your property information.
						</p>
					</div>
				</div>

				{/* Property Details Section */}
				{property ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								{property.name}
							</CardTitle>
						</CardHeader>
						<br />
						<CardContent className="space-y-2 flex">
							<div className="flex-1 justify-left">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Address
								</p>
								<p className="text-gray-900 dark:text-gray-100">
									{property.address1}
									<br />
									{property.address2 && (
										<>
											, {property.address2}
											<br />
										</>
									)}
									{property.address3 && (
										<>
											, {property.address3}
											<br />
										</>
									)}
									{property.city}
									<br />
									{property.postCode}
									<br />
									{property.county}
									<br />
									{property.country}
								</p>
							</div>
							<div className="justify-center items-center flex-1">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Contact Information
								</p>
								<p className="text-gray-900 dark:text-gray-100">
									{property.managerName}
									<br />
									{property.email}
									<br />
									{property.telephone}
								</p>
							</div>
							<div className="justify-center items-center flex-1">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Actions
								</p>
								<p className="text-gray-900 dark:text-gray-100">
									<Button
										label="New report"
										onClick={() => {}}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
									/>
								</p>
							</div>
						</CardContent>
					</Card>
				:	<p className="text-gray-500 dark:text-gray-400">No property data.</p>}
			</div>
		</div>
	);
}
