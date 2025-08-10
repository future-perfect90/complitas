interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 bg-gray-300 overflow-y-auto h-full w-full flex items-center justify-center">
			<div className="relative rounded-xl shadow-xl max-w-3xl w-full m-4">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
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
				{/* Modal Content */}
				<div>{children}</div>
			</div>
		</div>
	);
};
