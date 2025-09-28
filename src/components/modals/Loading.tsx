export default function LoadingSpinner({ message }: { message: string }) {
	return (
		<div className="flex justify-center items-center">
			<div className="w-12 h-12 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
			<p>{message}</p>
		</div>
	);
}
