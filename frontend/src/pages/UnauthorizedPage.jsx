import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
