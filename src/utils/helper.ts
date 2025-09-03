// Define the shape of a single question object from your database
interface Question {
	id: string;
	area: string;
	// ... add other properties like 'text', 'uploadRequired', etc.
}

// Define the shape of a single answer object
interface Answer {
	questionId: string;
	response: 'Yes' | 'No' | 'NA' | null;
	// ... add other answer properties
}

// Define the shape of the data structure we want for each area
interface AreaGroup {
	questions: any[]; // You can use a more specific type than any[] here
	answeredCount: number;
	totalCount: number;
}

// Define the shape of our accumulator object
type GroupedData = Record<string, AreaGroup>;

export const groupQuestionsByArea = (
	questions: Question[],
	answers: Answer[]
) => {
	// Explicitly type the accumulator with our new GroupedData type
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

		if (savedAnswer && savedAnswer.response) {
			acc[question.area].answeredCount++;
		}

		return acc;
	}, {} as GroupedData); // <-- The fix is telling TS the initial {} conforms to our type

	// This part now works perfectly because TypeScript knows the shape of 'data'
	return Object.entries(grouped).map(([name, data]) => ({
		name,
		...data,
	}));
};
