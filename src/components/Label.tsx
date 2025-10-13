type Props = {
	label: string;
};

export default function Label({ label }: Props) {
	return (
		<label className="block text-sm font-medium mb-1 text-[#212529] dark:text-slate-300">
			{label}
		</label>
	);
}
