import {InformationCircleIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Tooltip from './Tooltip';

interface Props {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    layout?: 'horizontal' | 'vertical';
    tooltip?: boolean;
    tooltipContent?: string;
}

const TextField: React.FC<Props> = ({
                                        label,
                                        value,
                                        onChange,
                                        onBlur,
                                        type,
                                        required,
                                        disabled = false,
                                        layout = 'vertical',
                                        tooltip,
                                        tooltipContent,
                                    }) => {
    if (layout === 'horizontal') {
        return (
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-[#212529] whitespace-nowrap dark:text-slate-300">
                    {label}
                </label>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    disabled={disabled}
                    className="px-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-[#212529] dark:text-[#F8F9FA] disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 bg-white"
                />
            </div>
        );
    } else {
        return (
            <div className="mb-2">
                <label className="flex items-center text-sm font-medium text-[#212529] mb-1 dark:text-slate-300">
                    {label}

                    {tooltip && (
                        <Tooltip
                            content={<div className="space-y-1">{tooltipContent}</div>}>
                            <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-400"/>
                        </Tooltip>
                    )}
                </label>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    disabled={disabled}
                    className="mt-1 block w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:border-[#4D83AF] dark:focus:border-[#6DA0CE] text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700"
                />
            </div>
        );
    }
};

export default TextField;
