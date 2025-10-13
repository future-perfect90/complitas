import { BackButton } from '../components/BackButton';
import { ComplianceAuditList } from '../components/ComplianceAuditList';

export default function ComplianceReports() {
	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				<BackButton />
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-[#212529] dark:text-[#F8F9FA]">
							Compliance Reports
						</h1>
						<p className="text-[#212529] dark:text-[#F8F9FA]">
							Log compliance activities and responses.
						</p>
					</div>
				</div>
				<ComplianceAuditList />
			</div>
		</div>
	);
}
