export function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">Coming soon</p>
    </div>
  );
}
