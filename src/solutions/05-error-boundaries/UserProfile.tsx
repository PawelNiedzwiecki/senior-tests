import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserProfileProps {
  userId: number;
  shouldFail?: boolean;
}

// Simulated API call
const fetchUser = async (userId: number, shouldFail: boolean): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate random failures for demonstration
  if (shouldFail) {
    throw new Error(`Failed to fetch user ${userId}: Network error`);
  }

  // Return mock user data
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar: '👤',
    role: userId % 2 === 0 ? 'Admin' : 'User',
  };
};

export const UserProfile = ({ userId, shouldFail = false }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = await fetchUser(userId, shouldFail);

        if (mounted) {
          setUser(userData);
        }
      } catch (err) {
        if (mounted) {
          // SOLUTION 1: Throw the error to be caught by the Error Boundary
          // This propagates the error up to the nearest Error Boundary
          throw err;
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [userId, shouldFail]);

  // SOLUTION 2: Implement loading state UI
  if (loading) {
    return (
      <div className="loading-profile">
        <div className="loading-avatar" />
        <div className="loading-info">
          <div className="loading-line" />
          <div className="loading-line" />
          <div className="loading-line" />
        </div>
      </div>
    );
  }

  // SOLUTION 3: Implement error state UI (for component-level handling)
  if (error) {
    return (
      <div className="inline-error">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="avatar">{user.avatar}</div>
      <div className="user-info">
        <h3>{user.name}</h3>
        <p className="email">{user.email}</p>
        <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
      </div>
    </div>
  );
};

export default UserProfile;
