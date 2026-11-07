import { useState, useRef, useCallback, useEffect } from 'react';
import type { NumberColumnDefinition } from '@sankhyatronics/apiclient';

interface UseFieldDefinitionProps {
  calculateFieldDefinition: (name: string) => Promise<NumberColumnDefinition | null>;
}

interface UseFieldDefinitionReturn {
  calculatedFieldDefinition: NumberColumnDefinition | null;
  createdFieldDefinition: NumberColumnDefinition | null;
  isCalculating: boolean;
  showFieldPreview: boolean;
  setShowFieldPreview: (show: boolean) => void;
  setCreatedFieldDefinition: (def: NumberColumnDefinition | null) => void;
  calculateField: (name: string, delay?: number) => void;
  calculateFieldImmediate: (name: string) => Promise<NumberColumnDefinition | null>;
  reset: () => void;
}

/**
 * Hook for managing field definition calculation with debouncing
 */
export function useFieldDefinition({
  calculateFieldDefinition,
}: UseFieldDefinitionProps): UseFieldDefinitionReturn {
  const [calculatedFieldDefinition, setCalculatedFieldDefinition] = useState<NumberColumnDefinition | null>(null);
  const [createdFieldDefinition, setCreatedFieldDefinition] = useState<NumberColumnDefinition | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFieldPreview, setShowFieldPreview] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateFieldImmediate = useCallback(async (name: string): Promise<NumberColumnDefinition | null> => {
    if (!name.trim()) return null;
    
    setIsCalculating(true);
    try {
      const fieldDef = await calculateFieldDefinition(name);
      if (fieldDef) {
        setCalculatedFieldDefinition(fieldDef);
        setShowFieldPreview(true);
      }
      return fieldDef;
    } finally {
      setIsCalculating(false);
    }
  }, [calculateFieldDefinition]);

  const calculateField = useCallback((name: string, delay = 500) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!name.trim()) {
      setCalculatedFieldDefinition(null);
      setShowFieldPreview(false);
      return;
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await calculateFieldImmediate(name);
    }, delay);
  }, [calculateFieldImmediate]);

  const reset = useCallback(() => {
    setCalculatedFieldDefinition(null);
    setCreatedFieldDefinition(null);
    setShowFieldPreview(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    calculatedFieldDefinition,
    createdFieldDefinition,
    isCalculating,
    showFieldPreview,
    setShowFieldPreview,
    setCreatedFieldDefinition,
    calculateField,
    calculateFieldImmediate,
    reset,
  };
}
