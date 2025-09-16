import React from 'react';
import Select, {
	type MultiValue,
	type Props as SelectProps,
} from 'react-select';

export interface OptionType {
	value: string;
	label: string;
}

export interface MultiSelectProps
	extends Omit<SelectProps<OptionType, true>, 'isMulti' | 'options'> {
	options: OptionType[];
	value: MultiValue<OptionType>;
	onChange: (value: MultiValue<OptionType>) => void;
	styles?: any;
}

const defaultStyles = {
	option: (provided: any, state: any) => ({
		...provided,
		padding: '10px 15px',
		borderBottom: '1px solid #f0f0f0',
		backgroundColor:
			state.isSelected ? '#007bff'
			: state.isFocused ? '#e6f0ff'
			: '#fff',
		color: state.isSelected ? '#fff' : '#333',
		cursor: 'pointer',
	}),
	control: (provided: any) => ({
		...provided,
		borderRadius: '8px',
		padding: '4px',
		borderColor: '#ccc',
		boxShadow: 'none',
		'&:hover': { borderColor: '#007bff' },
	}),
	multiValue: (provided: any) => ({
		...provided,
		backgroundColor: '#e6f0ff',
		borderRadius: '4px',
		padding: '2px 5px',
	}),
	multiValueLabel: (provided: any) => ({
		...provided,
		color: '#007bff',
	}),
	multiValueRemove: (provided: any) => ({
		...provided,
		color: '#007bff',
		':hover': {
			backgroundColor: '#007bff',
			color: 'white',
		},
	}),
	menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
};

const MultiSelect: React.FC<MultiSelectProps> = ({
	options,
	value,
	onChange,
	styles,
	...props
}) => {
	return (
		<Select
			isMulti
			options={options}
			value={value}
			onChange={onChange}
			styles={styles || defaultStyles}
			{...props}
		/>
	);
};

export default MultiSelect;
