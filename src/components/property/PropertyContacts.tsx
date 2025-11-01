import React, { type ReactElement } from 'react';

interface PropertyContactsProps {
	renderField: (
		key: string,
		label: string,
		type: string
	) => ReactElement | null;
}

const Section: React.FC<{ title: string; fields: any[]; renderField: any }> = ({
	title,
	fields,
	renderField,
}) => (
	<div className="mb-6">
		<h3 className="text-lg font-semibold border-b pb-2 mb-4">{title}</h3>
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
	</div>
);

const PropertyContacts: React.FC<PropertyContactsProps> = ({ renderField }) => {
	const propertyManagerFields = [
		{ key: 'managerName', label: 'Name', type: 'text' },
		{
			key: 'managerAddress',
			label: 'Address',
			type: 'textarea',
		},
		{ key: 'managerEmail', label: 'Email', type: 'email' },
		{
			key: 'managerTelephone',
			label: 'Telephone',
			type: 'telephone',
		},
	];

	const emergencyContactFields = [
		{ key: 'emergencyName', label: 'Name', type: 'text' },
		{
			key: 'emergencyAddress',
			label: 'Address',
			type: 'textarea',
		},
		{
			key: 'emergencyEmail',
			label: 'Email',
			type: 'email',
		},
		{
			key: 'emergencyTelephone',
			label: 'Telephone',
			type: 'telephone',
		},
	];

	const localFireFields = [
		{
			key: 'localFireName',
			label: 'Name',
			type: 'text',
		},
		{
			key: 'localFireAddress',
			label: 'Address',
			type: 'textarea',
		},
		{
			key: 'localFireEmail',
			label: 'Email',
			type: 'email',
		},
		{
			key: 'localFireTelephone',
			label: 'Telephone',
			type: 'telephone',
		},
	];

	return (
		<>
			<Section
				title="Property Manager"
				fields={propertyManagerFields}
				renderField={renderField}
			/>
			<Section
				title="Emergency Out Of Hours Contact"
				fields={emergencyContactFields}
				renderField={renderField}
			/>
			<Section
				title="Local Fire Service"
				fields={localFireFields}
				renderField={renderField}
			/>
		</>
	);
};

export default PropertyContacts;
