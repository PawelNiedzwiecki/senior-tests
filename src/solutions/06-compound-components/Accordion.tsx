import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import './Accordion.css';

// Types
interface AccordionContextType {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

interface AccordionItemContextType {
  id: string;
  isExpanded: boolean;
}

// SOLUTION 1: Create the AccordionContext
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// SOLUTION 2: Create the AccordionItemContext
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

// SOLUTION 3: Create useAccordion hook
const useAccordion = (): AccordionContextType => {
  const context = useContext(AccordionContext);

  if (context === undefined) {
    throw new Error('useAccordion must be used within an Accordion component');
  }

  return context;
};

// SOLUTION 4: Create useAccordionItem hook
const useAccordionItem = (): AccordionItemContextType => {
  const context = useContext(AccordionItemContext);

  if (context === undefined) {
    throw new Error('useAccordionItem must be used within an Accordion.Item component');
  }

  return context;
};

// Accordion Props
interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

// SOLUTION 5: Implement the Accordion component
const AccordionComponent = ({
  children,
  allowMultiple = false,
  defaultExpanded = [],
}: AccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  // Toggle item expansion
  const toggleItem = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        // Item is expanded, collapse it
        next.delete(id);
      } else {
        // Item is collapsed, expand it
        if (!allowMultiple) {
          // In single mode, clear all other items
          next.clear();
        }
        next.add(id);
      }

      return next;
    });
  }, [allowMultiple]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      expandedItems,
      toggleItem,
      allowMultiple,
    }),
    [expandedItems, toggleItem, allowMultiple]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

// AccordionItem Props
interface AccordionItemProps {
  children: ReactNode;
  id: string;
}

// SOLUTION 6: Implement the AccordionItem component
const AccordionItem = ({ children, id }: AccordionItemProps) => {
  const { expandedItems } = useAccordion();
  const isExpanded = expandedItems.has(id);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      id,
      isExpanded,
    }),
    [id, isExpanded]
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// AccordionHeader Props
interface AccordionHeaderProps {
  children: ReactNode;
}

// SOLUTION 7: Implement the AccordionHeader component
const AccordionHeader = ({ children }: AccordionHeaderProps) => {
  const { toggleItem } = useAccordion();
  const { id, isExpanded } = useAccordionItem();

  const handleClick = useCallback(() => {
    toggleItem(id);
  }, [toggleItem, id]);

  return (
    <button
      className="accordion-header"
      onClick={handleClick}
      aria-expanded={isExpanded}
      aria-controls={`panel-${id}`}
    >
      <span>{children}</span>
      <span className={`accordion-icon ${isExpanded ? 'expanded' : ''}`}>
        ▼
      </span>
    </button>
  );
};

// AccordionPanel Props
interface AccordionPanelProps {
  children: ReactNode;
}

// SOLUTION 8: Implement the AccordionPanel component
const AccordionPanel = ({ children }: AccordionPanelProps) => {
  const { id, isExpanded } = useAccordionItem();

  return (
    <div
      className={`accordion-panel ${isExpanded ? 'expanded' : ''}`}
      id={`panel-${id}`}
      role="region"
      aria-hidden={!isExpanded}
    >
      <div className="accordion-panel-content">{children}</div>
    </div>
  );
};

// SOLUTION 9: Create the compound component
export const Accordion = Object.assign(AccordionComponent, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Panel: AccordionPanel,
});

export default Accordion;
