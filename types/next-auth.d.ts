import { UserRole } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    id?: string;
  }
}
