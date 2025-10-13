import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Fragment, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { ComplianceAuditList } from '../components/ComplianceAuditList';
import Tooltip from '../components/Tooltip';
import MaintenanceTaskModal from '../components/modals/MaintenanceTaskModal';
import NotificationPreferencesModal from '../components/modals/NotificationPreferencesModal';
import type {
	MaintenanceTask,
	NotificationPreferences,
	Property,
} from '../types';

const tabs = [
	{ name: 'Overview' },
	{ name: 'Details' },
	{ name: 'Maintenance' },
	{ name: 'Compliance' },
];

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
			</div>

			<TabGroup>
				<TabList className="flex space-x-1 rounded-xl bg-gray-700/20 p-1">
					{tabs.map((tab) => (
						<Tab key={tab.name} as={Fragment}>
							{({ selected }) => (
								<button
									className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-200 focus:outline-none focus:ring-2
                    ${selected ? 'bg-[rgb(77,131,175)] shadow' : 'hover:bg-white/[0.12]'}`}>
									{tab.name}
								</button>
							)}
						</Tab>
					))}
				</TabList>
				<TabPanels className="mt-2">
					<TabPanel>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="w-full flex flex-nowrap gap-4">
								<CardTitle className="text-xl font-semibold">
									Basic Information
									<Button
										label="Edit"
										onClick={() => onEdit('basic', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0 float-right"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Address
									</p>
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
								</div>
								<div className="space-y-4">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Design Date
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.designDate ?? 'Not set'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Unique Reference Number
									</p>
									<p className="text-gray-900 dark:text-gray-100 break-words">
										{property.uniqueReferenceNumber ?? 'Not set'}
									</p>
								</div>
							</CardContent>
						</Card>
					</TabPanel>
					<TabPanel className="space-y-8">
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="w-full flex flex-nowrap gap-4">
								<CardTitle className="text-xl font-semibold">
									Additional Information
									<Button
										label="Edit"
										onClick={() => onEdit('additional', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0 float-right"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Lifts
									</p>
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
								</div>
								<div className="space-y-4">
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
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="w-full flex flex-nowrap gap-4">
								<CardTitle className="text-xl font-semibold">
									Additional contacts
									<Button
										label="Edit"
										onClick={() => onEdit('contacts', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0 float-right"
									/>
								</CardTitle>
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
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="w-full flex flex-nowrap gap-4">
								<CardTitle className="text-xl font-semibold">
									Audit details
									<Button
										label="Edit"
										onClick={() => onEdit('audit', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded flex-shrink-0 float-right"
									/>
								</CardTitle>
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
									<p className="text-sm text-gray-500 dark:text-gray-400">
										EPC
									</p>
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
									<p className="text-sm text-gray-500 dark:text-gray-400">
										O&M's
									</p>
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
					</TabPanel>
					<TabPanel>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="flex">
								<CardTitle className="text-xl font-semibold">
									Maintenance
									<Button
										label="Add Maintenance Task"
										onClick={handleOpenAddTask}
										className="px-2 py-1 bg-purple-800 text-white rounded float-right"
									/>
								</CardTitle>
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
													<tr
														key={task.id}
														className="border-b dark:border-gray-700">
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
																				<strong>Contact:</strong>{' '}
																				{task.contactName}
																			</p>
																			<p>
																				<strong>Address:</strong>{' '}
																				{task.contactAddress}
																			</p>
																			<p>
																				<strong>Phone:</strong>{' '}
																				{task.contactNumber}
																			</p>
																		</div>
																	}>
																	<span className="cursor-pointer">
																		{task.name}
																	</span>
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
					</TabPanel>
					<TabPanel>
						<ComplianceAuditList />
					</TabPanel>
				</TabPanels>
			</TabGroup>

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
