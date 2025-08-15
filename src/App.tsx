import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routing/AppRouting';
import './styles/App.css';

function App() {
	return (
		<>
			<Navigation />
			<main className="flex-1 flex flex-col p-8 w-full box-border">
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</main>
		</>
	);
}

export default App;
