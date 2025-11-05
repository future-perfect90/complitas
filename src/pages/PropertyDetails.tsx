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
import { formatTimestampDateOnly } from '../utils/helper';

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

const isBasicInfoComplete = (property: Property) => {
	return (
		!!property.address1 &&
		!!property.city &&
		!!property.postCode &&
		!!property.county &&
		!!property.country &&
		!!property.designDate &&
		!!property.managerName &&
		!!property.managerEmail &&
		!!property.telephone &&
		!!property.uniqueReferenceNumber &&
		!!property.residentialAwareness &&
		!!property.habitableHeight &&
		!!property.buildingHeight &&
		!!property.occupancyType &&
		property.residentalFlats != null &&
		!!property.uniqueSupplyPoints &&
		property.commercialUnits != null
	);
};

const isAdditionalInfoComplete = (property: Property) => {
	return (
		property.lifts !== null &&
		property.carpark !== null &&
		property.timberFramed !== null &&
		property.communalUtilityAssets !== null &&
		property.communalGasAppliances !== null &&
		property.maintenanceRegime !== null &&
		property.refurbished !== null
	);
};

const isContactsComplete = (property: Property) => {
	return (
		!!property.managerName &&
		!!property.managerAddress &&
		!!property.managerEmail &&
		!!property.managerTelephone &&
		!!property.emergencyName &&
		!!property.emergencyAddress &&
		!!property.emergencyEmail &&
		!!property.emergencyTelephone &&
		!!property.localFireName &&
		!!property.localFireAddress &&
		!!property.localFireEmail &&
		!!property.localFireTelephone
	);
};

const isAuditDetailsComplete = (property: Property) => {
	return (
		property.logBook !== null &&
		property.fireSafetyLogBook !== null &&
		property.electronicAuditCompleted !== null &&
		property.epc !== null &&
		property.energyCertificates !== null &&
		property.oms !== null &&
		property.isolationValvesClear !== null &&
		property.accessControlled !== null
	);
};

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
					<h1 className="text-3xl font-bold text-[#212529] dark:text-[#F8F9FA]">
						{property.name}
					</h1>
					<p className="text-[#212529] dark:text-[#F8F9FA]">
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
									className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-[#212529] dark:text-[#F8F9FA] focus:outline-none 
                    ${selected ? 'bg-[#4D83AF] text-[#F8F9FA] shadow' : 'hover:bg-white/[0.12]'}`}>
									{tab.name}
								</button>
							)}
						</Tab>
					))}
				</TabList>
				<TabPanels className="mt-2">
					<TabPanel>
						<Card className="rounded-2xl shadow-lg">
							<CardHeader className="w-full flex flex-nowrap">
								<CardTitle className="font-semibold">
									Basic Information
									{isBasicInfoComplete(property) && (
										<span>
											<img
												src="/complitas_logo_without_text.png"
												alt="Icon"
												className="inline-block w-6 h-7 ml-3"
											/>
										</span>
									)}
									<Button
										label="Edit"
										onClick={() => onEdit('basic', property)}
										className="py-1 px-4 float-right"
										style="primary"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Address
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
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
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Commission Date/Refurbishment Date
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{formatTimestampDateOnly(property.designDate) ?? 'Not set'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Site contact
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.managerName}
										<br />
										{property.managerEmail}
										<br />
										{property.telephone}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Unique reference
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.uniqueReferenceNumber ?? 'Not set'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Residential Awareness
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.residentialAwareness ?? 'Not set'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Habitable height
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.habitableHeight ?? 'Not set'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Building height
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.buildingHeight ?? 'Not set'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Occupancy type
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.occupancyType ?? 'Not set'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Number of residential flats
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.residentalFlats ?? 'Not set'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Unique supply points
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.uniqueSupplyPoints ?? 'Not set'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Number of commercial units
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
										{property.commercialUnits ?? 'Not set'}
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
									{isAdditionalInfoComplete(property) && (
										<span>
											<img
												src="/complitas_logo_without_text.png"
												alt="Icon"
												className="inline-block w-6 h-7 ml-3"
											/>
										</span>
									)}
									<Button
										label="Edit"
										onClick={() => onEdit('additional', property)}
										className="py-1 px-4 flex-shrink-0 float-right"
										style="primary"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Lifts
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.lifts === null || '' ?
											'Not set'
										: property.lifts ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Basement Car park
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.carpark === null || '' ?
											'Not set'
										: property.carpark ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Timber framed building?
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.timberFramed === null || '' ?
											'Not set'
										: property.timberFramed ?
											'Yes'
										:	'No'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Communal Utility Assets
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.communalUtilityAssets === null || '' ?
											'Not set'
										: property.communalUtilityAssets ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Communal Gas Appliances
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.communalGasAppliances === null || '' ?
											'Not set'
										: property.communalGasAppliances ?
											'Yes'
										:	'No'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Maintenance Regime?
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.maintenanceRegime === null || '' ?
											'Not set'
										: property.maintenanceRegime ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Refurbished?
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
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
									{isContactsComplete(property) && (
										<span>
											<img
												src="/complitas_logo_without_text.png"
												alt="Icon"
												className="inline-block w-6 h-7 ml-3"
											/>
										</span>
									)}
									<Button
										label="Edit"
										onClick={() => onEdit('contacts', property)}
										className="py-1 px-4 flex-shrink-0 float-right"
										style="primary"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Property Manager
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
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
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Emergency contact
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
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
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Local Fire Service
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA] break-words">
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
									{isAuditDetailsComplete(property) && (
										<span>
											<img
												src="/complitas_logo_without_text.png"
												alt="Icon"
												className="inline-block w-6 h-7 ml-3"
											/>
										</span>
									)}
									<Button
										label="Edit"
										onClick={() => onEdit('audit', property)}
										className="py-1 px-4 flex-shrink-0 float-right"
										style="primary"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Log Book/CDM Folder
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.logBook === null || '' ?
											'Not set'
										: property.logBook ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Fire Safety Log Book
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.fireSafetyLogBook === null || '' ?
											'Not set'
										: property.fireSafetyLogBook ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Waste Electrical and Electronic Equipment Audit
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.electronicAuditCompleted === null || '' ?
											'Not set'
										: property.electronicAuditCompleted ?
											'Yes'
										:	'No'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										EPC
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.epc === null || '' ?
											'Not set'
										: property.epc ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Energy Certificates
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.energyCertificates === null || '' ?
											'Not set'
										: property.energyCertificates ?
											'Yes'
										:	'No'}
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										O&M's
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.oms === null || '' ?
											'Not set'
										: property.oms ?
											'Yes'
										:	'No'}
									</p>
								</div>
								<div className="space-y-4">
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										External Isolation Valve Chambers Located and Clear
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
										{property.isolationValvesClear === null || '' ?
											'Not set'
										: property.isolationValvesClear ?
											'Yes'
										:	'No'}
										<br />
									</p>
									<p className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
										Access Controlled Spaces
									</p>
									<p className="text-[#212529] dark:text-[#F8F9FA]">
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
										className="p-2 rounded float-right"
										style="primary"
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="overflow-x-auto">
									{maintenanceTasks && maintenanceTasks.length > 0 ?
										<table className="min-w-full w-full text-left">
											<thead className="border-b dark:border-gray-700">
												<tr>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA]">
														Title
													</th>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA]">
														Type of Work
													</th>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA]">
														Created at
													</th>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA]">
														Completed On
													</th>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA]">
														Completed By
													</th>
													<th className="px-3 py-2 text-sm font-semibold text-[#212529] dark:text-[#F8F9FA] text-right">
														Actions
													</th>
												</tr>
											</thead>
											<tbody>
												{maintenanceTasks.map((task) => (
													<tr
														key={task.id}
														className="border-b dark:border-gray-700">
														<td className="p-3 text-sm text-[#212529] dark:text-[#F8F9FA]">
															{task.title}
														</td>
														<td className="p-3 text-sm text-[#212529] dark:text-[#F8F9FA]">
															{task.typeOfWork}
														</td>
														<td className="p-3 text-sm text-[#212529] dark:text-[#F8F9FA]">
															{task.createdAt || '-'}
														</td>
														<td className="p-3 text-sm text-[#212529] dark:text-[#F8F9FA]">
															{task.completedAt || '-'}
														</td>
														<td className="p-3 text-sm text-[#212529] dark:text-[#F8F9FA]">
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
																	}
																	className="cursor-pointer">
																	<span className="cursor-pointer">
																		{task.name}
																	</span>
																</Tooltip>
															:	'-'}
														</td>
														<td className="p-3 text-right">
															{!task.completedAt && (
																<Button
																	label="Complete Task"
																	onClick={() => handleOpenCompleteTask(task)}
																	className="p-2"
																	style="primary"
																/>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									:	<p className="text-[#6C757D]">No maintenance tasks found.</p>
									}
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
