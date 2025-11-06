import React, { useEffect, useState } from 'react';
import { type MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import {
	assignUserToProperty,
	getUserProperties,
	unassignedProperties,
} from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import MultiSelect, { type OptionType } from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	userId: string;
	userName: string;
	companyId: string;
}

const UserAssignmentModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	userId,
	userName,
	companyId,
}) => {
	const [properties, setProperties] = useState<OptionType[]>([]);
	const [chosenProperties, setChosenProperties] = useState<
		MultiValue<OptionType>
	>([]);

	useEffect(() => {
		if (isOpen) {
			getUserProperties(companyId, userId).then((response) => {
				const assignedProperties = response
					.filter((property: any) => property.assigned)
					.map((property: any) => ({
						value: property.id,
						label: property.name,
					}));
				setChosenProperties(assignedProperties);
			});
			unassignedProperties(companyId).then((response) => {
				const unassigned = response.map((property: any) => ({
					value: property.id,
					label: property.name,
				}));
				setProperties(unassigned);
			});
		}
	}, [isOpen, companyId, userId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await assignUserToProperty(
				userId,
				chosenProperties.map((property) => property.value)
			);
			toast.success('Properties assigned successfully!');
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving properties.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Assign properties to ${userName}`}>
			<form onSubmit={handleSubmit}>
				{properties && properties.length > 0 ?
					<div className="grid grid-cols-2 gap-4">
						<MultiSelect
							options={properties}
							value={chosenProperties}
							onChange={setChosenProperties}
							closeMenuOnSelect={false}
							menuPortalTarget={document.body}
						/>
					</div>
				:	<div>
						<p className={'text-slate-400'}>
							No properties available to assign.
						</p>
					</div>
				}
				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					{properties && properties.length > 0 && (
						<Button
							label="Assign"
							type="submit"
							className="bg-green-400 py-2 px-5"
						/>
					)}
				</div>
			</form>
		</Modal>
	);
};

export default UserAssignmentModal;
