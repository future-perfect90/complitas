import { Image, Page, Text } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

const tw = createTw({
	theme: {},
});

interface ReportImageAttachmentPageProps {
	attachmentId: string;
	imageUrl: string;
}

export const ReportImageAttachmentPage = ({
	attachmentId,
	imageUrl,
}: ReportImageAttachmentPageProps) => {
	return (
		<Page style={tw('justify-center items-center')}>
			<Text style={tw('absolute top-5 text-xs')} id={attachmentId}>
				Attachment: {attachmentId}
			</Text>
			<Image style={tw('h-auto max-h-[90%] w-screen')} src={imageUrl} />
		</Page>
	);
};
