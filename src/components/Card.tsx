import type { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

function Card({ children, className = '', onClick }: CardProps) {
	return (
		<div
			className={`rounded-2xl border border-[#CED4DA] dark:border-[#495057] bg-white dark:bg-[#293440] shadow-lg ${className}`}
			onClick={onClick}>
			{children}
		</div>
	);
}

function CardHeader({ children, className = '' }: CardProps) {
	return (
		<div
			className={`flex flex-col space-y-1.5 p-6 border-b dark:border-gray-700 ${className}`}>
			{children}
		</div>
	);
}

function CardTitle({ children, className = '' }: CardProps) {
	return (
		<h3
			className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
			{children}
		</h3>
	);
}

function CardContent({ children, className = '' }: CardProps) {
	return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export { Card, CardContent, CardHeader, CardTitle };
