import LoginButton from "./components/LoginButton";
import MapLoader from "./components/MapLoader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full p-4 flex justify-between items-center bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">Haux Road Network App</h1>
        <LoginButton />
      </div>
      <div className="w-full h-[calc(100vh-80px)]">
        <MapLoader />
      </div>
    </main>
  );
}
