import axios from 'axios';
const About = () => {
	const apiEndpoint = import.meta.env.VITE_API_BASE_URL;
	console.log('API Endpoint:', apiEndpoint);
	axios
		.get(`${apiEndpoint}/test.php?action=getItems`)
		.then((response) => {
			console.log(response.data);
		})
		.catch((error) => {
			console.error(error);
		});

	return (
		<div>
			<h1>About Page</h1>
			<p>This is the about page of our application.</p>
		</div>
	);
};

export default About;
