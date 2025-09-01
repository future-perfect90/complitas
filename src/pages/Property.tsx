import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import FileUpload from '../components/FileUpload';
import Label from '../components/Label';
import Modal from '../components/Modal';
import TextField from '../components/TextField';
import type { Property } from '../types';
import { getProperty, updatePropertySection } from '../utils/api';

export default function Property() {
	const { isAuthenticated } = useAuth0();
	const [property, setProperty] = useState<Property>();
	const { id } = useParams();
	const [editingSection, setEditingSection] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalInitial, setModalInitial] = useState<any>({});

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

	// Modal open handler
	const handleEdit = (section: string, initial: any) => {
		setEditingSection(section);
		setModalInitial(initial);
		setModalOpen(true);
	};
	// Modal close handler
	const handleClose = () => {
		setModalOpen(false);
		setEditingSection(null);
	};
	// Modal save handler: call updatePropertySection API
	const handleSave = async (updated: any) => {
		if (!id || !editingSection) return;
		try {
			await updatePropertySection(id, updated);
			setProperty((prev) => ({ ...prev, ...updated }) as Property);
		} catch (err) {
			// Optionally show error to user
			console.error('Failed to update property section', err);
		}
		setModalOpen(false);
		setEditingSection(null);
	};

	// Modal component
	function EditPropertyModal({
		open,
		section,
		initial,
		onClose,
		onSave,
	}: {
		open: boolean;
		section: string;
		initial: any;
		onClose: () => void;
		onSave: (data: any) => void;
	}) {
		const [form, setForm] = useState<any>(initial);
		// For file uploads (wellMaintained and refurbished)
		const [fileUploads, setFileUploads] = useState<{
			[key: string]: string | null;
		}>({});

		// Field render helpers
		const renderField = (key: string, label: string, type: string) => {
			if (type === 'text' || type === 'number') {
				return (
					<div className="mb-4">
						<TextField
							label={label}
							value={form[key]}
							onChange={(e) =>
								setForm({
									...form,
									[key]:
										type === 'number' ? Number(e.target.value) : e.target.value,
								})
							}
						/>
					</div>
				);
			}
			if (type === 'date') {
				return (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1 text-gray-900">
							{label}
						</label>
						<input
							type="date"
							value={form[key] ? String(form[key]).slice(0, 10) : ''}
							onChange={(e) => setForm({ ...form, [key]: e.target.value })}
							className="w-full border rounded px-2 py-1 text-gray-900"
						/>
					</div>
				);
			}
			if (type === 'boolean') {
				return (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1 text-gray-900">
							{label}
						</label>
						<div className="flex gap-4">
							<label>
								<input
									type="radio"
									checked={form[key] === true || form[key] === 1}
									onChange={() => setForm({ ...form, [key]: true })}
								/>{' '}
								<span className="text-gray-900">Yes</span>
							</label>
							<label>
								<input
									type="radio"
									checked={form[key] === false || form[key] === 0}
									onChange={() => setForm({ ...form, [key]: false })}
								/>{' '}
								<span className="text-gray-900">No</span>
							</label>
						</div>
					</div>
				);
			}
			if (type === 'residentialAwareness') {
				const residentialOptions = [
					{ value: 'Two Man visits', label: 'Two Man visits' },
					{ value: 'Vulnerable Persons', label: 'Vulnerable Persons' },
					{ value: 'Priority Services', label: 'Priority Services' },
					{ value: 'Medial/EOL care', label: 'Medial/EOL care' },
				];
				return (
					<div className="mb-4">
						<Label label="Residential Awareness" />
						<select
							value={form[key] ?? ''}
							onChange={(e) => setForm({ ...form, [key]: e.target.value })}
							className="w-full border rounded px-2 py-1 text-gray-900">
							<option value="">Select Residential Awareness</option>
							{residentialOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				);
			}
			if (type === 'occupancyType') {
				const occupancyOptions = [
					{ value: 'Residential', label: 'Residential' },
					{ value: 'Commercial', label: 'Commercial' },
					{ value: 'Mixed Use', label: 'Mixed Use' },
				];
				return (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1 text-gray-900">
							Occupancy Type
						</label>
						<select
							value={form[key] ?? ''}
							onChange={(e) => setForm({ ...form, [key]: e.target.value })}
							className="w-full border rounded px-2 py-1 text-gray-900">
							<option value="">Select Occupancy Type</option>
							{occupancyOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				);
			}
			return null;
		};

		let fields: Array<{ key: string; label: string; type: string }>;
		if (section === 'basic') {
			fields = [
				{ key: 'name', label: 'Name', type: 'text' },
				{ key: 'address1', label: 'Address 1', type: 'text' },
				{ key: 'address2', label: 'Address 2', type: 'text' },
				{ key: 'address3', label: 'Address 3', type: 'text' },
				{ key: 'city', label: 'City', type: 'text' },
				{ key: 'postCode', label: 'Post Code', type: 'text' },
				{ key: 'county', label: 'County', type: 'text' },
				{ key: 'country', label: 'Country', type: 'text' },
				{ key: 'designDate', label: 'Design Date', type: 'date' },
				{ key: 'managerName', label: 'Site Contact Name', type: 'text' },
				{ key: 'email', label: 'Site Contact Email', type: 'text' },
				{ key: 'telephone', label: 'Site Contact Telephone', type: 'text' },
				{
					key: 'uniqueReferenceNumber',
					label: 'Unique Reference Number',
					type: 'text',
				},
				{
					key: 'residentialAwareness',
					label: 'Residential Awareness',
					type: 'residentialAwareness',
				},
				{ key: 'habitableHeight', label: 'Habitable Height', type: 'number' },
				{ key: 'buildingHeight', label: 'Building Height', type: 'number' },
				{
					key: 'occupancyType',
					label: 'Occupancy Type',
					type: 'occupancyType',
				},
				{
					key: 'residentalFlats',
					label: 'Number of Residential Flats',
					type: 'number',
				},
				{
					key: 'uniqueSupplyPoints',
					label: 'Unique Supply Points',
					type: 'number',
				},
				{
					key: 'commercialUnits',
					label: 'Number of Commercial Units',
					type: 'number',
				},
			];
		} else if (section === 'additional') {
			fields = [
				{ key: 'lifts', label: 'Lifts', type: 'boolean' },
				{ key: 'carpark', label: 'Basement Car park', type: 'boolean' },
				{
					key: 'communalUtilityAssets',
					label: 'Communal Utility Assets',
					type: 'boolean',
				},
				{
					key: 'communalGasAppliances',
					label: 'Communal Gas Appliances',
					type: 'boolean',
				},
				{ key: 'meterBank', label: 'Meter bank', type: 'boolean' },
				{
					key: 'voidAssets',
					label: 'Assets in voids or boxing?',
					type: 'boolean',
				},
				{ key: 'wellMaintained', label: 'Well maintained?', type: 'boolean' },
				{ key: 'refurbished', label: 'Refurbished?', type: 'boolean' },
			];
		} else if (section === 'contacts') {
			fields = [
				{ key: 'managerName', label: 'Property Manager', type: 'text' },
				{ key: 'email', label: 'Email', type: 'text' },
				{ key: 'telephone', label: 'Telephone', type: 'text' },
			];
		} else if (section === 'audit') {
			fields = [
				{ key: 'logBook', label: 'Log Book/CDM Folder', type: 'boolean' },
				{
					key: 'fireSafetyLogBook',
					label: 'Fire Safety Log Book',
					type: 'boolean',
				},
				{
					key: 'electronicAuditCompleted',
					label: 'Waste Electrical and Electronic Equipment Audit',
					type: 'boolean',
				},
				{ key: 'epc', label: 'EPC', type: 'boolean' },
				{
					key: 'energyCertificates',
					label: "Energy Certificates (DEC's)",
					type: 'boolean',
				},
				{ key: 'oms', label: "O&M's", type: 'boolean' },
				{
					key: 'isolationValvesClear',
					label: 'External Isolation Valve Chambers Located and Clear',
					type: 'boolean',
				},
				{
					key: 'accessControlled',
					label: 'Access Controlled Spaces',
					type: 'boolean',
				},
			];
		} else {
			fields = [];
		}

		// Show FileUpload for each: wellMaintained and refurbished if true
		const showWellMaintainedUpload =
			(form['wellMaintained'] === true || form['wellMaintained'] === 1) &&
			section === 'additional';
		const showRefurbishedUpload =
			(form['refurbished'] === true || form['refurbished'] === 1) &&
			section === 'additional';

		return (
			<Modal isOpen={open} onClose={onClose}>
				<div className="p-6 bg-white rounded-xl max-w-lg w-full">
					<h2 className="text-xl font-bold mb-4 dark:text-gray-900">
						Edit {section.charAt(0).toUpperCase() + section.slice(1)} Section
					</h2>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							// Add uploaded file URLs to form before saving
							let updatedForm = { ...form };
							if (showWellMaintainedUpload && fileUploads['wellMaintained']) {
								updatedForm['mitigationPlan'] = fileUploads['wellMaintained'];
							}
							if (showRefurbishedUpload && fileUploads['refurbished']) {
								updatedForm['refurbishedCDM'] = fileUploads['refurbished'];
							}
							onSave(updatedForm);
						}}>
						{fields.map((f) => renderField(f.key, f.label, f.type))}
						{showWellMaintainedUpload && (
							<div className="mb-4">
								<FileUpload
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									accept="*/*"
									onUploadComplete={(url) =>
										setFileUploads((prev) => ({ ...prev, wellMaintained: url }))
									}
									directory={`property/wellMaintained/`}
									label="Upload Well Maintained Document"
								/>
								{fileUploads['wellMaintained'] && (
									<p className="text-green-600 text-xs mt-1">File uploaded!</p>
								)}
							</div>
						)}
						{showRefurbishedUpload && (
							<div className="mb-4">
								<FileUpload
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									accept="*/*"
									onUploadComplete={(url) =>
										setFileUploads((prev) => ({ ...prev, refurbished: url }))
									}
									directory={`property/refurbished/`}
									label="Upload Refurbished Document"
								/>
								{fileUploads['refurbished'] && (
									<p className="text-green-600 text-xs mt-1">File uploaded!</p>
								)}
							</div>
						)}
						<div className="flex gap-2 mt-6">
							<Button
								label="Cancel"
								onClick={onClose}
								className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
							/>
							<Button
								label="Save"
								className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
							/>
						</div>
					</form>
				</div>
			</Modal>
		);
	}

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
						{/* Basic Information Card */}
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Basic Information
									<Button
										label="Edit"
										onClick={() => handleEdit('basic', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								{/* ...existing code for displaying fields... */}
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Address
									</p>
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
										onClick={() => handleEdit('additional', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								{/* ...existing code for displaying fields... */}
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Lifts
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.lifts === true || property.lifts === 1 ?
											'Yes'
										: property.lifts === false || property.lifts === 0 ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Basement Car park
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.carpark === true || property.carpark === 1 ?
											'Yes'
										: property.carpark === false || property.carpark === 0 ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Communal Utility Assets
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.communalUtilityAssets === true ||
											property.communalUtilityAssets === 1
										) ?
											'Yes'
										: (
											property.communalUtilityAssets === false ||
											property.communalUtilityAssets === 0
										) ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Communal Gas Appliances
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.communalGasAppliances === true ||
											property.communalGasAppliances === 1
										) ?
											'Yes'
										: (
											property.communalGasAppliances === false ||
											property.communalGasAppliances === 0
										) ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Meter bank
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.meterBank === true || property.meterBank === 1 ?
											'Yes'
										: property.meterBank === false || property.meterBank === 0 ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Assets in voids or boxing?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.voidAssets === true || property.voidAssets === 1 ?
											'Yes'
										: (
											property.voidAssets === false || property.voidAssets === 0
										) ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Well maintained?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.wellMaintained === true ||
											property.wellMaintained === 1
										) ?
											'Yes'
										: (
											property.wellMaintained === false ||
											property.wellMaintained === 0
										) ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Refurbished?
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.refurbished === true ||
											property.refurbished === 1
										) ?
											'Yes'
										: (
											property.refurbished === false ||
											property.refurbished === 0
										) ?
											'No'
										:	'Not set'}
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
										onClick={() => handleEdit('contacts', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								{/* ...existing code for displaying fields... */}
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Property Manager
									</p>
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
						{/* Audit Details Card */}
						<Card className="rounded-2xl shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">
									Audit details
									<Button
										label="Edit"
										onClick={() => handleEdit('audit', property)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded float-right"
									/>
								</CardTitle>
							</CardHeader>
							<br />
							<CardContent className="space-y-2 flex">
								{/* ...existing code for displaying fields... */}
								<div className="flex-1 justify-left">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Log Book/CDM Folder
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.logBook === true || property.logBook === 1 ?
											'Yes'
										: property.logBook === false || property.logBook === 0 ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Fire Safety Log Book
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.fireSafetyLogBook === true ||
											property.fireSafetyLogBook === 1
										) ?
											'Yes'
										: (
											property.fireSafetyLogBook === false ||
											property.fireSafetyLogBook === 0
										) ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Waste Electrical and Electronic Equipment Audit
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.electronicAuditCompleted === true ||
											property.electronicAuditCompleted === 1
										) ?
											'Yes'
										: (
											property.electronicAuditCompleted === false ||
											property.electronicAuditCompleted === 0
										) ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										EPC
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.epc === true || property.epc === 1 ?
											'Yes'
										: property.epc === false || property.epc === 0 ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Energy Certificates (DEC's)
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.energyCertificates === true ||
											property.energyCertificates === 1
										) ?
											'Yes'
										: (
											property.energyCertificates === false ||
											property.energyCertificates === 0
										) ?
											'No'
										:	'Not set'}
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										O&M's
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{property.oms === true || property.oms === 1 ?
											'Yes'
										: property.oms === false || property.oms === 0 ?
											'No'
										:	'Not set'}
									</p>
								</div>
								<div className="justify-center items-center flex-1">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										External Isolation Valve Chambers Located and Clear
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.isolationValvesClear === true ||
											property.isolationValvesClear === 1
										) ?
											'Yes'
										: (
											property.isolationValvesClear === false ||
											property.isolationValvesClear === 0
										) ?
											'No'
										:	'Not set'}
										<br />
									</p>
									<br />
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Access Controlled Spaces
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{(
											property.accessControlled === true ||
											property.accessControlled === 1
										) ?
											'Yes'
										: (
											property.accessControlled === false ||
											property.accessControlled === 0
										) ?
											'No'
										:	'Not set'}
										<br />
									</p>
								</div>
							</CardContent>
						</Card>
						{/* Edit Modal */}
						{modalOpen && (
							<EditPropertyModal
								open={modalOpen}
								section={editingSection || ''}
								initial={modalInitial}
								onClose={handleClose}
								onSave={handleSave}
							/>
						)}
					</>
				:	<h2 className="text-gray-500 dark:text-gray-400">No property data.</h2>
				}
			</div>
		</div>
	);
}
