import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface SignUpProps {
  lang: Language;
}

const countryCodes = [
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+973', country: 'BH', flag: '🇧🇭' },
  { code: '+965', country: 'KW', flag: '🇰🇼' },
  { code: '+968', country: 'OM', flag: '🇴🇲' },
  { code: '+974', country: 'QA', flag: '🇶🇦' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+962', country: 'JO', flag: '🇯🇴' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
];

const SignUp: React.FC<SignUpProps> = ({ lang }) => {
  const isArabic = lang === Language.AR;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: isArabic ? 'ضعيفة' : 'Weak', color: 'bg-error-500' };
    if (score <= 4) return { level: 2, label: isArabic ? 'متوسطة' : 'Medium', color: 'bg-gold-500' };
    return { level: 3, label: isArabic ? 'قوية' : 'Strong', color: 'bg-success-500' };
  }, [password, isArabic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const selectedCountry = countryCodes.find(c => c.code === countryCode);

  const texts = {
    createAccount: isArabic ? 'إنشاء حساب' : 'Create Account',
    subtitle: isArabic 
      ? 'انضم إلينا واستمتع بتجربة حجز فاخرة' 
      : 'Join us and enjoy a luxury booking experience',
    fullName: isArabic ? 'الاسم الكامل' : 'Full Name',
    fullNamePlaceholder: isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    emailPlaceholder: isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    phone: isArabic ? 'رقم الهاتف' : 'Phone Number',
    phonePlaceholder: isArabic ? 'أدخل رقم الهاتف' : 'Enter phone number',
    password: isArabic ? 'كلمة المرور' : 'Password',
    passwordPlaceholder: isArabic ? 'أنشئ كلمة مرور قوية' : 'Create a strong password',
    confirmPassword: isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
    confirmPasswordPlaceholder: isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter your password',
    agreeToTerms: isArabic ? 'أوافق على' : 'I agree to the',
    termsAndConditions: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
    and: isArabic ? 'و' : 'and',
    privacyPolicy: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
    createAccountBtn: isArabic ? 'إنشاء الحساب' : 'Create Account',
    orContinueWith: isArabic ? 'أو تابع باستخدام' : 'or continue with',
    haveAccount: isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    signIn: isArabic ? 'تسجيل الدخول' : 'Sign In',
    heroText: isArabic 
      ? 'رحلتك نحو الفخامة تبدأ هنا' 
      : 'Your journey to luxury starts here',
    passwordStrength: isArabic ? 'قوة كلمة المرور:' : 'Password strength:',
  };

  return (
    <div className={`min-h-screen flex ${isArabic ? 'font-arabic' : 'font-sans'}`}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://picsum.photos/id/164/1200/1600" 
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gold-500/10" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 pb-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-xl font-bold">Y</span>
              </div>
              <span className="text-white font-display text-2xl tracking-wide">YoRight</span>
            </div>
            <h2 className="font-display text-4xl text-white mb-4 leading-tight">
              {texts.heroText}
            </h2>
            <p className="text-cream-200 text-lg opacity-90">
              {isArabic 
                ? 'آلاف الفنادق الفاخرة في انتظارك حول العالم'
                : 'Thousands of luxury hotels await you around the world'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 right-12 flex gap-2">
          <div className="w-8 h-1 rounded-full bg-white/30" />
          <div className="w-8 h-1 rounded-full bg-gold-500" />
          <div className="w-8 h-1 rounded-full bg-white/30" />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-cream-50">
        <div className="lg:hidden relative h-40 overflow-hidden">
          <img 
            src="https://picsum.photos/id/164/800/400" 
            alt="Luxury Hotel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 to-charcoal-950/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-lg font-bold">Y</span>
              </div>
              <span className="text-white font-display text-xl tracking-wide">YoRight</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md py-4">
            <div className="hidden lg:flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-charcoal-950 font-display text-lg font-bold">Y</span>
              </div>
              <span className="text-charcoal-900 font-display text-xl tracking-wide">YoRight</span>
            </div>

            <div className="mb-6">
              <h1 className="font-display text-3xl lg:text-4xl text-charcoal-900 mb-2">
                {texts.createAccount}
              </h1>
              <p className="text-charcoal-500">
                {texts.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label={texts.fullName}
                placeholder={texts.fullNamePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<i className="fas fa-user text-lg" />}
                required
              />

              <Input
                type="email"
                label={texts.email}
                placeholder={texts.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<i className="fas fa-envelope text-lg" />}
                required
              />

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  {texts.phone}
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-4 py-3.5 border-2 border-charcoal-200 rounded-2xl hover:border-charcoal-300 bg-white transition-all min-w-[100px]"
                    >
                      <span className="text-xl">{selectedCountry?.flag}</span>
                      <span className="text-charcoal-700 font-medium">{countryCode}</span>
                      <i className="fas fa-chevron-down text-xs text-charcoal-400" />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full mt-2 w-48 bg-white border-2 border-charcoal-100 rounded-2xl shadow-luxury-lg z-50 overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.code);
                                setShowCountryDropdown(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-100 transition-colors ${
                                countryCode === country.code ? 'bg-gold-50' : ''
                              }`}
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span className="text-charcoal-700">{country.code}</span>
                              <span className="text-charcoal-400 text-sm">{country.country}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={texts.phonePlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-charcoal-200 focus:border-gold-500 hover:border-charcoal-300 transition-all text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
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
                
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-charcoal-500">{texts.passwordStrength}</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.level === 1 ? 'text-error-500' :
                        passwordStrength.level === 2 ? 'text-gold-600' : 'text-success-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength.level ? passwordStrength.color : 'bg-charcoal-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label={texts.confirmPassword}
                placeholder={texts.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<i className="fas fa-lock text-lg" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-charcoal-400 hover:text-charcoal-600 transition-colors"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`} />
                  </button>
                }
                error={confirmPassword && password !== confirmPassword 
                  ? (isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
                  : undefined
                }
                required
              />

              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="sr-only peer"
                    required
                  />
                  <div className="w-5 h-5 border-2 border-charcoal-300 rounded-md peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-all group-hover:border-charcoal-400">
                    {agreeToTerms && (
                      <i className="fas fa-check text-xs text-charcoal-950 absolute inset-0 flex items-center justify-center" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-charcoal-600 leading-relaxed">
                  {texts.agreeToTerms}{' '}
                  <Link to="/terms" className="text-gold-600 hover:text-gold-700 font-medium">
                    {texts.termsAndConditions}
                  </Link>
                  {' '}{texts.and}{' '}
                  <Link to="/privacy" className="text-gold-600 hover:text-gold-700 font-medium">
                    {texts.privacyPolicy}
                  </Link>
                </span>
              </label>

              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                loading={loading}
                disabled={!agreeToTerms || (confirmPassword !== '' && password !== confirmPassword)}
                className="mt-4"
              >
                {texts.createAccountBtn}
              </Button>
            </form>

            <div className="relative my-6">
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
                <span className="font-medium text-charcoal-700">Google</span>
              </button>

              <button className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-charcoal-200 rounded-2xl hover:border-charcoal-300 hover:bg-white transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-medium text-charcoal-700">Apple</span>
              </button>
            </div>

            <p className="text-center mt-6 text-charcoal-500">
              {texts.haveAccount}{' '}
              <Link 
                to="/login" 
                className="text-gold-600 hover:text-gold-700 font-semibold transition-colors"
              >
                {texts.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
