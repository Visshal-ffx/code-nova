import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 glass-card p-10 rounded-[2.5rem] shadow-xl"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Legalize<span className="text-primary">AI</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start simplifying legal documents today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-slate-600">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="font-bold text-primary hover:text-primary-dark">
              Terms of Service
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
