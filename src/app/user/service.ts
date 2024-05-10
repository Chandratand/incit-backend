import { db } from '../../db';
import { Request } from 'express';
import { isEmailTokenValid } from '../../utils/jwt';
import { BadRequestError } from '../../lib/errors';

const get = async () => {
  const users = await db.user.findMany({
    where: {
      isVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      signUpAt: true,
      logInCount: true,
      logOutAt: true,
    },
  });
  return users;
};

const stats = async () => {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // Set to start of today
  const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 6));

  // Prepare all promises for the queries
  const totalUsersPromise = db.user.count({
    where: {
      isVerified: true,
    },
  });

  const activeSessionsTodayPromise = db.user.count({
    where: {
      isVerified: true,
      lastActive: {
        gte: startOfToday,
      },
    },
  });

  const activeSessionsPastWeekPromise = db.user.count({
    where: {
      isVerified: true,
      lastActive: {
        gte: sevenDaysAgo,
        lte: new Date(),
      },
    },
  });

  // Execute all promises concurrently
  const [totalUsers, activeSessionsToday, activeSessionsPastWeek] = await Promise.all([totalUsersPromise, activeSessionsTodayPromise, activeSessionsPastWeekPromise]);

  console.log('activeSessionsPastWeek', activeSessionsPastWeek);

  const averageActiveUsersLast7Days = Math.round((activeSessionsPastWeek / 7) * 100) / 100;

  // Return the results
  return {
    totalSignedUpUsers: totalUsers,
    todaysActiveUsers: activeSessionsToday,
    avgActiveUsers: averageActiveUsersLast7Days,
  };
};

const verifyEmail = async (req: Request) => {
  const token = req.query.token as string;
  if (!token) throw new BadRequestError('Invalid TOken');
  const checkToken = isEmailTokenValid(token);
  if (!checkToken) throw new BadRequestError('Verification Fail');
  await db.user.update({
    where: {
      email: checkToken.email,
    },
    data: {
      isVerified: true,
    },
  });

  return true;
};

const UserService = {
  get,
  stats,
  verifyEmail,
};

export default UserService;
