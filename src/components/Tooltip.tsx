import React from 'react';

interface TooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
	className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
	return (
		<div className={`relative flex items-center group ${className}`}>
			{children}
			<div className="absolute -translate-y-11 -translate-x-8 p-2 w-max max-w-xs dark:bg-gray-800 bg-white dark:text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border">
				{content}
			</div>
		</div>
	);
};

export default Tooltip;
