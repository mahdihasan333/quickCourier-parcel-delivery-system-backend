import bcryptjs from 'bcryptjs';
import { User } from '../modules/user/user.model';
import { envVars } from '../config/env';
import { Role, IAuthProvider } from '../modules/user/user.interface';

export const seedSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ email: 'superadmin@example.com' });
    if (!superAdminExists) {
      const hashedPassword = await bcryptjs.hash('SuperAdmin123!', Number(envVars.BCRYPT_SALT_ROUND));
      const authProvider: IAuthProvider = { provider: 'credentials', providerId: 'superadmin@example.com' };
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isActive: 'ACTIVE',
        isVerified: true,
        auths: [authProvider],
      });
      console.log('Super Admin seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};