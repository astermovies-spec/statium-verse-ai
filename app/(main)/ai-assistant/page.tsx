import { AIAssistant } from '@/components/ai/ai-assistant'
import { Navbar } from '@/components/navbar'

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16" role="main">
        <AIAssistant />
      </main>
    </div>
  )
}
