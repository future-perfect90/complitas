interface Question {
	id: string;
	area: string;
	uploadRequired: boolean | 0 | 1;
	dateType: string;
	triggerAnswer: any;
	parentQuestionId?: string | null;
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
	const childQuestionsMap = new Map<string, Question[]>();
	const parentQuestions: Question[] = [];

	for (const question of questions) {
		if (question.parentQuestionId) {
			const children = childQuestionsMap.get(question.parentQuestionId) || [];
			children.push(question);
			childQuestionsMap.set(question.parentQuestionId, children);
		} else {
			parentQuestions.push(question);
		}
	}
	const grouped = parentQuestions.reduce((acc: GroupedData, parent) => {
		if (!acc[parent.area]) {
			acc[parent.area] = {
				questions: [],
				answeredCount: 0,
				totalCount: 0,
				missingUploadsCount: 0,
			};
		}
		const area = acc[parent.area];
		const parentAnswer = answers.find((a) => a.questionId === parent.id);
		const children = childQuestionsMap.get(parent.id) || [];
		const questionWithChildren = {
			...parent,
			savedAnswer: parentAnswer,
			childQuestions: children.map((child) => ({
				...child,
				savedAnswer: answers.find((a) => a.questionId === child.id),
			})),
		};
		area.questions.push(questionWithChildren);
		area.totalCount++;
		const checkMissingUploads = (q: Question, a?: Answer) => {
			return (
				a &&
				a.answer === 'Yes' &&
				((q.uploadRequired && !a.fileName) || (q.dateType && !a.savedDate))
			);
		};

		if (checkMissingUploads(parent, parentAnswer)) {
			area.missingUploadsCount++;
		}
		if (parentAnswer) {
			const triggeredChildren = children.filter(
				(c) => c.triggerAnswer === parentAnswer.answer
			);
			area.totalCount += triggeredChildren.length;
			const allTriggeredAnswered = triggeredChildren.every((c) => {
				const childAnswer = answers.find((a) => a.questionId === c.id);
				if (!childAnswer) return false;
				if (checkMissingUploads(c, childAnswer)) {
					area.missingUploadsCount++;
				}
				area.answeredCount++;

				return true;
			});
			if (allTriggeredAnswered) {
				area.answeredCount++;
			}
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

export const formatTimestampDateOnly = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);
	return `${day}-${month}-${year}`;
};

export const formatFieldName = (fieldName: string): string => {
	if (!fieldName) return '';
	const withSpaces = fieldName.replace(/([A-Z])/g, ' $1');
	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};
