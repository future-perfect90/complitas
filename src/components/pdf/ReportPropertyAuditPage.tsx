import { Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import type { PropertyLog } from '../../types';
import { formatFieldName, formatTimestamp } from '../../utils/helper';

const tw = createTw({
	theme: {},
});

interface ReportPropertyAuditPageProps {
	propertyLog: PropertyLog[];
}

export const ReportPropertyAuditPage = ({
	propertyLog,
}: ReportPropertyAuditPageProps) => {
	return (
		<Page style={tw('p-[30px] text-[11px] text-[#212529]')}>
			<Text style={tw('text-2xl mb-5 text-center font-bold')}>
				Property Audit Log
			</Text>
			{propertyLog.map((item, index) => (
				<View key={index}>
					<Text style={tw('p-3 mb-2 text-sm text-[#212529]')}>
						<Text style={tw('font-bold')}>
							{formatFieldName(item.fieldName)}
						</Text>{' '}
						was updated from{' '}
						{item.oldValue ?
							<Text style={tw('font-semibold text-red-600')}>
								'{item.oldValue}'
							</Text>
						:	<Text style={tw('italic text-[#6C757D]')}>'blank'</Text>}{' '}
						to{' '}
						<Text style={tw('font-semibold text-green-600')}>
							'{item.newValue}'
						</Text>{' '}
						by <Text style={tw('font-semibold')}>{item.actionedBy}</Text> at{' '}
						{formatTimestamp(item.timestamp)}
					</Text>
				</View>
			))}
		</Page>
	);
};
