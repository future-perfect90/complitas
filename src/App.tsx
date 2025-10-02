import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { PostHogProvider } from "posthog-js/react";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routing/AppRouting";
import "./styles/globals.css";
import { setAuthService } from "./utils/authService";

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthService(getAccessTokenSilently);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: "2025-05-24",
          capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
          debug: import.meta.env.MODE === "development",
        }}
      >
        <AuthProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col p-8 pt-16 md:pt-8 w-full box-border overflow-y-auto">
              <div className="container mx-auto px-6 py-8">
                <AppRoutes />
              </div>
            </main>
          </div>
        </AuthProvider>
      </PostHogProvider>
    </>
  );
}

export default App;
