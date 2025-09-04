import Link from "next/link";

export default function DashboardPage() {
  const tools = [
    { name: "Builder.io", path: "/dashboard/builder", color: "bg-purple-500" },
    { name: "v0 by Vercel", path: "/dashboard/v0", color: "bg-black" },
    { name: "Claude Code", path: "/dashboard/claude", color: "bg-orange-500" },
    { name: "Animaa", path: "/dashboard/animaa", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Implementations</h1>
          <p className="text-gray-600">
            Analytics dashboard with charts, metrics, and data visualization built using different AI tools
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
              <p className="text-gray-600">View dashboard implementation →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Requirements</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Revenue and user metrics cards</li>
            <li>• Interactive charts (line, bar, pie)</li>
            <li>• Data tables with sorting and filtering</li>
            <li>• Real-time updates and animations</li>
            <li>• Responsive design for mobile and desktop</li>
            <li>• Dark/light mode toggle</li>
          </ul>
        </div>
      </div>
    </div>
  );
}