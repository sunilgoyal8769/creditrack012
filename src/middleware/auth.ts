import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { verifyToken, AuthTokenPayload } from '../../server/auth.js';
import { db as dbInstance } from '../../server/db.js';

export interface AuthRequest extends Request {
  user?: (DecodedIdToken | AuthTokenPayload) & {
    userId?: string;
    businessId?: string;
    role?: 'OWNER' | 'STAFF';
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  // 1. Try local JWT token verification
  const jwtPayload = verifyToken(token);
  if (jwtPayload && jwtPayload.userId && jwtPayload.businessId) {
    req.user = jwtPayload;
    return next();
  }

  // 2. Try Firebase ID Token verification
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized: Email required in token' });
    }

    let user = await dbInstance.findUserByEmail(email);
    let business = null;

    if (!user) {
      const result = await dbInstance.createUser({
        name: decodedToken.name || email.split('@')[0],
        email,
        passwordHash: '',
        businessName: `${decodedToken.name || email.split('@')[0]}'s Store`,
        phone: 'Not Specified',
        businessType: 'General Retail Store',
      });
      user = result.user;
      business = result.business;
    } else {
      business = await dbInstance.getBusinessByOwnerId(user.id);
    }

    req.user = {
      ...decodedToken,
      userId: user.id,
      email: user.email,
      businessId: business ? business.id : (user.business_id || ''),
      role: (user.role || 'OWNER') as 'OWNER' | 'STAFF',
    };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
