"use client"
import { LogIn, UserPlus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Pencil className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DrawBoard</span>
          </div>

          <div className="flex items-center gap-3">
            <Button  onClick={() => router.push('/signin')}variant="ghost" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button onClick={() => router.push('/signup')} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">Sketch. Collaborate. Create.</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              A minimal, fast drawing tool for teams to brainstorm, design, and iterate together in real-time.
            </p>
          </div>

          
          {/* Feature Preview */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Pencil className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Intuitive Drawing</h3>
                <p className="text-sm text-muted-foreground">Simple, responsive tools that feel natural to use</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 19H9a6 6 0 016-6v0a6 6 0 016 6v1"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Real-time Sync</h3>
                <p className="text-sm text-muted-foreground">See changes instantly as your team collaborates</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Optimized for speed and performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to start creating?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of teams using DrawBoard to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/signup')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <UserPlus className="w-4 h-4" />
              Create Free Account
            </Button>
            <Button onClick={() => router.push('/signin')} size="lg" variant="outline" className="gap-2 bg-transparent">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 DrawBoard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
