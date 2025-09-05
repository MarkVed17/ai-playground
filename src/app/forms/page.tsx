import Link from "next/link";

export default function FormsPage() {
  const tools = [
    { name: "Builder.io", path: "/forms/builder", color: "bg-purple-500" },
    { name: "v0 by Vercel", path: "/forms/v0", color: "bg-black" },
    { name: "Claude Code", path: "/forms/claude", color: "bg-orange-500" },
    { name: "Animaa", path: "/forms/animaa", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Forms Implementations</h1>
          <p className="text-gray-600">
            Multi-step forms with validation and interactions built using different AI tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.path}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-center"
            >
              <div className={`w-16 h-16 ${tool.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{tool.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600">View forms implementation →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Requirements</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Multi-step flow with progress</li>
            <li>• Field validation (sync/async) and error messaging</li>
            <li>• Accessible labels, descriptions, and keyboard navigation</li>
            <li>• Conditional fields and dynamic sections</li>
            <li>• Client-side filtering and search interactions</li>
            <li>• Autosave/draft and reset behaviors</li>
            <li>• Responsive design and mobile-friendly inputs</li>
            <li>• Minimal palette with primary accent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
