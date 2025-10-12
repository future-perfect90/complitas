import { Link, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import type { MaintenanceDataItem } from '../../types';

const tw = createTw({
	theme: {},
});

interface ReportMaintenancePageProps {
	propertyName: string;
	maintenanceData: MaintenanceDataItem[];
}

export const ReportMaintenancePage = ({
	propertyName,
	maintenanceData,
}: ReportMaintenancePageProps) => {
	const groupedMaintenanceData: { [key: string]: MaintenanceDataItem[] } = {};
	maintenanceData.forEach((row) => {
		if (!groupedMaintenanceData[row.title]) {
			groupedMaintenanceData[row.title] = [];
		}
		groupedMaintenanceData[row.title].push(row);
	});

	return (
		<Page style={tw('p-[30px] text-[11px] text-gray-800')}>
			<Text style={tw('text-2xl mb-5 text-center font-bold')}>
				Maintenance Report for: {propertyName}
			</Text>
			{Object.keys(groupedMaintenanceData).length > 0 ?
				Object.entries(groupedMaintenanceData).map(([title, details]) => (
					<View key={title}>
						<Text
							style={tw(
								'text-base font-bold mt-5 mb-2.5 border-b border-solid border-gray-300 pb-1'
							)}>
							{title}
						</Text>
						{details.map((item, index) => (
							<View key={index} style={tw('mb-2.5')} wrap={false}>
								<Text style={tw('ml-4')}>Description:</Text>
								<Text style={tw('ml-4')}>{item.description}</Text>
								<Text style={tw('ml-4')}>
									Date Completed: {item.completedAt}
								</Text>
								<Text style={tw('ml-4')}>Completed by: {item.name}</Text>
								<Text style={tw('ml-4')}>Contact Name: {item.contactName}</Text>
								<Text style={tw('ml-4')}>Address: {item.contactAddress}</Text>
								<Text style={tw('ml-4')}>
									Contact Number: {item.contactNumber}
								</Text>
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
				))
			:	<Text style={tw('text-center')}>No maintenance carried out.</Text>}
		</Page>
	);
};
