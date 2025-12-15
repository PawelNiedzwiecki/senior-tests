import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
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

// TODO 1: Create the AccordionContext
// This context shares state between all accordion components
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// TODO 2: Create the AccordionItemContext
// This context provides the item's id and expanded state to Header and Panel
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

// TODO 3: Create useAccordion hook
// Should throw error if used outside AccordionContext
const useAccordion = (): AccordionContextType => {
  const context = useContext(AccordionContext);
  // YOUR CODE HERE
  return context!;
};

// TODO 4: Create useAccordionItem hook
const useAccordionItem = (): AccordionItemContextType => {
  const context = useContext(AccordionItemContext);
  // YOUR CODE HERE
  return context!;
};

// Accordion Props
interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

// TODO 5: Implement the Accordion component
// - Should manage the expanded items state
// - Should provide context to children
// - Should handle both single and multiple expansion modes
const AccordionComponent = ({
  children,
  allowMultiple = false,
  defaultExpanded = [],
}: AccordionProps) => {
  // Create state for expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  // TODO: Implement toggleItem function
  // - If allowMultiple is false, only one item should be expanded at a time
  // - If allowMultiple is true, multiple items can be expanded
  const toggleItem = useCallback((id: string) => {
    // YOUR CODE HERE
  }, [allowMultiple]);

  // TODO: Create the context value (consider memoizing)

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

// AccordionItem Props
interface AccordionItemProps {
  children: ReactNode;
  id: string;
}

// TODO 6: Implement the AccordionItem component
// - Should provide its id and expanded state to children via context
const AccordionItem = ({ children, id }: AccordionItemProps) => {
  const { expandedItems } = useAccordion();
  const isExpanded = expandedItems.has(id);

  // YOUR CODE HERE - Provide context to children

  return (
    <div className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
      {children}
    </div>
  );
};

// AccordionHeader Props
interface AccordionHeaderProps {
  children: ReactNode;
}

// TODO 7: Implement the AccordionHeader component
// - Should toggle its parent item when clicked
// - Should show expand/collapse indicator
const AccordionHeader = ({ children }: AccordionHeaderProps) => {
  const { toggleItem } = useAccordion();
  const { id, isExpanded } = useAccordionItem();

  // YOUR CODE HERE - Implement click handler

  return (
    <button
      className="accordion-header"
      onClick={() => {
        // YOUR CODE HERE
      }}
      aria-expanded={isExpanded}
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

// TODO 8: Implement the AccordionPanel component
// - Should only show content when its parent item is expanded
// - Should animate the expand/collapse
const AccordionPanel = ({ children }: AccordionPanelProps) => {
  const { isExpanded } = useAccordionItem();

  // YOUR CODE HERE - Conditionally render content

  return (
    <div className={`accordion-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="accordion-panel-content">{children}</div>
    </div>
  );
};

// TODO 9: Create the compound component by attaching sub-components
// Example: Accordion.Item = AccordionItem
export const Accordion = Object.assign(AccordionComponent, {
  // YOUR CODE HERE - Attach Item, Header, Panel
});

export default Accordion;
