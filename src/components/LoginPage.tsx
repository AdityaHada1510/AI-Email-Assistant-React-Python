import { FcGoogle } from 'react-icons/fc';

interface LoginProps {
  onSuccess: () => void;
}

export const Login = ({ onSuccess }: LoginProps) => {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Triggered");
    // Trigger your OAuth logic here.
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0c2a] to-[#000000] relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f4b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

      {/* Glass Card */}
      <div className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-10 w-full max-w-sm text-center shadow-xl">
        <h1 className="text-4xl font-extrabold text-white mb-2">Welcome</h1>
        <p className="text-white/80 mb-8">Log in to access your account.</p>

        {/* Custom Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 bg-[#0e1630] border border-white/20 text-white text-base font-semibold rounded-xl px-6 py-3 w-full hover:bg-[#1a2145] transition duration-300"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
