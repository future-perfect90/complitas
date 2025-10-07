// src/pages/ComplianceOverview.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AreaCard from '../components/AreaCard';
import QuestionsModal from '../components/modals/QuestionsModal';
import { getComplianceAnswers, getComplianceQuestions } from '../utils/api';
import { groupQuestionsByArea } from '../utils/helper'; // Our new helper

export default function ComplianceOverview() {
	const { id, reportId } = useParams();
	const [groupedAreas, setGroupedAreas] = useState<any>([]);
	const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			if (!reportId) return;
			setIsLoading(true);
			try {
				const [questions, answers] = await Promise.all([
					getComplianceQuestions(id ?? ''),
					getComplianceAnswers(reportId),
				]);

				const groupedData = groupQuestionsByArea(questions, answers);
				setGroupedAreas(groupedData);
			} catch (error) {
				console.error('Error fetching compliance data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [reportId, selectedAreaName]);

	const selectedArea = groupedAreas.find(
		(area: any) => area.name === selectedAreaName
	);

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Compliance Overview</h1>
				<p className="text-gray-500">Select an area to answer questions.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{groupedAreas.map((area: any) => (
					<AreaCard
						key={area.name}
						areaName={area.name}
						answeredCount={area.answeredCount}
						totalCount={area.totalCount}
						missingUploadsCount={area.missingUploadsCount}
						onSelect={setSelectedAreaName}
					/>
				))}
			</div>

			{selectedArea && (
				<QuestionsModal
					areaName={selectedArea.name}
					questions={selectedArea.questions}
					propertyId={id ?? ''}
					onClose={() => setSelectedAreaName(null)}
					reportId={reportId ?? ''}
				/>
			)}
		</>
	);
}
