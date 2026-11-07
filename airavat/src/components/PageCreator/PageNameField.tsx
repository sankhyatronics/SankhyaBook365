import * as React from 'react';
import { Input, mergeClasses } from '@fluentui/react-components';
import { CircleRegular, ArrowSyncRegular, ErrorCircleRegular, CheckmarkRegular } from '@fluentui/react-icons';
import { ILanguageContent } from '../../common/Interfaces';
import { useHandbookStyles } from '../../common/Styles';

export type NameStatus = 'unchecked' | 'checking' | 'exists' | 'available';

export interface IPageNameFieldProps {
  value: string;
  strings: ILanguageContent;
  onChange: (value: string) => void;
  checkPageName: (name: string) => Promise<boolean>;
  debounceMs?: number;
  isChecking?: boolean;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const statusConfig = (strings: ILanguageContent): Record<NameStatus, { icon: React.ReactElement; color: string; label: string }> => ({
  unchecked: { icon: <CircleRegular />, color: '#605e5c', label: '' },
  checking: { icon: <ArrowSyncRegular style={{ animation: 'spin 1s linear infinite' }} />, color: '#0078d4', label: strings.Checking },
  exists: { icon: <ErrorCircleRegular />, color: '#a4262c', label: strings.NameExists },
  available: { icon: <CheckmarkRegular />, color: '#107c10', label: strings.NameAvailable },
});

export const PageNameField: React.FC<IPageNameFieldProps> = ({
  value,
  strings,
  onChange,
  checkPageName,
  debounceMs = 350,
  isChecking = false,
  error = false,
  disabled = false,
  required = true,
}) => {
  const classes = useHandbookStyles();
  const [status, setStatus] = React.useState<NameStatus>('unchecked');
  const [announcement, setAnnouncement] = React.useState('');
  const lastCheckRef = React.useRef<string>('');
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const config = statusConfig(strings);

  React.useEffect(() => {
    if (isChecking) { setStatus('checking'); return; }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const trimmedValue = value.trim();
    if (!trimmedValue) { setStatus('unchecked'); setAnnouncement(''); lastCheckRef.current = ''; return; }
    if (trimmedValue === lastCheckRef.current) return;
    setStatus('checking');
    timeoutRef.current = setTimeout(async () => {
      try {
        const exists = await checkPageName(trimmedValue);
        lastCheckRef.current = trimmedValue;
        setStatus(exists ? 'exists' : 'available');
        if (exists) setAnnouncement(strings.PageExist);
      } catch {
        setStatus('unchecked');
      }
    }, debounceMs);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [value, checkPageName, debounceMs, isChecking, strings]);

  React.useEffect(() => { if (error) setStatus('exists'); }, [error]);

  const currentStatus = config[status];
  const hasError = status === 'exists';

  const contentAfter = status !== 'unchecked' ? (
    <span style={{ color: currentStatus.color, display: 'flex', alignItems: 'center' }}>
      {currentStatus.icon}
    </span>
  ) : undefined;

  return (
    <div className={classes.col}>
      <Input
        value={value}
        onChange={(_, data) => onChange(data.value)}
        contentAfter={contentAfter}
        disabled={disabled}
        required={required}
        style={{
          width: '100%',
          borderColor: hasError ? '#a4262c' : undefined,
        }}
      />
      {hasError && (
        <span style={{ color: '#a4262c', fontSize: '12px', marginTop: '4px' }}>
          {currentStatus.label}
        </span>
      )}

      <div
        aria-live="polite"
        aria-atomic="true"
        className={mergeClasses(classes.srOnly)}
      >
        {announcement}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
