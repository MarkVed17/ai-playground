import Link from "next/link";

export default function Home() {
  const features = [
    {
      name: "Dashboard",
      description: "Analytics dashboard with charts and metrics",
      href: "/dashboard"
    },
    {
      name: "Product Page",
      description: "E-commerce product showcase with gallery and reviews",
      href: "/product"
    },
    {
      name: "Landing Page",
      description: "Hero section with features and testimonials",
      href: "/landing"
    },
    {
      name: "Forms",
      description: "Multi-step forms with validation",
      href: "/forms"
    },
    {
      name: "Data Tables",
      description: "Sortable, filterable tables with pagination",
      href: "/tables"
    },
    {
      name: "Components",
      description: "Interactive modals, dropdowns, and carousels",
      href: "/components"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Design-to-Code Evaluation Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare AI tools by building the same features with Builder.io, Animaa, v0, and Claude Code
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="text-sm text-indigo-600 font-medium">
                View implementations →
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500">
          <p>Built with Next.js 14, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
