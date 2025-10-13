// src/components/AreaCard.tsx
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface AreaCardProps {
	areaName: string;
	answeredCount: number;
	totalCount: number;
	missingUploadsCount: number;
	onSelect: (areaName: string) => void;
}

export default function AreaCard({
	areaName,
	answeredCount,
	totalCount,
	missingUploadsCount,
	onSelect,
}: AreaCardProps) {
	const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
	const isComplete = answeredCount === totalCount;

	return (
		<Card
			className="rounded-xl shadow-md transition-transform hover:scale-105"
			onClick={() => onSelect(areaName)}>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-medium">{areaName}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4">
					<div className="flex justify-between items-center text-sm text-[#6C757D] dark:text-[#ADB5BD] mt-2">
						<span className="">Progress</span>
						<span>
							{answeredCount} / {totalCount} Answered
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className={`h-2.5 rounded-full ${isComplete ? 'bg-[#4D83AF]' : 'bg-[#F29F05] dark:bg-[#F2B705]'}`}
							style={{ width: `${progress}%` }}></div>
					</div>
				</div>
				{missingUploadsCount > 0 && (
					<div className="text-sm text-red-600 mb-4">
						{missingUploadsCount} action(s) required
					</div>
				)}
				<Button
					label="Open Questions"
					onClick={() => onSelect(areaName)}
					className="w-full bg-inherit! text-[#212529]! dark:text-[#F8F9FA]!"
				/>
			</CardContent>
		</Card>
	);
}
