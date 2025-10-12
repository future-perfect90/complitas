import { Image, Page, Text } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

const tw = createTw({
	theme: {},
});

interface ReportPdfAttachmentPageProps {
	attachmentId: string;
	images: string[];
}

export const ReportPdfAttachmentPage = ({
	attachmentId,
	images,
}: ReportPdfAttachmentPageProps) => {
	return (
		<>
			{images.map((image, index) => (
				<Page
					key={`pdf-page-${index}`}
					style={tw('justify-center items-center')}>
					<Text
						style={tw('absolute top-5 text-xs')}
						id={index === 0 ? attachmentId : undefined}>
						Attachment: {attachmentId} (Page {index + 1} of {images.length})
					</Text>
					<Image style={tw('h-auto max-h-[90%] w-screen')} src={image} />
				</Page>
			))}
		</>
	);
};
