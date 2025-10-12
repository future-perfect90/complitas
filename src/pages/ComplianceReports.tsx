import { BackButton } from '../components/BackButton';
import { ComplianceReportList } from '../components/ComplianceReportList';

export default function ComplianceReports() {
	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				<BackButton />
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							Compliance Reports
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Log compliance activities and responses.
						</p>
					</div>
				</div>
				<ComplianceReportList />
			</div>
		</div>
	);
}
