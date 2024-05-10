import { db } from '../../db';
import { Request } from 'express';
import { isEmailTokenValid } from '../../utils/jwt';
import { BadRequestError } from '../../lib/errors';

const get = async () => {
  const users = await db.user.findMany({
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

  const activeSessionsPastWeekPromise = db.user.groupBy({
    by: ['lastActive'],
    where: {
      isVerified: true,
      lastActive: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    _count: {
      lastActive: true,
    },
  });

  // Execute all promises concurrently
  const [totalUsers, activeSessionsToday, activeSessionsPastWeek] = await Promise.all([totalUsersPromise, activeSessionsTodayPromise, activeSessionsPastWeekPromise]);

  // Calculate the average active users over the last 7 days
  let totalActiveDays = 0;
  activeSessionsPastWeek.forEach((day) => {
    totalActiveDays += day._count.lastActive || 0;
  });
  const averageActiveUsersLast7Days = totalActiveDays / 7;

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
