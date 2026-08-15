import { useId, useState } from 'react';

/**
 * Single-open accordion used for FAQs.
 * `items` is [{ id, question, answer }].
 */
export default function Accordion({ items = [], defaultOpen = null }) {
  const [openId, setOpenId] = useState(defaultOpen);
  const baseId = useId();

  if (!items.length) return null;

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const triggerId = `${baseId}-trigger-${item.id}`;

        return (
          <div className="accordion__item" key={item.id}>
            <h3>
              <button
                type="button"
                id={triggerId}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            {isOpen && (
              <div className="accordion__panel" id={panelId} role="region" aria-labelledby={triggerId}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
