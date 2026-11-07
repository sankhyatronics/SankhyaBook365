import { useState, useCallback } from 'react';
import type { NumberColumnDefinition } from '@sankhyatronics/apiclient';
import type { ILanguageContent } from '../../../common/Interfaces';

interface SiteInfo {
  webUrl: string;
  listId?: string;
  siteTitle?: string;
}

interface UseCreateViewProps {
  api: {
    sites: {
      resolveSharePointIds: (webUrl: string) => Promise<{ siteId: string }>;
    };
    columns: {
      createListColumn: (siteId: string, listId: string, fieldDef: NumberColumnDefinition, enforceUnique: boolean) => Promise<unknown>;
    };
  };
  sitesInfo: SiteInfo[];
  onCreateSuccess?: (fieldDef: NumberColumnDefinition) => void;
  onDismiss: () => void;
  strings: ILanguageContent;
}

interface UseCreateViewReturn {
  isCreating: boolean;
  error: string | null;
  success: string | null;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  createView: (viewName: string, calculatedFieldDefinition: NumberColumnDefinition | null) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing view creation across multiple sites
 */
export function useCreateView({
  api,
  sitesInfo,
  onCreateSuccess,
  onDismiss,
  strings,
}: UseCreateViewProps): UseCreateViewReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createView = useCallback(async (
    viewName: string,
    calculatedFieldDefinition: NumberColumnDefinition | null
  ) => {
    if (!viewName.trim()) {
      setError('View name is required');
      return;
    }
    if (sitesInfo.length === 0) {
      setError('No sites configured.');
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const results = await Promise.allSettled(
        sitesInfo.map(async (site) => {
          const { siteId } = await api.sites.resolveSharePointIds(site.webUrl);
          if (!site.listId) throw new Error('listId is undefined');
          await api.columns.createListColumn(siteId, site.listId, calculatedFieldDefinition!, true);
          return { site: site.webUrl, success: true };
        })
      );

      const failures = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
      
      if (failures.length > 0) {
        if (failures.length === sitesInfo.length) {
          throw new Error('Failed to create view in all sites');
        } else {
          setSuccess(`View created in ${sitesInfo.length - failures.length} out of ${sitesInfo.length} sites.`);
          if (onCreateSuccess && calculatedFieldDefinition) {
            onCreateSuccess(calculatedFieldDefinition);
          }
        }
      } else {
        setSuccess(strings.ViewCreatedSuccess);
        if (onCreateSuccess && calculatedFieldDefinition) {
          onCreateSuccess(calculatedFieldDefinition);
        }
      }

      setTimeout(() => {
        onDismiss();
        reset();
      }, 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to create view');
    } finally {
      setIsCreating(false);
    }
  }, [api, sitesInfo, onCreateSuccess, onDismiss, strings]);

  const reset = useCallback(() => {
    setIsCreating(false);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    isCreating,
    error,
    success,
    setError,
    setSuccess,
    createView,
    reset,
  };
}
