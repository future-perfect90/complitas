import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Property } from '../../types';
import { Button } from '../Button';
import FileUpload from '../FileUpload';
import Label from '../Label';
import Modal from '../Modal';
import PresignedDocument from '../PresignedDocument';
import Telephone from '../Telephone';
import TextField from '../TextField';

interface EditPropertyModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: Partial<Property>, closeModal?: boolean) => Promise<void>;
	section: string;
	initialData: Property;
}

export default function EditPropertyModal({
	isOpen,
	onClose,
	onSave,
	section,
	initialData,
}: EditPropertyModalProps) {
	const [form, setForm] = useState<Partial<Property>>(initialData);
	const [isSaving, setIsSaving] = useState(false);
	const [changeMitigationPlan, setChangeMitigationPlan] = useState(
		!initialData.mitigationPlan
	);
	const [changeRefurbishedCdm, setChangeRefurbishedCdm] = useState(
		!initialData.refurbishedCDM
	);

	useEffect(() => {
		setForm(initialData);
		setChangeMitigationPlan(!initialData.mitigationPlan);
		setChangeRefurbishedCdm(!initialData.refurbishedCDM);
	}, [initialData]);

	const handleFieldChange = (key: keyof Property, value: any) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleOccupancyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setForm((prev) => ({
			...prev,
			occupancyType: value,
			commercialUnits: value === 'Residential' ? 0 : prev.commercialUnits,
		}));
	};

	const handleAutoSave = async (key: keyof Property, value: any) => {
		setIsSaving(true);
		const updatedForm = { ...form, [key]: value };
		setForm(updatedForm);
		await onSave({ [key]: value }, false); // `false` to not close modal
		setIsSaving(false);
		toast.success(`Updated!`);
	};

	const handleUploadComplete = (
		field: keyof Property,
		fileName: string,
		_url: string
	) => {
		handleAutoSave(field, fileName);
	};

	const handleSubmit = () => {
		const dataToSave = {
			...form,
			isHRB: form.buildingHeight && form.buildingHeight >= 18 ? true : false,
		};
		onSave(dataToSave, true);
	};

	const renderField = (key: string, label: string, type: string) => {
		const isCommercialUnitsDisabled =
			key === 'commercialUnits' && form.occupancyType === 'Residential';
		if (type === 'text' || type === 'number' || type === 'email') {
			return (
				<div className="mb-4">
					<TextField
						label={label}
						value={form[key as keyof Property] as string}
						onChange={(e) =>
							handleFieldChange(
								key as keyof Property,
								type === 'number' ? Number(e.target.value) : e.target.value
							)
						}
						type={type}
						disabled={isCommercialUnitsDisabled}
					/>
				</div>
			);
		}
		if (type === 'telephone') {
			return (
				<Telephone
					label={label}
					value={form[key as keyof Property] as string}
					onChange={(telephone) =>
						handleFieldChange(key as keyof Property, telephone)
					}
					required
				/>
			);
		}
		if (type === 'date') {
			return (
				<div className="mb-4">
					<Label label={label} />
					<input
						type="date"
						value={
							form[key as keyof Property] ?
								String(form[key as keyof Property]).slice(0, 10)
							:	''
						}
						onChange={(e) =>
							handleFieldChange(key as keyof Property, e.target.value)
						}
						className="w-full border rounded px-2 py-1 text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500 bg-white"
					/>
				</div>
			);
		}
		if (type === 'textarea') {
			return (
				<div className="mb-4">
					<Label label={label} />
					<textarea
						value={(form[key as keyof Property] as string) ?? ''}
						onChange={(e) =>
							handleFieldChange(key as keyof Property, e.target.value)
						}
						className="w-full border rounded px-2 py-1 text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500 bg-white"
					/>
				</div>
			);
		}
		if (type === 'boolean') {
			return (
				<div className="mb-4">
					<Label label={label} />
					<div className="flex gap-4">
						<label>
							<input
								type="radio"
								checked={
									form[key as keyof Property] === true ||
									form[key as keyof Property] === 1
								}
								onChange={() => handleAutoSave(key as keyof Property, true)}
								className="checked:bg-orange-600"
							/>{' '}
							<span className="text-[#212529] dark:text-[#F8F9FA]">Yes</span>
						</label>
						<label>
							<input
								type="radio"
								checked={
									form[key as keyof Property] === false ||
									form[key as keyof Property] === 0
								}
								onChange={() => handleAutoSave(key as keyof Property, false)}
							/>{' '}
							<span className="text-[#212529] dark:text-[#F8F9FA]">No</span>
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
				{ value: 'Medical/EOL care', label: 'Medical/EOL care' },
			];
			return (
				<div className="mb-4">
					<Label label="Residential Awareness" />
					<select
						value={(form[key as keyof Property] as string) ?? ''}
						onChange={(e) =>
							handleFieldChange(key as keyof Property, e.target.value)
						}
						className="w-full border rounded px-2 py-2 text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500 bg-white">
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
					<Label label="Occupancy Type" />
					<select
						value={(form[key as keyof Property] as string) ?? ''}
						onChange={handleOccupancyChange}
						className="w-full border rounded px-2 py-2 text-[#212529] bg-white dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500">
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
			{ key: 'city', label: 'Town/City', type: 'text' },
			{ key: 'postCode', label: 'Post Code', type: 'text' },
			{ key: 'county', label: 'County', type: 'text' },
			{ key: 'country', label: 'Country', type: 'text' },
			{
				key: 'designDate',
				label: 'Commission Date/Refurbishment Date',
				type: 'date',
			},
			{ key: 'managerName', label: 'Site Contact Name', type: 'text' },
			{ key: 'siteEmail', label: 'Site Contact Email', type: 'email' },
			{ key: 'telephone', label: 'Site Contact Telephone', type: 'telephone' },
			{
				key: 'uniqueReferenceNumber',
				label: 'Unique Reference',
				type: 'text',
			},
			{
				key: 'residentialAwareness',
				label: 'Residential Awareness',
				type: 'residentialAwareness',
			},
			{
				key: 'habitableHeight',
				label: 'Habitable Height (m)',
				type: 'number',
			},
			{ key: 'buildingHeight', label: 'Building Height (m)', type: 'number' },
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
		if (form.buildingHeight && form.buildingHeight >= 18) {
			fields.push(
				{
					key: 'hrbUniqueReferenceNumber',
					label: 'HRB Unique Reference Number',
					type: 'text',
				},
				{
					key: 'bsrRegistrationNumber',
					label: 'BSR Registration Number',
					type: 'text',
				},
				{
					key: 'principleName',
					label: 'Principle Name',
					type: 'text',
				},
				{
					key: 'principleEmail',
					label: 'Principle Email',
					type: 'email',
				},
				{
					key: 'principleTelephone',
					label: 'Principle Telephone',
					type: 'telephone',
				},
				{
					key: 'principleAddress',
					label: 'Principle Address',
					type: 'textarea',
				}
			);
		}
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
			{
				key: 'voidAssets',
				label: 'Assets in voids or boxing?',
				type: 'boolean',
			},
			{
				key: 'timberFramed',
				label: 'Timber framed building?',
				type: 'boolean',
			},

			{
				key: 'maintenanceRegime',
				label: 'A good maintenance regime?',
				type: 'boolean',
			},
			{ key: 'refurbished', label: 'Refurbishment?', type: 'boolean' },
		];
	} else if (section === 'contacts') {
		fields = [
			{ key: 'managerName', label: 'Property Manager Name', type: 'text' },
			{
				key: 'managerAddress',
				label: 'Property Manager Address',
				type: 'textarea',
			},
			{ key: 'managerEmail', label: 'Property Manager Email', type: 'email' },
			{
				key: 'managerTelephone',
				label: 'Property Manager Telephone',
				type: 'telephone',
			},
			{ key: 'emergencyName', label: 'Emergency Contact Name', type: 'text' },
			{
				key: 'emergencyAddress',
				label: 'Emergency Contact Address',
				type: 'textarea',
			},
			{
				key: 'emergencyEmail',
				label: 'Emergency Contact Email',
				type: 'email',
			},
			{
				key: 'emergencyTelephone',
				label: 'Emergency Contact Telephone',
				type: 'telephone',
			},
			{
				key: 'localFireName',
				label: 'Local Fire Authority Contact Name',
				type: 'text',
			},
			{
				key: 'localFireAddress',
				label: 'Local Fire Authority Address',
				type: 'textarea',
			},
			{
				key: 'localFireEmail',
				label: 'Local Fire Authority Email',
				type: 'email',
			},
			{
				key: 'localFireTelephone',
				label: 'Local Fire Authority Telephone',
				type: 'telephone',
			},
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
				label: 'Energy Certificates',
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

	const showMaintenanceRegimeUpload =
		(form.maintenanceRegime === true || form.maintenanceRegime === 1) &&
		section === 'additional';
	const showRefurbishedUpload =
		(form.refurbished === true || form.refurbished === 1) &&
		section === 'additional';

	let modalTitle = `Edit ${section.charAt(0).toUpperCase() + section.slice(1)} Section`;
	modalTitle +=
		section === 'additional' ?
			' - Does the block comprise of the following:'
		:	'';
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
			<form>
				{isSaving && (
					<span className="text-sm text-[#F8F9FA] absolute top-4 right-24">
						Saving...
					</span>
				)}
				{fields.map((field, index) => {
					if (index % 2 === 0) {
						const nextField = fields[index + 1];
						return (
							<div key={field.key} className="grid grid-cols-2 gap-4">
								{renderField(field.key, field.label, field.type)}
								{nextField &&
									renderField(nextField.key, nextField.label, nextField.type)}
							</div>
						);
					}
					return null;
				})}
				{showMaintenanceRegimeUpload && (
					<div className="mb-4">
						<Label label="Mitigation Plan" />
						{form.mitigationPlan && !changeMitigationPlan ?
							<div className="flex items-center space-x-4">
								<PresignedDocument
									fileName={form.mitigationPlan}
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									directory={`property/maintenanceRegime/`}
									linkTextPrefix="Evidence"
								/>
								<button
									onClick={() => setChangeMitigationPlan(true)}
									className="text-sm text-blue-600 hover:underline">
									<img src="/change.svg" className="w-4 h-4" alt="Change" />
								</button>
							</div>
						:	<FileUpload
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								onUploadComplete={(url, fileName) =>
									handleUploadComplete('mitigationPlan', url, fileName)
								}
								directory={`property/maintenanceRegime/`}
								label="Upload Mitigation Plan"
							/>
						}
					</div>
				)}

				{showRefurbishedUpload && (
					<div className="mb-4">
						<Label label="Refurbished CDM" />
						{form.refurbishedCDM && !changeRefurbishedCdm ?
							<div className="flex items-center space-x-4">
								<PresignedDocument
									fileName={form.refurbishedCDM}
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									directory={`property/refurbished/`}
									linkTextPrefix="Evidence"
								/>
								<button
									onClick={() => setChangeRefurbishedCdm(true)}
									className="text-sm text-blue-600 hover:underline">
									<img src="/change.svg" className="w-4 h-4" alt="Change" />
								</button>
							</div>
						:	<FileUpload
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								onUploadComplete={(url, fileName) =>
									handleUploadComplete('refurbishedCDM', url, fileName)
								}
								directory={`property/refurbished/`}
								label="Upload Refurbished CDM"
							/>
						}
					</div>
				)}

				<div className="flex justify-end gap-2 mt-6">
					<Button
						label="Close"
						onClick={onClose}
						className="py-1 px-4"
						style="secondary"
					/>
					{(section === 'basic' || section === 'contacts') && (
						<Button
							label="Save"
							className="py-1 px-4"
							onClick={handleSubmit}
							style="primary"
						/>
					)}
				</div>
			</form>
		</Modal>
	);
}
