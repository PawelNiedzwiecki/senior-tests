# Exercise 6: Compound Components Pattern - Accordion

## Difficulty: Advanced

## Learning Objectives
- Compound components pattern
- Implicit state sharing between components
- Children manipulation with React.Children
- Context for component communication
- Flexible component API design

## Task
Create an Accordion component using the compound components pattern. This pattern allows for a flexible, declarative API.

## Requirements
1. Create a parent Accordion component that manages state
2. Create AccordionItem, AccordionHeader, and AccordionPanel components
3. Use Context to share state between compound components
4. Support both single and multiple expanded items
5. Provide smooth expand/collapse animations

## Expected Usage
```tsx
<Accordion>
  <Accordion.Item id="1">
    <Accordion.Header>Section 1</Accordion.Header>
    <Accordion.Panel>Content for section 1</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="2">
    <Accordion.Header>Section 2</Accordion.Header>
    <Accordion.Panel>Content for section 2</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

## Files to Complete
- `Accordion.tsx` - Main accordion with compound components
- `AccordionDemo.tsx` - Demo showing different configurations

## Hints
- Use Context to pass state down without prop drilling
- The Item component should register itself with the parent
- Consider using React.Children.map for child manipulation
- The Header component needs to toggle its parent Item
