import {
	Document,
	Image,
	Link,
	PDFViewer,
	Page,
	Text,
	View,
} from '@react-pdf/renderer';
import { createCanvas } from 'canvas';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { createTw } from 'react-pdf-tailwind';
import { useAuthMeta } from '../context/AuthProvider';
import type {
	AuditReportResponseData,
	Company,
	MaintenanceDataItem,
	PropertyLog,
} from '../types';
import {
	fetchUrl,
	getAuditData,
	getCompanyByPropertyId,
	getMaintenanceTasksReportData,
	getReportData,
} from '../utils/api';
import { formatTimestamp } from '../utils/helper';
import LoadingSpinner from './modals/Loading';
import { ReportFrontPage } from './pdf/ReportFrontPage';
import { ReportMaintenancePage } from './pdf/ReportMaintenancePage';
import { ReportPropertyAuditPage } from './pdf/ReportPropertyAuditPage';

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
	attachmentId?: string;
}

interface AuditData {
	responseLog: AuditReportResponseData[];
	propertyLog: PropertyLog[];
}

interface Attachment {
	type: 'image' | 'pdf';
	name: string;
	url: string;
	images?: string[]; // For PDFs converted to images
}

const tw = createTw({
	theme: {},
});

const answerMap = {
	'1': 'Yes',
	'2': 'No',
	'3': 'N/A',
};

const ReportDocument = ({
	data,
	maintenanceData,
	attachments,
	auditData,
	companyLogoUrl,
	companyData,
}: {
	data: ReportDataItem[];
	maintenanceData: MaintenanceDataItem[];
	attachments: Attachment[];
	auditData: AuditData;
	companyLogoUrl: string;
	companyData: Company;
}) => {
	console.log(companyData);
	if (!data || data.length === 0) {
		return (
			<Document>
				<Page style={tw('font-roboto p-[30px] text-[11px] text-gray-800')}>
					<Text>No report data available.</Text>
				</Page>
			</Document>
		);
	}
	const createAttachmentId = (index: number) => `Appendix-${index + 1}`;

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
			<ReportFrontPage
				propertyName={propertyName}
				companyLogoUrl={companyLogoUrl}
				companyData={companyData}
			/>
			<Page style={tw('p-[30px] text-[11px] text-gray-800')}>
				{Object.entries(groupedData).map(([area, questions]) => (
					<View key={area}>
						<Text
							style={tw(
								'text-base font-bold mt-5 mb-2.5 border-b border-solid border-gray-300 pb-1'
							)}>
							{area}
						</Text>
						{questions.map((item, index) => (
							<View key={index} style={tw('mb-2.5')} wrap={false}>
								<Text style={tw('font-bold')}>{item.question}</Text>
								<Text style={tw('ml-4')}>
									Answer:{' '}
									{item.answer ? answerMap[item.answer] : 'Not Answered'}
								</Text>
								{item.answer === '1' && item.validUntil && (
									<Text style={tw('ml-4 text-[10px] text-gray-500')}>
										Valid Until:{' '}
										{new Date(item.validUntil).toLocaleDateString()}
									</Text>
								)}
								{item.fileName && (
									<Link
										style={tw('ml-4 text-[10px] text-blue-600 underline')}
										src={`#${item.attachmentId}`}>
										Evidence Attached: {item.attachmentId}
									</Link>
								)}
							</View>
						))}
					</View>
				))}
			</Page>
			<ReportMaintenancePage
				propertyName={propertyName}
				maintenanceData={maintenanceData}
			/>
			<ReportPropertyAuditPage propertyLog={auditData.propertyLog} />

			<Page style={tw('p-[30px] text-[11px] text-gray-800')}>
				<Text style={tw('text-2xl mb-5 text-center font-bold')}>
					Compliance Audit Log
				</Text>
				{auditData.responseLog.map((item, index) => {
					const showAreaHeader =
						index === 0 || item.area !== auditData.responseLog[index - 1].area;

					return (
						<View key={item.question || index}>
							{showAreaHeader && (
								<Text
									style={tw(
										'text-xl font-bold mt-6 mb-3 border-b border-solid border-gray-400 pb-2'
									)}>
									{item.area}
								</Text>
							)}
							<Text style={tw('p-2 mb-2 text-base text-gray-800 leading-6')}>
								{item.fieldName === 'validUntil' ?
									<Text
										style={tw('p-2 mb-2 text-base text-gray-800 leading-6')}>
										The expiry date for question{' '}
										<Text style={tw('font-bold')}>'{item.question}'</Text> was
										changed from{' '}
										{item.oldValue ?
											<Text style={tw('font-semibold text-red-600')}>
												'{formatTimestamp(item.oldValue)}'
											</Text>
										:	<Text style={tw('italic text-gray-500')}>blank</Text>}{' '}
										to{' '}
										<Text style={tw('font-semibold text-green-600')}>
											'{formatTimestamp(item.newValue)}'
										</Text>{' '}
										by{' '}
										<Text style={tw('font-semibold')}>{item.actionedBy}</Text>{' '}
										on {formatTimestamp(item.timestamp)}.
									</Text>
								:	<Text style={tw('p-2 mb-2 text-base text-gray-800 leading-6')}>
										The answer for question{' '}
										<Text style={tw('font-bold')}>'{item.question}'</Text> was
										updated from{' '}
										{item.oldValue ?
											<Text style={tw('font-semibold text-red-600')}>
												'{item.oldValue}'
											</Text>
										:	<Text style={tw('italic text-gray-500')}>blank</Text>}{' '}
										to{' '}
										<Text style={tw('font-semibold text-green-600')}>
											'{item.newValue}'
										</Text>{' '}
										by{' '}
										<Text style={tw('font-semibold')}>{item.actionedBy}</Text>{' '}
										on {formatTimestamp(item.timestamp)}.
									</Text>
								}
							</Text>
						</View>
					);
				})}
			</Page>

			{/* Attachments */}
			{attachments.map((att, index) => {
				const attachmentId = createAttachmentId(index);

				if (att.type === 'image') {
					return (
						<Page
							key={`att-${index}`}
							style={tw('justify-center items-center')}>
							<Text style={tw('absolute top-5 text-xs')} id={attachmentId}>
								Attachment: {attachmentId}
							</Text>
							<Image style={tw('h-auto max-h-[90%] w-screen')} src={att.url} />
						</Page>
					);
				}
				if (att.type === 'pdf') {
					return (
						<>
							<Page
								key={`att-${index}`}
								style={tw('justify-center items-center')}>
								<Text style={tw('absolute top-5 text-xs')} id={attachmentId}>
									Attachment: {attachmentId}
								</Text>
								{att.images &&
									att.images.map((img, idx) => (
										<Image
											key={`img-${idx}`}
											style={tw('h-auto max-h-[90%] w-screen')}
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
	scale: number = 1
): Promise<string[]> {
	if (!pdfUrl) {
		throw new Error('PDF URL is required for conversion.');
	}

	if (!pdfjs.GlobalWorkerOptions.workerSrc) {
		throw new Error('PDF Worker not yet initialized. Please wait.');
	}

	const imageDataUrls: string[] = [];
	try {
		// Use a custom fetch to handle authentication if your API requires it
		const loadingTask = pdfjs.getDocument(pdfUrl);
		const pdf = await loadingTask.promise;

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const viewport = page.getViewport({ scale: scale });

			// Create a canvas element
			const canvas = createCanvas(viewport.width, viewport.height);
			const canvasContext = canvas.getContext('2d');
			if (!canvasContext) {
				throw new Error('Could not get canvas context.');
			}

			canvas.height = viewport.height;
			canvas.width = viewport.width;

			const renderContext = {
				canvasContext: canvasContext as any,
				viewport,
			};
			await page.render(renderContext).promise;

			const dataUrl = canvas.toDataURL('image/png');
			imageDataUrls.push(dataUrl);
			// Clean up page object
			page.cleanup();
		}
		return imageDataUrls;
	} catch (err) {
		console.error('PDF conversion to image failed:', err);
		// Re-throw a clearer error for the calling component
		throw new Error(
			`Failed to load or process PDF. Error: ${err instanceof Error ? err.message : String(err)}`
		);
	}
}

export const ComplianceReportPDF = ({
	reportId,
	propertyId,
}: {
	reportId: string;
	propertyId: string;
	authToken?: string;
}) => {
	const [reportData, setReportData] = useState<ReportDataItem[] | null>();
	const [maintenanceReportData, setMaintenanceReportData] = useState<
		MaintenanceDataItem[] | null
	>();
	const [auditReportData, setAuditReportData] = useState<AuditData>({
		responseLog: [],
		propertyLog: [],
	});
	const [loading, setLoading] = useState(true);
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [companyData, setCompanyData] = useState<Company>();
	const [companyLogoUrl, setCompanyLogoUrl] = useState('');
	const authMeta = useAuthMeta();
	const { isLoading, isAuthenticated } = authMeta;

	useEffect(() => {
		const fetchAndProcessReport = async () => {
			setLoading(true);
			try {
				const [data, maintenanceData, auditData, companyInfo] =
					await Promise.all([
						getReportData(reportId),
						getMaintenanceTasksReportData(propertyId),
						getAuditData(propertyId),
						getCompanyByPropertyId(propertyId),
					]);

				setCompanyData(companyInfo);

				if (companyInfo && companyInfo.logo) {
					const logoUrl = await fetchUrl(
						`${import.meta.env.VITE_API_BASE_URL}/document/presignedUrl.php`,
						'company/logos/',
						companyInfo.logo
					);
					setCompanyLogoUrl(logoUrl);
				}

				if (
					(!data || !data.length) &&
					(!maintenanceData || !maintenanceData.length)
				) {
					setReportData([]);
					return;
				}

				const allItemsWithFiles = [...(data || []), ...(maintenanceData || [])];
				const attachmentPromises = allItemsWithFiles
					.filter((row: any) => row.fileName && row.fileUrl) // Process only rows with files
					.map(async (row: any) => {
						const ext = row.fileName!.split('.').pop()?.toLowerCase();
						if (ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
							return {
								type: 'image',
								name: row.fileName!,
								url: row.fileUrl!,
							};
						} else if (ext === 'pdf') {
							const images = await convertPdfToImages(row.fileUrl!);
							return {
								type: 'pdf',
								name: row.fileName!,
								url: row.fileUrl!,
								images,
							};
						}
						return null; // Handle unsupported file types if any
					});

				const resolvedAttachments = (
					await Promise.all(attachmentPromises)
				).filter(Boolean) as Attachment[]; // Filter out any nulls

				const attachmentIdMap = new Map<string, string>();
				const createAttachmentId = (index: number) => `Appendix-${index + 1}`;

				resolvedAttachments.forEach((att, index) => {
					const id = createAttachmentId(index);
					// Use a Map to handle potential duplicate filenames correctly
					if (!attachmentIdMap.has(att.name)) {
						attachmentIdMap.set(att.name, id);
					}
				});

				const dataWithAttachmentIds = (data || []).map((item: any) => ({
					...item,
					attachmentId:
						item.fileName ? attachmentIdMap.get(item.fileName) : undefined,
				}));

				const maintenanceDataWithAttachmentIds = (maintenanceData || []).map(
					(item: any) => ({
						...item,
						attachmentId:
							item.fileName ? attachmentIdMap.get(item.fileName) : undefined,
					})
				);
				setReportData(dataWithAttachmentIds);
				setMaintenanceReportData(maintenanceDataWithAttachmentIds);
				setAttachments(resolvedAttachments);
				setAuditReportData(auditData);
			} catch (error) {
				console.error('Failed to fetch or process report data:', error);
			} finally {
				setLoading(false);
			}
		};

		if (!isLoading && isAuthenticated) {
			fetchAndProcessReport();
		}
	}, [reportId, propertyId, isLoading, isAuthenticated]);

	if (
		loading ||
		!reportData ||
		!maintenanceReportData ||
		!auditReportData ||
		!companyData
	) {
		return <LoadingSpinner message={'Loading report...'} />;
	}
	return (
		<>
			<PDFViewer style={{ width: '100%', height: '100vh' }}>
				<ReportDocument
					data={reportData}
					maintenanceData={maintenanceReportData}
					attachments={attachments}
					auditData={auditReportData}
					companyLogoUrl={companyLogoUrl}
					companyData={companyData}
				/>
			</PDFViewer>
		</>
	);
};
