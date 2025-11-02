import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AreaCard from '../components/AreaCard';
import { BackButton } from '../components/BackButton';
import QuestionsModal from '../components/modals/QuestionsModal';
import SearchInput from '../components/SearchInput';
import { useAuthMeta } from '../context/AuthProvider';
import { useSearch } from '../hooks/useSearch';
import { getComplianceAnswers, getComplianceQuestions } from '../utils/api';
import { groupQuestionsByArea } from '../utils/helper';

export default function ComplianceOverview() {
	const { id, auditId } = useParams();
	const [groupedAreas, setGroupedAreas] = useState<any>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
	const authMeta = useAuthMeta();
	const { isLoading, isAuthenticated } = authMeta;
	useEffect(() => {
		const fetchData = async () => {
			if (!auditId) return;
			try {
				if (!isLoading && isAuthenticated) {
					const [questions, answers] = await Promise.all([
						getComplianceQuestions(id ?? ''),
						getComplianceAnswers(auditId),
					]);
					const groupedData = groupQuestionsByArea(questions, answers);
					setGroupedAreas(groupedData);
				}
			} catch (error) {
				console.error('Error fetching compliance data:', error);
			}
		};
		fetchData();
	}, [auditId, selectedAreaName, isLoading, isAuthenticated]);
	const areaSearchKeys = useMemo(() => ['name'], []);
	const filteredAreas = useSearch(
		groupedAreas,
		searchTerm,
		areaSearchKeys as any
	);
	const selectedArea = groupedAreas.find(
		(area: any) => area.name === selectedAreaName
	);

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				<BackButton />
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
					<div>
						<h1 className="text-3xl font-bold">Compliance Overview</h1>
						<p className="text-[#6C757D]">
							Select an area to answer questions.
						</p>
					</div>
					<div className="relative">
						<SearchInput
							value={searchTerm}
							onChange={setSearchTerm}
							placeholder="Search areas..."
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
								aria-label="Clear search">
								&#x2715;
							</button>
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredAreas.map((area: any) => (
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
			</div>
			{selectedArea && (
				<QuestionsModal
					areaName={selectedArea.name}
					questions={selectedArea.questions}
					propertyId={id ?? ''}
					onClose={() => setSelectedAreaName(null)}
					reportId={auditId ?? ''}
				/>
			)}
		</div>
	);
}
