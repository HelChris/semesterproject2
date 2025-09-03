export const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

if (!API_KEY) {
  console.error(
    "API Key not found. Make sure VITE_NOROFF_API_KEY is set in your .env file",
  );
}
