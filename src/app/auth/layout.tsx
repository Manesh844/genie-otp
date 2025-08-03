
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md px-6">
        {/* AnimatedGenie component removed */}
        {children}
      </div>
    </div>
  );
}
