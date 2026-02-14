export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 border-b">
        <nav className="flex gap-4 pb-2 text-sm">
          <span className="font-medium">Deployments</span>
          <span className="text-gray-500">Settings</span>
          <span className="text-gray-500">Environment</span>
          <span className="text-gray-500">Database</span>
        </nav>
      </div>
      {children}
    </div>
  );
}
