
import React from 'react';

interface TestNameMenuProps {
  usersList: string[];
  currentActiveUser: string;
  switchUser: (username: string) => void;
  handleCreateUser: (username: string) => void;
}

export const TestNameMenu: React.FC<TestNameMenuProps> = ({
  usersList,
  currentActiveUser,
  switchUser,
  handleCreateUser
}) => {
  // This component is currently not being used in the main interface
  // It's kept for future implementation when needed
  return null;
};
