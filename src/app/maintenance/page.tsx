const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className=" max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Under Maintenance
        </h1>
        <p className="text-gray-700 mt-4 max-w-[400px]">
          We are currently working on improving this feature. Please check back
          soon!
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
