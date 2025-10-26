interface Question {
	id: string;
	area: string;
	dateType: string;
}

interface Answer {
	questionId: string;
	answer: 'Yes' | 'No' | 'NA' | null;
	fileName?: string;
	savedDate?: string | null;
}

interface AreaGroup {
	questions: any[];
	answeredCount: number;
	totalCount: number;
	missingUploadsCount: number;
}

type GroupedData = Record<string, AreaGroup>;

export const groupQuestionsByArea = (
	questions: Question[],
	answers: Answer[]
) => {
	const grouped = questions.reduce((acc: GroupedData, question) => {
		const savedAnswer = answers.find((a) => a.questionId === question.id);

		if (!acc[question.area]) {
			acc[question.area] = {
				questions: [],
				answeredCount: 0,
				totalCount: 0,
				missingUploadsCount: 0,
			};
		}

		acc[question.area].questions.push({ ...question, savedAnswer });
		acc[question.area].totalCount++;

		if (savedAnswer) {
			acc[question.area].answeredCount++;
		}
		console.log(savedAnswer);
		if (
			savedAnswer &&
			savedAnswer.answer === 'Yes' &&
			(savedAnswer.savedDate === null || !savedAnswer.fileName)
		) {
			acc[question.area].missingUploadsCount++;
		}

		return acc;
	}, {} as GroupedData);

	return Object.entries(grouped).map(([name, data]) => ({
		name,
		...data,
	}));
};

export const formatTimestamp = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatFieldName = (fieldName: string): string => {
	if (!fieldName) return '';
	const withSpaces = fieldName.replace(/([A-Z])/g, ' $1');
	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};
