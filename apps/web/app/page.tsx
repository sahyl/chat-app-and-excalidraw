import "@/styles.css";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Button Variants Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Explore different styles, sizes, and states of the Button component from @repo/ui
          </p>
        </section>

        {/* Variant Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Variants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Size Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Sizes</h2>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Button>
          </div>
        </section>

        {/* State Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button variant="default" className="animate-pulse">
              Loading
            </Button>
            <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground">
              Hover Effect
            </Button>
          </div>
        </section>

        {/* Custom Styling Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Custom Styled Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              className={cn(
                "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
                "hover:from-blue-600 hover:to-purple-600"
              )}
            >
              Gradient Button
            </Button>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Thick Border
            </Button>
            <Button size="lg" className="rounded-full">
              Rounded Large
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}