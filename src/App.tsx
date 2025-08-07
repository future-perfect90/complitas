import Navigation from './components/Navigation';
import AppRoutes from './routing/AppRouting';
import './styles/App.css';

function App() {
	return (
		<>
			<Navigation />
			<main className="flex-1 flex flex-col p-8 w-full box-border">
				<AppRoutes />
			</main>
		</>
	);
}

export default App;
