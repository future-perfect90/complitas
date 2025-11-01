import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

type Props = {
	label: string;
	htmlFor?: string;
	className?: string;
	tooltip?: boolean;
	tooltipContent?: string;
};

export default function Label({
	label,
	htmlFor = '',
	className = '',
	tooltip,
	tooltipContent,
}: Props) {
	return (
		<label
			className={`flex items-center text-sm font-medium text-[#212529] dark:text-slate-300 ${className}`}
			htmlFor={htmlFor}>
			{label}
			{tooltip && (
				<Tooltip content={<div className="space-y-1">{tooltipContent}</div>}>
					<InformationCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
				</Tooltip>
			)}
		</label>
	);
}
