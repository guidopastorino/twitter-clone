import ProfileLayout from '@/components/ProfileLayout';
import React from 'react';

type Props = {
  children: React.ReactNode;
  params: { username: string };
};

const Layout: React.FC<Props> = ({ children, params }) => {
  return (
    <div>
      <ProfileLayout username={params.username} />
      {/* tabs */}
      {children}
    </div>
  );
};

export default Layout;
