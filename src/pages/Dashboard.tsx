import Message from '../components/Message';
export default function Dashboard() {
	return (
		<>
			<h1>Welcome to your dashboard</h1>
			<p>
				This is your personal dashboard where you can manage your settings and
				view your data.
			</p>
			<p>
				<Message name="Luke" />
			</p>
		</>
	);
}
