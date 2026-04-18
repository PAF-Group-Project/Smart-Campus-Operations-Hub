import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Smart Campus</h1>
        <p className="text-gray-600 mb-8">Sign in to your account to continue</p>
        
        <button
          onClick={login}
          className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5 mr-3"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
