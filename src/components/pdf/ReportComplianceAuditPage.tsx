import { Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import type { AuditReportResponseData } from '../../types';
import { formatTimestamp, formatTimestampDateOnly } from '../../utils/helper';

const tw = createTw({
	theme: {},
});

interface ReportComplianceAuditPageProps {
	responseLog: AuditReportResponseData[];
}

export const ReportComplianceAuditPage = ({
	responseLog,
}: ReportComplianceAuditPageProps) => {
	return (
		<Page style={tw('p-[30px] text-[11px] text-[#212529]')}>
			<Text style={tw('text-2xl mb-5 text-center font-bold')}>
				Compliance Audit Log
			</Text>
			{responseLog.map((item, index) => {
				const showAreaHeader =
					index === 0 || item.area !== responseLog[index - 1].area;

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
						<Text style={tw('p-2 mb-2 text-base text-[#212529] leading-6')}>
							{item.fieldName === 'savedDate' ?
								<Text style={tw('p-2 mb-2 text-base text-[#212529] leading-6')}>
									The date for question{' '}
									<Text style={tw('font-bold')}>'{item.question}'</Text> was
									changed from{' '}
									{item.oldValue ?
										<Text style={tw('font-semibold text-red-600')}>
											'{formatTimestampDateOnly(item.oldValue)}'
										</Text>
									:	<Text style={tw('italic text-[#6C757D]')}>blank</Text>}{' '}
									to{' '}
									<Text style={tw('font-semibold text-green-600')}>
										'{formatTimestampDateOnly(item.newValue)}'
									</Text>{' '}
									by <Text style={tw('font-semibold')}>{item.actionedBy}</Text>{' '}
									on {formatTimestamp(item.timestamp)}.
								</Text>
							:	<Text style={tw('p-2 mb-2 text-base text-[#212529] leading-6')}>
									The answer for question{' '}
									<Text style={tw('font-bold')}>'{item.question}'</Text> was
									updated from{' '}
									{item.oldValue ?
										<Text style={tw('font-semibold text-red-600')}>
											'
											{item.oldValue === '1' ?
												'Yes'
											: item.oldValue === '2' ?
												'No'
											: item.oldValue === '3' ?
												'N/A'
											:	item.oldValue}
											'
										</Text>
									:	<Text style={tw('italic text-[#6C757D]')}>blank</Text>}{' '}
									to{' '}
									<Text style={tw('font-semibold text-green-600')}>
										'
										{item.newValue === '1' ?
											'Yes'
										: item.newValue === '2' ?
											'No'
										: item.newValue === '3' ?
											'N/A'
										:	item.newValue}
										'
									</Text>{' '}
									by <Text style={tw('font-semibold')}>{item.actionedBy}</Text>{' '}
									on {formatTimestamp(item.timestamp)}.
								</Text>
							}
						</Text>
					</View>
				);
			})}
		</Page>
	);
};
