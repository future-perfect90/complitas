import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditPropertyModal from '../components/modals/EditPropertyModal';
import type { Property } from '../types';
import { getProperty, updatePropertySection } from '../utils/api';
import PropertyDetails from './PropertyDetails';

export default function Property() {
	const { isAuthenticated } = useAuth0();
	const [property, setProperty] = useState<Property>();
	const { id } = useParams();
	const [editingSection, setEditingSection] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const fetchProperty = useCallback(async () => {
		if (!id) return;
		try {
			const data = await getProperty(id);
			setProperty(data);
		} catch (error) {
			console.error('Error fetching property:', error);
			toast.error('Failed to load property data.');
		}
	}, [id]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchProperty();
		}
	}, [isAuthenticated, fetchProperty]);

	// Modal open handler
	const handleEdit = (section: string) => {
		setEditingSection(section);
		setModalOpen(true);
	};
	// Modal close handler
	const handleClose = () => {
		setModalOpen(false);
		setEditingSection(null);
	};
	// Modal save handler: call updatePropertySection API
	const handleSave = async (updated: Partial<Property>, closeModal = true) => {
		if (!id || !editingSection) return;
		try {
			await updatePropertySection(id, updated);
			setProperty((prev) => ({ ...prev, ...updated }) as Property); // Update local state
			if (closeModal) {
				toast.success('Property section updated!');
			}
		} catch (err) {
			// Optionally show error to user
			toast.error('Failed to update property section');

			console.error('Failed to update property section', err);
		}
		if (closeModal) handleClose();
	};

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Property Details Section */}
				{property ?
					<>
						<PropertyDetails
							property={property}
							onEdit={handleEdit}
							onDataUpdate={fetchProperty}
						/>
						{/* Edit Modal */}
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
				:	<h2 className="text-gray-500 dark:text-gray-400">No property data.</h2>
				}
			</div>
		</div>
	);
}
