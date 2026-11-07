import * as React from 'react';
import { Spinner } from '@fluentui/react-components';
import { IGuardProps } from '../../common/Interfaces';

export const Guard: React.FC<IGuardProps> = ({ strings, configValid, loading, error, children }) => {
  if (!configValid) return <div>{strings.pendingMessage}</div>;
  if (loading) return <Spinner size="large" />;
  if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>;
  return <>{children}</>;
};
