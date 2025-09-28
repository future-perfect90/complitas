import { useParams } from 'react-router-dom';
import { ComplianceReportPDF } from '../components/ComplianceReportPDF';

const PDFReport = () => {
	const { reportId } = useParams();

	if (!reportId) {
		return <div className="p-8">Error: No report ID provided.</div>;
	}
	return <ComplianceReportPDF reportId={reportId ?? ''} />;
};

export default PDFReport;
