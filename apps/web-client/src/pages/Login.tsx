import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';

interface LoginProps {
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ lang }) => {
  const isArabic = lang === Language.AR;
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem('yoright_token', response.token);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (isArabic ? 'فشل تسجيل الدخول' : 'Login failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const texts = {
    welcomeBack: isArabic ? 'مرحباً بعودتك' : 'Welcome Back',
    subtitle: isArabic 
      ? 'سجل دخولك لاستكشاف أفضل الفنادق الفاخرة' 
      : 'Sign in to explore the finest luxury hotels',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    emailPlaceholder: isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    password: isArabic ? 'كلمة المرور' : 'Password',
    passwordPlaceholder: isArabic ? 'أدخل كلمة المرور' : 'Enter your password',
    rememberMe: isArabic ? 'تذكرني' : 'Remember me',
    forgotPassword: isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?',
    signIn: isArabic ? 'تسجيل الدخول' : 'Sign In',
    orContinueWith: isArabic ? 'أو تابع باستخدام' : 'or continue with',
    continueWithGoogle: isArabic ? 'Google' : 'Google',
    continueWithApple: isArabic ? 'Apple' : 'Apple',
    noAccount: isArabic ? 'ليس لديك حساب؟' : "Don't have an account?",
    signUp: isArabic ? 'إنشاء حساب' : 'Sign Up',
    heroText: isArabic 
      ? 'اكتشف أرقى الفنادق في العالم' 
      : 'Discover the finest hotels in the world',
  };

  return (
    <div className={`min-h-screen flex ${isArabic ? 'font-arabic' : 'font-sans'}`}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://picsum.photos/id/1035/1200/1600" 
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/40 to-transparent" />
        <div className="absolute inset-0 bg-brand-800/10" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 pb-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-xl font-bold">Y</span>
              </div>
              <span className="text-white font-display text-2xl tracking-wide">YoRight</span>
            </div>
            <h2 className="font-display text-4xl text-white mb-4 leading-tight">
              {texts.heroText}
            </h2>
            <p className="text-cream-200 text-lg opacity-90">
              {isArabic 
                ? 'تجربة حجز فندقي استثنائية مصممة خصيصاً لك'
                : 'An exceptional hotel booking experience tailored just for you'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 right-12 flex gap-2">
          <div className="w-8 h-1 rounded-full bg-brand-800" />
          <div className="w-8 h-1 rounded-full bg-white/30" />
          <div className="w-8 h-1 rounded-full bg-white/30" />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-cream-50">
        <div className="lg:hidden relative h-48 overflow-hidden">
          <img 
            src="https://picsum.photos/id/1035/800/400" 
            alt="Luxury Hotel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 to-charcoal-950/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-lg font-bold">Y</span>
              </div>
              <span className="text-white font-display text-xl tracking-wide">YoRight</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="hidden lg:flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-lg font-bold">Y</span>
              </div>
              <span className="text-charcoal-900 font-display text-xl tracking-wide">YoRight</span>
            </div>

            <div className="mb-8">
              <h1 className="font-display text-3xl lg:text-4xl text-charcoal-900 mb-2">
                {texts.welcomeBack}
              </h1>
              <p className="text-charcoal-500">
                {texts.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-error-50 border border-error-200">
                  <p className="text-error-700 text-sm flex items-center gap-2">
                    <i className="fas fa-exclamation-circle" />
                    {error}
                  </p>
                </div>
              )}

              <Input
                type="email"
                label={texts.email}
                placeholder={texts.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<i className="fas fa-envelope text-lg" />}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label={texts.password}
                  placeholder={texts.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<i className="fas fa-lock text-lg" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-charcoal-400 hover:text-charcoal-600 transition-colors"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`} />
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-charcoal-300 rounded-md peer-checked:bg-brand-800 peer-checked:border-brand-800 transition-all group-hover:border-charcoal-400">
                      {rememberMe && (
                        <i className="fas fa-check text-xs text-charcoal-950 absolute inset-0 flex items-center justify-center" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-charcoal-600">{texts.rememberMe}</span>
                </label>

                <Link 
                  to="/forgot-password" 
                  className="text-sm text-brand-900 hover:text-brand-950 font-medium transition-colors"
                >
                  {texts.forgotPassword}
                </Link>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                loading={loading}
                className="mt-6"
              >
                {texts.signIn}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-charcoal-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream-50 text-charcoal-400">
                  {texts.orContinueWith}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-charcoal-200 rounded-2xl hover:border-charcoal-300 hover:bg-white transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-charcoal-700">{texts.continueWithGoogle}</span>
              </button>

              <button className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-charcoal-200 rounded-2xl hover:border-charcoal-300 hover:bg-white transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-medium text-charcoal-700">{texts.continueWithApple}</span>
              </button>
            </div>

            <p className="text-center mt-8 text-charcoal-500">
              {texts.noAccount}{' '}
              <Link 
                to="/signup" 
                className="text-brand-900 hover:text-brand-950 font-semibold transition-colors"
              >
                {texts.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
