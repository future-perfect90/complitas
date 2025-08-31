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
				{/* Property Details Section */}
				{property ?
					<>
						<div className="flex items-center gap-6">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
									{property.name}
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									Manage your property information.
								</p>
							</div>
						</div>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Basic Information
									<Button
										label="Edit"
										onClick={() => {}}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
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
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Design Date
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.designDate ?? 'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Site contact
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.managerName}
										<br />
										{property.email}
										<br />
										{property.telephone}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Unique Reference Number
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.uniqueReferenceNumber ?? 'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Residential Awareness
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.residentialAwareness ?? 'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Habitable Height
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.habitableHeight ?? 'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Building Height
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.buildingHeight ?? 'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Occupancy Type
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.occupancyType ?? 'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Number of Residential Flats
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.residentalFlats ?? 'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Unique Supply Points
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.uniqueSupplyPoints ?? 'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Number of Commercial Units
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.commercialUnits ?? 'Not set'}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Additional Information
									<Button
										label="Edit"
										onClick={() => {}}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Lifts
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.lifts === true ?
											'Yes'
										: property.lifts === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Basement Car park
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.carpark === true ?
											'Yes'
										: property.carpark === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Communal Utility Assets
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.communalUtilityAssets === true ?
											'Yes'
										: property.communalUtilityAssets === false ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Communal Gas Appliances
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.communalGasAppliances === true ?
											'Yes'
										: property.communalGasAppliances === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Meter bank
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.meterBank === true ?
											'Yes'
										: property.meterBank === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Assets in voids or boxing?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.voidAssets === true ?
											'Yes'
										: property.voidAssets === false ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Well maintained?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.wellMaintained === true ?
											'Yes'
										: property.wellMaintained === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Refurbished?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.refurbished === true ?
											'Yes'
										: property.refurbished === false ?
											'No'
										:	'Not set'}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Additional contacts
									<Button
										label="Edit"
										onClick={() => {}}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Property Manager
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
										Emergency contact
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
										Local Fire Service
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.managerName}
										<br />
										{property.email}
										<br />
										{property.telephone}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Audit details
									<Button
										label="Edit"
										onClick={() => {}}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Log Book/CDM Folder
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.logBook === true ?
											'Yes'
										: property.logBook === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Fire Safety Log Book
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.fireSafetyLogBook === true ?
											'Yes'
										: property.fireSafetyLogBook === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Waste Electrical and Electronic Equipment Audit
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.electronicAuditCompleted === true ?
											'Yes'
										: property.electronicAuditCompleted === false ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										EPC
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.epc === true ?
											'Yes'
										: property.epc === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Energy Certificates (DEC's)
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.energyCertificates === true ?
											'Yes'
										: property.energyCertificates === false ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										O&M's
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property['o&m'] === true ?
											'Yes'
										: property['o&m'] === false ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										External Isolation Valve Chambers Located and Clear
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.isolationValvesClear === true ?
											'Yes'
										: property.isolationValvesClear === false ?
											'No'
										:	'Not set'}
										<br />
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Access Controlled Spaces
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.accessControlled === true ?
											'Yes'
										: property.accessControlled === false ?
											'No'
										:	'Not set'}
										<br />
									</p>
								</div>
							</CardContent>
						</Card>
					</>
				:	<h2 className="text-gray-500 dark:text-gray-400">No property data.</h2>
				}
			</div>
		</div>
	);
}
