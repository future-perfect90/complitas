import { Image, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import type { Company } from '../../types';
import { formatTimestamp } from '../../utils/helper';

const tw = createTw({
	theme: {},
});

interface ReportFrontPageProps {
	propertyName: string;
	companyLogoUrl: string;
	companyData: Company;
}

export const ReportFrontPage = ({
	propertyName,
	companyLogoUrl,
	companyData,
}: ReportFrontPageProps) => {
	const reportDate = formatTimestamp(new Date().toString());

	return (
		<Page size="A4" style={[tw('p-10 text-center bg-white')]}>
			{companyLogoUrl && (
				<Image
					src={companyLogoUrl}
					style={tw('absolute w-1/2 h-1/2 top-1/4 left-1/4 opacity-5 z-0')}
					fixed
				/>
			)}

			<View style={tw('flex-1 flex flex-col justify-center items-center z-10')}>
				{companyLogoUrl && (
					<Image src={companyLogoUrl} style={tw('w-24 h-auto mb-16')} />
				)}

				<Text
					style={tw('text-3xl font-bold tracking-wide text-brand-dark-blue')}>
					PROPERTY COMPLIANCE REPORT
				</Text>

				<Text style={tw('text-base text-gray-700')}>
					Prepared for {companyData.name}
				</Text>

				<Text style={tw('text-lg mt-1 text-gray-600')}>
					Assessment of {propertyName}
				</Text>
			</View>

			<View
				style={tw(
					'absolute bottom-10 left-10 right-10 text-center text-gray-500 z-10 text-md'
				)}
				fixed>
				<Text>Date: {reportDate}</Text>
			</View>
		</Page>
	);
};
