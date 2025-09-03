// Define the shape of a single question object from your database
interface Question {
	id: string;
	area: string;
}

interface Answer {
	questionId: string;
	response: 'Yes' | 'No' | 'NA' | null;
}

interface AreaGroup {
	questions: any[];
	answeredCount: number;
	totalCount: number;
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
			};
		}

		acc[question.area].questions.push({ ...question, savedAnswer });
		acc[question.area].totalCount++;

		if (savedAnswer) {
			acc[question.area].answeredCount++;
		}

		return acc;
	}, {} as GroupedData);

	return Object.entries(grouped).map(([name, data]) => ({
		name,
		...data,
	}));
};
