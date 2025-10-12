import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Tooltip from '../components/Tooltip';
import MaintenanceTaskModal from '../components/modals/MaintenanceTaskModal';
import NotificationPreferencesModal from '../components/modals/NotificationPreferencesModal';
import type {
	MaintenanceTask,
	NotificationPreferences,
	Property,
} from '../types';

interface PropertyDetailsProps {
	property: Property;
	onEdit: (section: string, data: Property) => void;
	onDataUpdate: () => void;
	preferences: NotificationPreferences[];
	maintenanceTasks: MaintenanceTask[];
}

export default function PropertyDetails({
	property,
	onEdit,
	onDataUpdate,
	preferences,
	maintenanceTasks,
}: PropertyDetailsProps) {
	const [maintenanceTaskModalOpen, setIsMaintenanceTaskModalOpen] =
		useState(false);
	const [selectedTask, setSelectedTask] = useState<MaintenanceTask | undefined>(
		undefined
	);
	const [isCompletingTask, setIsCompletingTask] = useState(false);
	const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

	const navigate = useNavigate();

	const handleModalSuccess = useCallback(() => {
		setIsMaintenanceTaskModalOpen(false);
		if (isCompletingTask) {
			toast.success('Maintenance task completed successfully!');
		} else {
			toast.success('Maintenance task added successfully!');
		}
		onDataUpdate();
	}, [isCompletingTask, onDataUpdate]);

	const handleOpenCompleteTask = (task: MaintenanceTask) => {
		setSelectedTask(task);
		setIsCompletingTask(true);
		setIsMaintenanceTaskModalOpen(true);
	};

	const handleOpenAddTask = () => {
		setSelectedTask(undefined);
		setIsCompletingTask(false);
		setIsMaintenanceTaskModalOpen(true);
	};

	const handleNotificationSuccess = () => {
		setIsNotificationModalOpen(false);
		onDataUpdate();
	};

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{property.name}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage your property information.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2">
					<Button
						label="Compliance reports"
						onClick={() =>
							navigate(`/properties/${property.id}/compliance-reports`)
						}
						className="px-2 py-1 bg-purple-800 text-white rounded w-full sm:w-auto"
					/>
					<Button
						label="Add Maintenance Task"
						onClick={handleOpenAddTask}
						className="px-2 py-1 ml-2 bg-purple-800 text-white rounded"
					/>
				</div>
			</div>
			{/* Basic Information Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader className="w-full flex-nowrap gap-4 items-center">
					<CardTitle className="text-xl font-semibold flex-1">
						Basic Information
					</CardTitle>
					<Button
						label="Edit"
						onClick={() => onEdit('basic', property)}
						className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0"
					/>
				</CardHeader>
				<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
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
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Design Date
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.designDate ?? 'Not set'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Site contact
						</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
							{property.managerName}
							<br />
							{property.managerEmail}
							<br />
							{property.telephone}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Unique Reference Number
						</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
							{property.uniqueReferenceNumber ?? 'Not set'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Residential Awareness
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.residentialAwareness ?? 'Not set'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Habitable Height
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.habitableHeight ?? 'Not set'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Building Height
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.buildingHeight ?? 'Not set'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Occupancy Type
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.occupancyType ?? 'Not set'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Number of Residential Flats
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.residentalFlats ?? 'Not set'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Unique Supply Points
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.uniqueSupplyPoints ?? 'Not set'}
						</p>
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
				<CardHeader className="w-full flex justify-between items-center flex-nowrap gap-4">
					<CardTitle className="text-xl font-semibold">
						Additional Information
					</CardTitle>
					<Button
						label="Edit"
						onClick={() => onEdit('additional', property)}
						className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0"
					/>
				</CardHeader>
				<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">Lifts</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.lifts === null || '' ?
								'Not set'
							: property.lifts ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Basement Car park
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.carpark === null || '' ?
								'Not set'
							: property.carpark ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Communal Utility Assets
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.communalUtilityAssets === null || '' ?
								'Not set'
							: property.communalUtilityAssets ?
								'Yes'
							:	'No'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Communal Gas Appliances
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.communalGasAppliances === null || '' ?
								'Not set'
							: property.communalGasAppliances ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Meter bank
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.meterBank === null || '' ?
								'Not set'
							: property.meterBank ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Assets in voids or boxing?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.voidAssets === null || '' ?
								'Not set'
							: property.voidAssets ?
								'Yes'
							:	'No'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Well maintained?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.wellMaintained === null || '' ?
								'Not set'
							: property.wellMaintained ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Refurbished?
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.refurbished === null || '' ?
								'Not set'
							: property.refurbished ?
								'Yes'
							:	'No'}
						</p>
					</div>
				</CardContent>
			</Card>
			{/* Additional Contacts Card */}
			<Card className="rounded-2xl shadow-lg">
				<CardHeader className="w-full flex justify-between items-center flex-nowrap gap-4">
					<CardTitle className="text-xl font-semibold">
						Additional contacts
					</CardTitle>
					<Button
						label="Edit"
						onClick={() => onEdit('contacts', property)}
						className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0"
					/>
				</CardHeader>
				<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Property Manager
						</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
							{property.managerName}
							<br />
							{property.managerAddress}
							<br />
							{property.managerEmail}
							<br />
							{property.managerTelephone}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Emergency contact
						</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
							{property.emergencyName}
							<br />
							{property.emergencyAddress}
							<br />
							{property.emergencyEmail}
							<br />
							{property.emergencyTelephone}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Local Fire Service
						</p>
						<p className="text-gray-900 dark:text-gray-100 break-words">
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
				<CardHeader className="w-full flex justify-between items-center flex-nowrap gap-4">
					<CardTitle className="text-xl font-semibold">Audit details</CardTitle>
					<Button
						label="Edit"
						onClick={() => onEdit('audit', property)}
						className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0"
					/>
				</CardHeader>
				<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Log Book/CDM Folder
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.logBook === null || '' ?
								'Not set'
							: property.logBook ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Fire Safety Log Book
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.fireSafetyLogBook === null || '' ?
								'Not set'
							: property.fireSafetyLogBook ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Waste Electrical and Electronic Equipment Audit
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.electronicAuditCompleted === null || '' ?
								'Not set'
							: property.electronicAuditCompleted ?
								'Yes'
							:	'No'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">EPC</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.epc === null || '' ?
								'Not set'
							: property.epc ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Energy Certificates (DEC's)
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.energyCertificates === null || '' ?
								'Not set'
							: property.energyCertificates ?
								'Yes'
							:	'No'}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">O&M's</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.oms === null || '' ?
								'Not set'
							: property.oms ?
								'Yes'
							:	'No'}
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							External Isolation Valve Chambers Located and Clear
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.isolationValvesClear === null || '' ?
								'Not set'
							: property.isolationValvesClear ?
								'Yes'
							:	'No'}
							<br />
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Access Controlled Spaces
						</p>
						<p className="text-gray-900 dark:text-gray-100">
							{property.accessControlled === null || '' ?
								'Not set'
							: property.accessControlled ?
								'Yes'
							:	'No'}
							<br />
						</p>
					</div>
				</CardContent>
			</Card>
			<Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">Maintenance</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="overflow-x-auto">
						{maintenanceTasks && maintenanceTasks.length > 0 ?
							<table className="min-w-full w-full text-left">
								<thead className="border-b dark:border-gray-700">
									<tr>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Title
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Type of Work
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Created at
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Completed On
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Completed By
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{maintenanceTasks.map((task) => (
										<tr key={task.id} className="border-b dark:border-gray-700">
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{task.title}
											</td>
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{task.typeOfWork}
											</td>
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{task.createdAt || '-'}
											</td>
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{task.completedAt || '-'}
											</td>
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{task.name ?
													<Tooltip
														content={
															<div className="space-y-1">
																<p>
																	<strong>Contact:</strong> {task.contactName}
																</p>
																<p>
																	<strong>Address:</strong>{' '}
																	{task.contactAddress}
																</p>
																<p>
																	<strong>Phone:</strong> {task.contactNumber}
																</p>
															</div>
														}>
														<span className="cursor-pointer">{task.name}</span>
													</Tooltip>
												:	'-'}
											</td>
											<td className="px-3 py-3 text-right">
												{!task.completedAt && (
													<Button
														label="Complete Task"
														onClick={() => handleOpenCompleteTask(task)}
														className="bg-green-500 text-white px-3 py-1 rounded"
													/>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						:	<p className="text-gray-500">No maintenance tasks found.</p>}
					</div>
				</CardContent>
			</Card>
			{/* <Card className="rounded-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						Notification Preferences
						<Button
							label="Edit"
							onClick={() => setIsNotificationModalOpen(true)}
							className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
						/>
					</CardTitle>
				</CardHeader>
				<br />
				<CardContent className="space-y-2 flex">
					<div className="w-full overflow-x-auto">
						{preferences && preferences.length > 0 ?
							<table className="min-w-full w-full text-left">
								<thead className="border-b dark:border-gray-700">
									<tr>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Days from expiry
										</th>
										<th className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
											Active?
										</th>
									</tr>
								</thead>
								<tbody>
									{preferences.map((preference: NotificationPreferences) => (
										<tr
											key={preference.id}
											className="border-b dark:border-gray-700">
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{preference.daysBeforeExpiry}
											</td>
											<td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
												{preference.isActive ? 'Yes' : 'No'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						:	<p className="text-gray-500">No notificaiton preferences found.</p>
						}
					</div>
				</CardContent>
			</Card> */}
			<MaintenanceTaskModal
				isOpen={maintenanceTaskModalOpen}
				onClose={() => setIsMaintenanceTaskModalOpen(false)}
				onSuccess={handleModalSuccess}
				propertyId={property.id}
				initialData={selectedTask}
				completed={isCompletingTask}
			/>
			<NotificationPreferencesModal
				isOpen={isNotificationModalOpen}
				onClose={() => setIsNotificationModalOpen(false)}
				onSuccess={handleNotificationSuccess}
				propertyId={property.id || ''}
				currentPreferences={preferences}
			/>
		</>
	);
}
