import { DarkThemeToggle } from "flowbite-react";
import InputFormFeature from "components/input-form/input-form-feature";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <InputFormFeature />
      <DarkThemeToggle />
    </main>
  );
}

export default App;
