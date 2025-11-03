'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        alert(locale === 'ar' ? 'خطأ في تسجيل الدخول' : 'Sign in error');
      } else {
        router.push(`/${locale}/my-trips`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert(locale === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading 
                  ? (locale === 'ar' ? 'جاري التحميل...' : 'Loading...') 
                  : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
              </Button>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {locale === 'ar' ? 'حساب تجريبي:' : 'Demo Account:'}
                </p>
                <p className="text-sm"><strong>Email:</strong> admin@yoright.com</p>
                <p className="text-sm"><strong>Password:</strong> admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
