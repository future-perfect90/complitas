// src/components/QuestionsModal.tsx
import {Button} from '../Button';
import QuestionItem from '../QuestionItem';

interface QuestionsModalProps {
    areaName: string;
    questions: any[];
    onClose: () => void;
    reportId: string;
    propertyId: string;
}

export default function QuestionsModal({
                                           areaName,
                                           questions,
                                           onClose,
                                           reportId,
                                           propertyId,
                                       }: QuestionsModalProps) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center"
            onClick={handleBackdropClick}>
            <div
                className="bg-[#F3F3EF] dark:bg-[#1E2733] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                        Compliance: {areaName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow p-4">
                    {questions.map((q) => (
                        <QuestionItem
                            key={q.id}
                            questionObject={q}
                            savedAnswer={q.savedAnswer}
                            propertyId={propertyId}
                            reportId={reportId}
                        />
                    ))}
                </div>
                <div className="p-4 flex justify-end">
                    <Button
                        label="Close"
                        className="p-2"
                        onClick={onClose}
                        style="secondary"
                    />
                </div>
            </div>
        </div>
    );
}
