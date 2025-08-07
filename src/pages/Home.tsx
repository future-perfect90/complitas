import Message from "../components/Message";
function Home() {
    return (
        <>
            <h1>Welcome to the Home Page</h1>
            <p>This is the home page of our application.</p>
            <p><Message name="Tanya" /></p>
        </>
    );
}
export default Home;