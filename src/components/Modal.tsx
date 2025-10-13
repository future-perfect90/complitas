import React from 'react';

type Props = {
	title?: string;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
};

export default function Modal({ title, isOpen, onClose, children }: Props) {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			<div className="relative w-full max-w-3xl bg-[#F3F3EF] rounded-lg shadow-lg z-10 max-h-full overflow-y-auto dark:bg-[#1E2733]">
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
						{title}
					</h3>
					<button
						onClick={onClose}
						className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-[#F8F9FA]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
