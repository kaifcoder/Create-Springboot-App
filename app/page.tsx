import { ProjectGenerator } from "@/components/project-generator"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
          Spring Boot Project Generator
        </h1>
        <p className="text-center mb-8 text-slate-600 dark:text-slate-300">
          Generate a complete Spring Boot application with custom entities
        </p>
        <ProjectGenerator />
        <Toaster />
      </div>
    </main>
  )
}

