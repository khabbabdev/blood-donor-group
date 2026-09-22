import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await login(data.identifier, data.password);
      toast.success("সফলভাবে লগইন হয়েছে");
      navigate(`/dashboard/${res.user.role}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "লগইন ব্যর্থ হয়েছে। ইমেইল বা মোবাইল নাম্বার ভুল।";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/50 text-primary-600 rounded-full flex items-center justify-center text-3xl mb-4">
            🩸
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            লগইন করুন
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 relative z-10"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ইমেইল / মোবাইল নাম্বার
            </label>
            <input
              {...register("identifier")}
              type="text"
              className="input-field"
              placeholder="example@email.com অথবা 017XXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 focus:outline-none"
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                }
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-lg">
            লগইন
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
