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

			<div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg z-10">
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h3 className="text-lg font-semibold text-slate-600">{title}</h3>
					<button
						onClick={onClose}
						className="text-slate-600 hover:text-slate-900">
						✕
					</button>
				</div>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
