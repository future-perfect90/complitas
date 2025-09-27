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
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { getReportData } from '../utils/api';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

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
	images?: string[]; // For PDFs converted to images
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

const ReportDocument = ({
	data,
	attachments,
}: {
	data: ReportDataItem[];
	attachments: Attachment[];
}) => {
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
	data.forEach((row) => {
		if (!groupedData[row.area]) {
			groupedData[row.area] = [];
		}
		groupedData[row.area].push(row);
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
				if (att.type === 'pdf') {
					return (
						<>
							{/* <PdfPageFromUrl url={att.url} /> */}
							<Page key={`att-${index}`} style={styles.page}>
								<Text style={styles.attachmentHeader}>
									Attachment: {att.name}
								</Text>
								{att.images &&
									att.images.map((img, idx) => (
										<Image
											key={`img-${idx}`}
											style={styles.attachmentImage}
											src={img}
										/>
									))}
							</Page>
						</>
					);
				}
				return null;
			})}
		</Document>
	);
};

async function convertPdfToImages(
	pdfUrl: string,
	scale: number = 1.5
): Promise<string[]> {
	if (!pdfUrl) {
		throw new Error('PDF URL is required for conversion.');
	}

	// **CRITICAL CHECK**: Ensure the worker is initialized before proceeding
	if (!pdfjs.GlobalWorkerOptions.workerSrc) {
		throw new Error('PDF Worker not yet initialized. Please wait.');
	}

	const imageDataUrls: string[] = [];

	try {
		// 1. Load the PDF document
		const loadingTask = pdfjs.getDocument({ url: pdfUrl });
		const pdf = await loadingTask.promise;

		// Use a temporary, invisible canvas to render the pages
		const canvas = document.createElement('canvas');
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) {
			throw new Error('Could not get canvas context.');
		}

		// 2. Loop through all pages
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			// 3. Define the viewport (size) and scale
			const viewport = page.getViewport({ scale: scale });
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// 4. Render the page onto the canvas
			const renderContext = {
				canvasContext,
				viewport,
			};
			await page.render(renderContext).promise;

			// 5. Convert the canvas content to a PNG Data URL (Base64 string)
			// This string can be inserted directly into an <img> src attribute.
			const dataUrl = canvas.toDataURL('image/png');
			imageDataUrls.push(dataUrl);
			// Clean up page object
			page.cleanup();
		}
		return imageDataUrls;
	} catch (err) {
		console.error('PDF conversion failed:', err);
		// Re-throw a clearer error for the calling component
		throw new Error(
			`Failed to load or process PDF. Error: ${err instanceof Error ? err.message : String(err)}`
		);
	}
}

export const ComplianceReportPDF = ({
	reportId,
}: {
	reportId: string;
	authToken?: string;
}) => {
	const [reportData, setReportData] = useState<ReportDataItem[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [attachments, setAttachments] = useState<Attachment[]>([]);

	useEffect(() => {
		const fetchReportData = async () => {
			try {
				const data = await getReportData(reportId);
				setReportData(data);
				if (!data || data.length === 0) return;

				const groupedData: { [key: string]: ReportDataItem[] } = {};
				const newAttachments: Attachment[] = [];

				for (const row of data) {
					if (!groupedData[row.area]) {
						groupedData[row.area] = [];
					}
					groupedData[row.area].push(row);

					if (row.fileName && row.fileUrl) {
						const ext = row.fileName.split('.').pop()?.toLowerCase();
						if (ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
							newAttachments.push({
								type: 'image',
								name: row.fileName,
								url: row.fileUrl,
							});
						} else if (ext === 'pdf') {
							// Await the conversion of PDF to images
							const images = await convertPdfToImages(row.fileUrl);
							newAttachments.push({
								type: 'pdf',
								name: row.fileName,
								url: row.fileUrl,
								images,
							});
						}
					}
				}
				setAttachments(newAttachments);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchReportData();
	}, []);

	if (loading) {
		return <div>Loading report...</div>;
	}

	if (!reportData) {
		return <div>Could not load report data.</div>;
	}

	const propertyName = reportData[0]?.propertyName || 'Compliance_Report';
	const reportFileName = `${propertyName.replace(/ /g, '_')}_${new Date().toISOString().split('T')}.pdf`;
	console.log(reportFileName);
	return (
		<div>
			<h2>Report Preview</h2>
			<PDFDownloadLink
				document={
					<ReportDocument data={reportData} attachments={attachments} />
				}
				fileName={reportFileName}>
				{({ blob, url, loading, error }) =>
					loading ? 'Loading document...' : 'Download Report'
				}
			</PDFDownloadLink>

			<PDFViewer width="100%" height="800px">
				<ReportDocument data={reportData} attachments={attachments} />
			</PDFViewer>
		</div>
	);
};
