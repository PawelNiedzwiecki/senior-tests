import { Accordion } from './Accordion';
import './Accordion.css';

export const AccordionDemo = () => {
  return (
    <div className="accordion-demo">
      <h1>Compound Components Pattern</h1>
      <p className="description">
        The Accordion component uses the compound components pattern for a flexible,
        declarative API. This pattern allows components to share implicit state.
      </p>

      {/* TODO 1: Single Expansion Accordion */}
      <section className="demo-section">
        <h2>Single Expansion Mode</h2>
        <p>Only one item can be expanded at a time</p>

        {/* YOUR CODE HERE
        <Accordion>
          <Accordion.Item id="faq-1">
            <Accordion.Header>What is React?</Accordion.Header>
            <Accordion.Panel>
              React is a JavaScript library for building user interfaces.
              It lets you compose complex UIs from small, isolated pieces
              of code called components.
            </Accordion.Panel>
          </Accordion.Item>
          ... more items
        </Accordion>
        */}
      </section>

      {/* TODO 2: Multiple Expansion Accordion */}
      <section className="demo-section">
        <h2>Multiple Expansion Mode</h2>
        <p>Multiple items can be expanded simultaneously</p>

        {/* YOUR CODE HERE - Add allowMultiple prop
        <Accordion allowMultiple>
          ... items
        </Accordion>
        */}
      </section>

      {/* TODO 3: Default Expanded Items */}
      <section className="demo-section">
        <h2>Default Expanded</h2>
        <p>Some items are expanded by default</p>

        {/* YOUR CODE HERE - Add defaultExpanded prop
        <Accordion allowMultiple defaultExpanded={['default-1', 'default-3']}>
          ... items
        </Accordion>
        */}
      </section>
    </div>
  );
};

export default AccordionDemo;
