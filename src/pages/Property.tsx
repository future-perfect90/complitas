import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import EditPropertyModal from '../components/modals/EditPropertyModal';
import { useAuthMeta } from '../context/AuthProvider';

import { useParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import LoadingSpinner from '../components/Loading';
import type {
	MaintenanceTask,
	NotificationPreferences,
	Property,
} from '../types';
import {
	getMaintenanceTasks,
	getPreferences,
	getProperty,
	updatePropertySection,
} from '../utils/api';
import PropertyDetails from './PropertyDetails';

export default function Property() {
	const authMeta = useAuthMeta();
	const isLoading = authMeta?.isLoading;
	const [property, setProperty] = useState<Property>();
	const [isPropertyLoading, setIsPropertyLoading] = useState(true);
	const { id } = useParams();
	const [editingSection, setEditingSection] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [preferences, setPreferences] = useState<NotificationPreferences[]>([]);
	const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(
		[]
	);

	const fetchProperty = useCallback(async () => {
		if (!id) return;
		setIsPropertyLoading(true);
		try {
			const data = await getProperty(id);
			const maintenanceData = await getMaintenanceTasks(id);
			const preferences = await getPreferences(id);
			setPreferences(preferences);
			setProperty(data);
			setMaintenanceTasks(maintenanceData);
		} catch (error) {
			console.error('Error fetching property:', error);
		} finally {
			setIsPropertyLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (!isLoading) {
			fetchProperty();
		}
	}, [isLoading, fetchProperty]);

	const handleEdit = (section: string) => {
		setEditingSection(section);
		setModalOpen(true);
	};

	const handleClose = () => {
		setModalOpen(false);
		setEditingSection(null);
	};

	const handleSave = async (updated: Partial<Property>, closeModal = true) => {
		if (!id || !editingSection) return;
		try {
			await updatePropertySection(id, updated);
			setProperty((prev) => ({ ...prev, ...updated }) as Property);
			if (closeModal) {
				toast.success('Property section updated!');
			}
		} catch (err) {
			toast.error('Failed to update property section');
			console.error('Failed to update property section', err);
		}
		if (closeModal) handleClose();
	};

	if (isLoading || isPropertyLoading) {
		return <LoadingSpinner message={'Loading property...'} />;
	}

	return (
		<div className="min-h-screen p-4 sm:p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				<BackButton />
				{property && (
					<>
						<PropertyDetails
							property={property}
							onEdit={handleEdit}
							onDataUpdate={fetchProperty}
							preferences={preferences}
							maintenanceTasks={maintenanceTasks}
						/>
						{modalOpen && (
							<EditPropertyModal
								isOpen={modalOpen}
								section={editingSection || ''}
								initialData={property}
								onClose={handleClose}
								onSave={handleSave}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
