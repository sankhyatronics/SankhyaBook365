import React from 'react';
import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

interface AlertMessagesProps {
  error: string | null;
  success: string | null;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

export const AlertMessages: React.FC<AlertMessagesProps> = ({
  error,
  success,
  onDismissError,
  onDismissSuccess,
}) => {
  return (
    <>
      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error}</MessageBarBody>
          <MessageBarActions
            containerAction={
              <Button
                appearance="transparent"
                icon={<DismissRegular />}
                onClick={onDismissError}
              />
            }
          />
        </MessageBar>
      )}
      {success && (
        <MessageBar intent="success">
          <MessageBarBody>{success}</MessageBarBody>
          <MessageBarActions
            containerAction={
              <Button
                appearance="transparent"
                icon={<DismissRegular />}
                onClick={onDismissSuccess}
              />
            }
          />
        </MessageBar>
      )}
    </>
  );
};

export default AlertMessages;
