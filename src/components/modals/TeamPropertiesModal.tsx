import React, { useState } from 'react';
import { type MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import type { Property } from '../../types';
import { assignTeamToProperty } from '../../utils/api';
import { Button } from '../Button';
import Modal from '../Modal';
import MultiSelect, { type OptionType } from '../MultiSelect';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	teamId: string;
	teamName: string;
	assignedProperties: Property[];
	unassignedProperties: OptionType[];
}

const TeamAssignmentModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSuccess,
	teamId,
	teamName,
	assignedProperties,
	unassignedProperties,
}) => {
	const [chosenProperties, setChosenProperties] = useState<
		MultiValue<OptionType>
	>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await assignTeamToProperty(
				chosenProperties.map((property) => ({
					value: property.value,
					name: property.label,
				})),
				teamId
			);
			toast.success('Team added successfully!');
			setChosenProperties([]);
			onSuccess();
			onClose();
		} catch {
			toast.error('Error saving team.');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Add properties to ${teamName}`}>
			<form onSubmit={handleSubmit}>
				<div className="mb-4 grid grid-cols-1">
					{unassignedProperties && unassignedProperties.length > 0 ?
						<>
							<label className="block text-sm font-medium text-slate-700">
								Select properties to assign:
							</label>
							<div className="grid grid-cols-1 gap-4 mb-4">
								<MultiSelect
									options={unassignedProperties}
									value={chosenProperties}
									onChange={setChosenProperties}
									closeMenuOnSelect={false}
								/>
							</div>
						</>
					:	<div>
							<p className={'text-slate-400'}>
								No properties available to add.
							</p>
						</div>
					}
					{assignedProperties && assignedProperties.length > 0 ?
						<div className="mt-4 grid grid-cols-1">
							<h3 className="text-lg font-semibold text-slate-800">
								Assigned Properties
							</h3>

							{assignedProperties.map((property) => (
								<p key={property.id} className="text-slate-800">
									{property.name} ({property.email})
								</p>
							))}
						</div>
					:	null}
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						label="Cancel"
						onClick={onClose}
						className="bg-red-400 py-2 px-5"
					/>
					{unassignedProperties && unassignedProperties.length > 0 && (
						<Button label="Add members" className="bg-green-400 py-2 px-5" />
					)}
				</div>
			</form>
		</Modal>
	);
};

export default TeamAssignmentModal;
