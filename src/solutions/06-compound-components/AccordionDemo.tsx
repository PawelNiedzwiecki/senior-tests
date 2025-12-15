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

      {/* SOLUTION 1: Single Expansion Accordion */}
      <section className="demo-section">
        <h2>Single Expansion Mode</h2>
        <p>Only one item can be expanded at a time</p>

        <Accordion>
          <Accordion.Item id="faq-1">
            <Accordion.Header>What is React?</Accordion.Header>
            <Accordion.Panel>
              React is a JavaScript library for building user interfaces.
              It lets you compose complex UIs from small, isolated pieces
              of code called components. React has been designed from the
              start for gradual adoption, and you can use as little or as
              much React as you need.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="faq-2">
            <Accordion.Header>What are Hooks?</Accordion.Header>
            <Accordion.Panel>
              Hooks are functions that let you "hook into" React state and
              lifecycle features from function components. Hooks don't work
              inside classes — they let you use React without classes.
              <ul>
                <li><code>useState</code> - Add state to function components</li>
                <li><code>useEffect</code> - Perform side effects</li>
                <li><code>useContext</code> - Access context values</li>
                <li><code>useReducer</code> - Complex state management</li>
              </ul>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="faq-3">
            <Accordion.Header>What is the Virtual DOM?</Accordion.Header>
            <Accordion.Panel>
              The Virtual DOM (VDOM) is a programming concept where an ideal,
              or "virtual", representation of a UI is kept in memory and synced
              with the "real" DOM by a library such as ReactDOM. This process
              is called reconciliation.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* SOLUTION 2: Multiple Expansion Accordion */}
      <section className="demo-section">
        <h2>Multiple Expansion Mode</h2>
        <p>Multiple items can be expanded simultaneously</p>

        <Accordion allowMultiple>
          <Accordion.Item id="feature-1">
            <Accordion.Header>Declarative</Accordion.Header>
            <Accordion.Panel>
              React makes it painless to create interactive UIs. Design simple
              views for each state in your application, and React will efficiently
              update and render just the right components when your data changes.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="feature-2">
            <Accordion.Header>Component-Based</Accordion.Header>
            <Accordion.Panel>
              Build encapsulated components that manage their own state, then
              compose them to make complex UIs. Since component logic is written
              in JavaScript instead of templates, you can easily pass rich data
              through your app.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="feature-3">
            <Accordion.Header>Learn Once, Write Anywhere</Accordion.Header>
            <Accordion.Panel>
              We don't make assumptions about the rest of your technology stack,
              so you can develop new features in React without rewriting existing
              code. React can also render on the server using Node and power
              mobile apps using React Native.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* SOLUTION 3: Default Expanded Items */}
      <section className="demo-section">
        <h2>Default Expanded</h2>
        <p>Some items are expanded by default</p>

        <Accordion allowMultiple defaultExpanded={['default-1', 'default-3']}>
          <Accordion.Item id="default-1">
            <Accordion.Header>I'm expanded by default!</Accordion.Header>
            <Accordion.Panel>
              This panel is expanded when the component first mounts because
              its ID is included in the defaultExpanded array.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="default-2">
            <Accordion.Header>I'm collapsed by default</Accordion.Header>
            <Accordion.Panel>
              This panel is collapsed initially. Click the header to expand it.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item id="default-3">
            <Accordion.Header>I'm also expanded by default!</Accordion.Header>
            <Accordion.Panel>
              Another panel that's expanded on initial render. The allowMultiple
              prop is true, so both this and the first item can be open together.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>
    </div>
  );
};

export default AccordionDemo;
