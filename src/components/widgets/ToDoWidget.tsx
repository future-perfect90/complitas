import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import type { ToDoTask } from './ToDo.types';

// Sample Data for the To-Do list.
// In a real application, this would be fetched from an API.
const sampleTasks: ToDoTask[] = [
	{
		id: '1',
		task: 'Review fire safety audit for Elm Street Complex',
		dueDate: '15-11-2025',
		completed: false,
	},
	{
		id: '2',
		task: 'Schedule annual lift maintenance for Oak Tower',
		dueDate: '20-11-2025',
		completed: false,
	},
	{
		id: '3',
		task: 'Update emergency contact list for Pine View Apartments',
		dueDate: '01-12-2025',
		completed: true,
	},
	{
		id: '4',
		task: 'Check gas safety certificates for all properties',
		dueDate: '10-12-2025',
		completed: false,
	},
];

const ToDoWidget: React.FC = () => {
	const [tasks, setTasks] = useState<ToDoTask[]>([]);

	//Fetch tasks from your API here.
	useEffect(() => {
		// const fetchTasks = async () => {
		//   try {
		//     // const fetchedTasks = await getToDoTasks();
		//     // setTasks(fetchedTasks);
		//   } catch (error) {
		//     toast.error("Failed to load tasks.");
		//   }
		// };
		// fetchTasks();

		// Using sample data for now
		setTasks(sampleTasks);
	}, []);

	const handleMarkAsComplete = useCallback(async (taskId: string) => {
		// Call your API to update the task status.
		// try {
		//   await markTaskAsComplete(taskId);
		//   setTasks(prevTasks =>
		//     prevTasks.map(task =>
		//       task.id === taskId ? { ...task, completed: true } : task
		//     )
		//   );
		//   toast.success("Task marked as complete!");
		// } catch (error) {
		//   toast.error("Failed to update task.");
		// }

		// Simulating the API call for the sample data
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, completed: true } : task
			)
		);
		toast.success('Task marked as complete!');
	}, []);

	const headers = [
		{ key: 'task', label: 'Task' },
		{ key: 'dueDate', label: 'Date to complete' },
		{ key: 'action', label: 'Action' },
	];

	return (
		<div className="font-sans bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950/50 p-6 flex flex-col">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				My Tasks
			</h3>
			<table className="w-full border-collapse">
				<thead className="sticky top-0 bg-white dark:bg-gray-800">
					<tr>
						{headers.map((header) => (
							<th
								key={header.key}
								className="p-3 pt-0 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								{header.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tasks.map((task) => (
						<tr key={task.id} className="border-b dark:border-gray-700">
							<td
								className={`p-3 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
								{task.task}
							</td>
							<td
								className={`p-3 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
								{task.dueDate}
							</td>
							<td className="p-3 text-sm">
								{!task.completed && (
									<Button
										label="Mark as complete"
										onClick={() => handleMarkAsComplete(task.id)}
										style="primary"
										className="py-1 px-2 text-xs"
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ToDoWidget;
