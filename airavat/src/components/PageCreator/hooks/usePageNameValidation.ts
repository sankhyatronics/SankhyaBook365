import { useState, useCallback, useEffect } from 'react';
import type { PageBasics } from '@sankhyatronics/apiclient';

interface UsePageNameValidationProps {
  checkPageName: (name: string) => Promise<boolean>;
  selectedPage: PageBasics | null;
  debounceMs?: number;
}

interface UsePageNameValidationReturn {
  nameStatus: boolean | null;
  isCheckingName: boolean;
  checkName: (name: string) => void;
}

/**
 * Hook for validating page name availability with debouncing
 */
export function usePageNameValidation({
  checkPageName,
  selectedPage,
  debounceMs = 500,
}: UsePageNameValidationProps): UsePageNameValidationReturn {
  const [nameStatus, setNameStatus] = useState<boolean | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [pendingName, setPendingName] = useState<string>('');

  useEffect(() => {
    if (!pendingName.trim()) {
      setNameStatus(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (pendingName !== selectedPage?.title) {
        setIsCheckingName(true);
        try {
          const exists = await checkPageName(pendingName);
          setNameStatus(exists);
        } finally {
          setIsCheckingName(false);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [pendingName, selectedPage?.title, checkPageName, debounceMs]);

  const checkName = useCallback((name: string) => {
    setPendingName(name);
  }, []);

  return {
    nameStatus,
    isCheckingName,
    checkName,
  };
}
