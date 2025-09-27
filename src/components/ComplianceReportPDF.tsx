import {
	Document,
	Font,
	Image,
	PDFDownloadLink,
	PDFViewer,
	Page,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';
import { getReportData } from '../utils/api';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ReportDataItem {
	propertyName: string;
	area: string;
	question: string;
	answer: '1' | '2' | '3' | null;
	fileName: string | null;
	validUntil: string | null;
	fileUrl?: string;
}

interface Attachment {
	type: 'image' | 'pdf';
	name: string;
	url: string;
}

// Register fonts for react-pdf
Font.register({
	family: 'Roboto',
	fonts: [
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
			fontWeight: 'bold',
		},
	],
});

const styles = StyleSheet.create({
	page: {
		fontFamily: 'Roboto',
		padding: 30,
		fontSize: 11,
		color: '#333',
	},
	header: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	areaHeader: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 5,
	},
	questionBlock: {
		marginBottom: 10,
	},
	question: {
		fontWeight: 'bold',
	},
	answer: {
		marginLeft: 15,
	},
	details: {
		marginLeft: 15,
		fontSize: 10,
		color: '#777',
	},
	attachmentPage: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	attachmentImage: {
		maxWidth: '90%',
		maxHeight: '90%',
	},
	attachmentHeader: {
		position: 'absolute',
		top: 20,
		fontSize: 12,
	},
});

const answerMap = {
	'1': 'Yes',
	'2': 'No',
	'3': 'N/A',
};

const PdfPageFromUrl = ({ url }: { url: string }) => {
	const [numPages, setNumPages] = useState<number | null>(null);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
	}

	return (
		<PdfDocument file={url} onLoadSuccess={onDocumentLoadSuccess}>
			{Array.from(new Array(numPages), (el, index) => (
				<PdfPage
					key={`page_${index + 1}`}
					pageNumber={index + 1}
					renderTextLayer={false}
					renderAnnotationLayer={false}
					// The canvas can be converted to an image and used in @react-pdf/renderer
					// This part is conceptual as direct rendering is not possible.
					// In a real app, you'd render to canvas, get data URL, and pass to <Image>.
				/>
			))}
		</PdfDocument>
	);
};

const ReportDocument = ({ data }: { data: ReportDataItem[] }) => {
	if (!data || data.length === 0) {
		return (
			<Document>
				<Page style={styles.page}>
					<Text>No report data available.</Text>
				</Page>
			</Document>
		);
	}

	const propertyName = data[0].propertyName || 'Compliance Report';

	const groupedData: { [key: string]: ReportDataItem[] } = {};
	const attachments: Attachment[] = [];

	data.forEach((row) => {
		if (!groupedData[row.area]) {
			groupedData[row.area] = [];
		}
		groupedData[row.area].push(row);

		if (row.fileName && row.fileUrl) {
			const ext = row.fileName.split('.').pop()?.toLowerCase();
			if (ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
				attachments.push({
					type: 'image',
					name: row.fileName,
					url: row.fileUrl,
				});
			} else if (ext === 'pdf') {
				// For react-pdf, we'd convert PDF pages to images.
				// This is a placeholder to show the concept.
				// A full implementation would fetch the PDF, render pages to canvas,
				// get image data URLs, and then use those in the <Image> component.
				// For simplicity, we'll just list it. A real implementation is more complex.
				attachments.push({ type: 'pdf', name: row.fileName, url: row.fileUrl });
			}
		}
	});

	return (
		<Document>
			{/* Main Report Content */}
			<Page style={styles.page}>
				<Text style={styles.header}>Compliance Report for: {propertyName}</Text>
				{Object.entries(groupedData).map(([area, questions]) => (
					<View key={area}>
						<Text style={styles.areaHeader}>{area}</Text>
						{questions.map((item, index) => (
							<View key={index} style={styles.questionBlock} wrap={false}>
								<Text style={styles.question}>{item.question}</Text>
								<Text style={styles.answer}>
									Answer:{' '}
									{item.answer ? answerMap[item.answer] : 'Not Answered'}
								</Text>
								{item.answer === '1' && item.validUntil && (
									<Text style={styles.details}>
										Valid Until:{' '}
										{new Date(item.validUntil).toLocaleDateString()}
									</Text>
								)}
								{item.fileName && (
									<Text style={styles.details}>
										Evidence Attached: {item.fileName}
									</Text>
								)}
							</View>
						))}
					</View>
				))}
			</Page>

			{/* Attachments */}
			{attachments.map((att, index) => {
				if (att.type === 'image') {
					return (
						<Page key={`att-${index}`} style={styles.attachmentPage}>
							<Text style={styles.attachmentHeader}>
								Attachment: {att.name}
							</Text>
							<Image style={styles.attachmentImage} src={att.url} />
						</Page>
					);
				}
				// PDF rendering is complex. This is a placeholder.
				// In a real app, you would have a component that fetches the PDF,
				// renders each page to a canvas, converts to a data URL, and then
				// you'd use <Image src={dataUrl} /> for each page.
				if (att.type === 'pdf') {
					return (
						<Page key={`att-${index}`} style={styles.page}>
							<Text style={styles.attachmentHeader}>
								Attachment: {att.name} (PDF content would be rendered as images
								here)
							</Text>
							<Text>
								PDF rendering requires client-side processing (e.g., with
								pdf.js) to convert pages to images before embedding.
							</Text>
						</Page>
					);
				}
				return null;
			})}
		</Document>
	);
};

export const ComplianceReportPDF = ({
	reportId,
}: {
	reportId: string;
	authToken?: string;
}) => {
	const [reportData, setReportData] = useState<ReportDataItem[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchReportData = async () => {
			try {
				const data = await getReportData(reportId);
				setReportData(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchReportData();
	}, [reportId]);

	if (loading) {
		return <div>Loading report...</div>;
	}

	if (!reportData) {
		return <div>Could not load report data.</div>;
	}

	const propertyName = reportData[0]?.propertyName || 'Compliance_Report';
	const reportFileName = `${propertyName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

	return (
		<div>
			<h2>Report Preview</h2>
			<PDFDownloadLink
				document={<ReportDocument data={reportData} />}
				fileName={reportFileName}>
				{({ blob, url, loading, error }) =>
					loading ? 'Loading document...' : 'Download Report'
				}
			</PDFDownloadLink>

			<PDFViewer width="100%" height="800px">
				<ReportDocument data={reportData} />
			</PDFViewer>
		</div>
	);
};
