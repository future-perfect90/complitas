import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import type { Property } from '../types';

interface PropertyDetailsProps {
	property: Property;
	onEdit: (section: string, data: Property) => void;
}

export default function PropertyDetails({
	property,
	onEdit,
}: PropertyDetailsProps) {
	const navigate = useNavigate();
	return (
		<>
			<div className="flex items-center justify-left">
				<div className="flex-1 justify-left">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{property.name}
					</h1>
					<p className="text-gray-600">Manage your property information.</p>
				</div>
				<div className="items-center justify-right">
					<Button
						label="Compliance reports"
						onClick={() =>
							navigate(`/properties/${property.id}/compliance-reports`)
						}
						className="px-2 py-1 bg-purple-800 text-white rounded"
					/>
				</div>
			</div>
			{/* Basic Information Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						Basic Information
						<Button
							label="Edit"
							onClick={() => onEdit('basic', property)}
							className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
						/>
					</CardTitle>
				</CardHeader>
				<br />
				<CardContent className="space-y-2 flex">
					<div className="flex-1 justify-left">
						<p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.address1}
							<br />
							{property.address2 && (
								<>
									<span>{property.address2}</span>
									<br />
								</>
							)}
							{property.address3 && (
								<>
									<span>{property.address3}</span>
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
			{/* Additional Information Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						Additional Information
						<Button
							label="Edit"
							onClick={() => onEdit('additional', property)}
							className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
						/>
					</CardTitle>
				</CardHeader>
				<br />
				<CardContent className="space-y-2 flex">
					<div className="flex-1 justify-left">
						<p className="text-sm text-gray-500 dark:text-gray-400">Lifts</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.lifts ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Basement Car park
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.carpark ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Communal Utility Assets
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.communalUtilityAssets ? 'Yes' : 'No'}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Communal Gas Appliances
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.communalGasAppliances ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Meter bank
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.meterBank ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Assets in voids or boxing?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.voidAssets ? 'Yes' : 'No'}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Well maintained?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.wellMaintained ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Refurbished?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.refurbished ? 'Yes' : 'No'}
						</p>
					</div>
				</CardContent>
			</Card>
			{/* Additional Contacts Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						Additional contacts
						<Button
							label="Edit"
							onClick={() => onEdit('contacts', property)}
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
							{property.managerName}
							<br />
							{property.managerAddress}
							<br />
							{property.managerEmail}
							<br />
							{property.managerTelephone}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Emergency contact
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.emergencyName}
							<br />
							{property.emergencyAddress}
							<br />
							{property.emergencyEmail}
							<br />
							{property.emergencyTelephone}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Local Fire Service
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.localFireName}
							<br />
							{property.localFireAddress}
							<br />
							{property.localFireEmail}
							<br />
							{property.localFireTelephone}
						</p>
					</div>
				</CardContent>
			</Card>
			{/* Audit Details Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						Audit details
						<Button
							label="Edit"
							onClick={() => onEdit('audit', property)}
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
							{property.logBook ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Fire Safety Log Book
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.fireSafetyLogBook ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Waste Electrical and Electronic Equipment Audit
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.electronicAuditCompleted ? 'Yes' : 'No'}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">EPC</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.epc ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Energy Certificates (DEC's)
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.energyCertificates ? 'Yes' : 'No'}
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">O&M's</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.oms ? 'Yes' : 'No'}
						</p>
					</div>
					<div className="justify-center items-center flex-1">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							External Isolation Valve Chambers Located and Clear
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.isolationValvesClear ? 'Yes' : 'No'}
							<br />
						</p>
						<br />
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Access Controlled Spaces
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.accessControlled ? 'Yes' : 'No'}
							<br />
						</p>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
