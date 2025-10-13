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
			<div className="absolute -translate-y-11 -translate-x-12 p-2 w-max max-w-xs dark:bg-[#1E2733] bg-white dark:text-[#ADB5BD] text-[#6C757D] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border">
				{content}
			</div>
		</div>
	);
};

export default Tooltip;
