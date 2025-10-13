import { useParams } from 'react-router-dom';
import { ComplianceReportPDF } from '../components/ComplianceReportPDF';

const PDFReport = () => {
	const { id, auditId } = useParams();

	if (!auditId) {
		return <div className="p-8">Error: No report ID provided.</div>;
	}
	return <ComplianceReportPDF auditId={auditId ?? ''} propertyId={id ?? ''}/>;
};

export default PDFReport;
