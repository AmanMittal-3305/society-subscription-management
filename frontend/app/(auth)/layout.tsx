export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="w-[1000px] max-w-[95vw] min-h-[600px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Left Image Section */}
        <div className="hidden lg:block h-full">
          <img
            src="https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg"
            alt="Society"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              SocietyHub
            </h1>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}