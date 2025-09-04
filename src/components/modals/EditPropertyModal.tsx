import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Property } from '../../types';
import { Button } from '../Button';
import FileUpload from '../FileUpload';
import Label from '../Label';
import Modal from '../Modal';
import PresignedDocument from '../PresignedDocument';
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

	const handleAutoSave = async (key: keyof Property, value: any) => {
		setIsSaving(true);
		const updatedForm = { ...form, [key]: value };
		setForm(updatedForm);
		await onSave({ [key]: value }, false); // `false` to not close modal
		setIsSaving(false);
		toast.success('Saved!');
	};

	const handleUploadComplete = (
		field: keyof Property,
		_url: string,
		fileName: string
	) => {
		handleAutoSave(field, fileName);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(form, true); // `true` to close modal on final save
	};

	// Field render helpers
	const renderField = (key: string, label: string, type: string) => {
		if (type === 'text' || type === 'number') {
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
					/>
				</div>
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
						className="w-full border rounded px-2 py-1 text-gray-900"
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
						className="w-full border rounded px-2 py-1 text-gray-900"
					/>
				</div>
			);
		}
		if (type === 'boolean') {
			const isWellMaintained = key === 'wellMaintained';
			const isRefurbished = key === 'refurbished';
			const showUpload =
				(isWellMaintained &&
					(form.wellMaintained === true || form.wellMaintained === 1)) ||
				(isRefurbished &&
					(form.refurbished === true || form.refurbished === 1));

			return (
				<div className="mb-4">
					<div className="flex items-center">
						<Label label={label} />
					</div>
					<div className="flex gap-4">
						<label>
							<input
								type="radio"
								checked={
									form[key as keyof Property] === true ||
									form[key as keyof Property] === 1
								}
								onChange={() => handleAutoSave(key as keyof Property, true)}
							/>{' '}
							<span className="text-gray-900">Yes</span>
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
							<span className="text-gray-900">No</span>
						</label>
					</div>
					{isWellMaintained && form.mitigationPlan && !changeMitigationPlan && (
						<div className="flex items-center space-x-4">
							<PresignedDocument
								fileName={form.mitigationPlan}
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								directory={`property/wellMaintained/`}
								linkTextPrefix="Mitigation Plan"
							/>
							<button
								type="button"
								onClick={() => setChangeMitigationPlan(true)}
								className="text-sm text-blue-600 hover:underline">
								<img
									src="/public/change.svg"
									className="w-4 h-4"
									alt="Change"
								/>
							</button>
						</div>
					)}
					{isRefurbished && form.refurbishedCDM && !changeRefurbishedCdm && (
						<div className="flex items-center space-x-4">
							<PresignedDocument
								fileName={form.refurbishedCDM}
								uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
								directory={`property/refurbished/`}
								linkTextPrefix="Refurbished"
							/>
							<button
								type="button"
								onClick={() => setChangeRefurbishedCdm(true)}
								className="text-sm text-blue-600 hover:underline">
								<img
									src="/public/change.svg"
									className="w-4 h-4"
									alt="Change"
								/>
							</button>
						</div>
					)}
					<div className="mt-2">
						{isWellMaintained &&
							showUpload &&
							(!form.mitigationPlan || changeMitigationPlan) && (
								<FileUpload
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									onUploadComplete={(url, fileName) =>
										handleUploadComplete('mitigationPlan', url, fileName)
									}
									directory={`property/wellMaintained/`}
									label="Upload Mitigation Plan"
									onClose={() => setChangeMitigationPlan(false)}
								/>
							)}
						{isRefurbished &&
							showUpload &&
							(!form.refurbishedCDM || changeRefurbishedCdm) && (
								<FileUpload
									uploadApiUrl={`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`}
									onUploadComplete={(url, fileName) =>
										handleUploadComplete('refurbishedCDM', url, fileName)
									}
									directory={`property/refurbished/`}
									label="Upload Refurbished CDM"
								/>
							)}
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
						value={(form[key as keyof Property] as string) ?? ''}
						onChange={(e) =>
							handleFieldChange(key as keyof Property, e.target.value)
						}
						className="w-full border rounded px-2 py-2 text-gray-900">
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
						onChange={(e) =>
							handleFieldChange(key as keyof Property, e.target.value)
						}
						className="w-full border rounded px-2 py-2 text-gray-900">
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
					type: 'text',
				},
				{
					key: 'principleTelephone',
					label: 'Principle Telephone',
					type: 'text',
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
			{ key: 'managerName', label: 'Property Manager Name', type: 'text' },
			{
				key: 'managerAddress',
				label: 'Property Manager Address',
				type: 'textarea',
			},
			{ key: 'managerEmail', label: 'Property Manager Email', type: 'text' },
			{
				key: 'managerTelephone',
				label: 'Property Manager Telephone',
				type: 'text',
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
				type: 'text',
			},
			{
				key: 'emergencyTelephone',
				label: 'Emergency Contact Telephone',
				type: 'text',
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
				type: 'text',
			},
			{
				key: 'localFireTelephone',
				label: 'Local Fire Authority Telephone',
				type: 'text',
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Edit ${section.charAt(0).toUpperCase() + section.slice(1)} Section`}>
			<form onSubmit={handleSubmit}>
				{isSaving && (
					<span className="text-sm text-gray-400 absolute top-4 right-24">
						Saving...
					</span>
				)}
				{fields.map((f) => renderField(f.key, f.label, f.type))}

				<div className="flex justify-end gap-2 mt-6">
					<Button
						label="Close"
						onClick={onClose}
						className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-4 rounded"
					/>
				</div>
			</form>
		</Modal>
	);
}
