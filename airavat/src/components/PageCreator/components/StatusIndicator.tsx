import React from 'react';
import { tokens } from '@fluentui/react-components';
import {
  CheckmarkRegular,
  InfoRegular,
  ErrorCircleRegular,
  WarningRegular,
} from '@fluentui/react-icons';
import type { ILanguageContent } from '../../../common/Interfaces';

export interface StatusInfo {
  icon: React.ReactNode;
  color: string;
  message: string;
}

interface StatusIndicatorProps {
  status: StatusInfo | null;
  className?: string;
  iconClassName?: string;
}

/**
 * Get status info based on current form state
 */
export function getStatusInfo(
  hasTitle: boolean,
  nameStatus: boolean | null,
  hasSelectedPage: boolean,
  strings: ILanguageContent
): StatusInfo | null {
  if (!hasTitle) {
    return {
      icon: <InfoRegular />,
      color: tokens.colorNeutralForeground2,
      message: strings.PageTitleInfo,
    };
  }

  if (nameStatus === true) {
    return {
      icon: <ErrorCircleRegular />,
      color: tokens.colorPaletteRedForeground1,
      message: strings.PageExist,
    };
  }

  if (nameStatus === false && !hasSelectedPage) {
    return {
      icon: <WarningRegular />,
      color: tokens.colorPaletteYellowForeground1,
      message: strings.SelectTemplate,
    };
  }

  if (nameStatus === false && hasSelectedPage) {
    return {
      icon: <CheckmarkRegular />,
      color: tokens.colorPaletteGreenForeground1,
      message: strings.ReadyToCreate,
    };
  }

  return null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  className,
  iconClassName,
}) => {
  if (!status) return null;

  return (
    <div className={className}>
      <span className={iconClassName} style={{ color: status.color }}>
        {status.icon}
      </span>
      <span style={{ color: status.color }}>{status.message}</span>
    </div>
  );
};

export default StatusIndicator;
