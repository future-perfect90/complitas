import { useParams } from 'react-router-dom';
import { ComplianceReportPDF } from '../components/ComplianceReportPDF';

const PDFReport = () => {
	const { reportId } = useParams();

	return <ComplianceReportPDF reportId={reportId ?? ''} />;
};

export default PDFReport;
