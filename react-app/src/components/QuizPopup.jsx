import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The "take the skin quiz" prompt.
 *
 * Opens by itself once, after TWENTY SECONDS OF ACTIVE TIME on the site —
 * "active" meaning the tab is visible, so time in a background tab does not
 * count and the timer carries across page navigations. Taking the quiz or
 * dismissing it means it never auto-opens again on that device.
 *
 * The offer popup fires at ten seconds, so `blocked` holds this one back
 * while that dialog is still on screen; the timer resumes once it closes and
 * the two never stack.
 *
 * Clear `esteqo.quizPopup` in devtools to test it again.
 */

const STORAGE_KEY = 'esteqo.quizPopup';
const ACTIVE_MS = 20 * 1000;
const TICK_MS = 1000;

const alreadyHandled = () => {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
};

const remember = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the prompt may simply reappear next visit */
  }
};

export default function QuizPopup({ onTakeQuiz, blocked = false }) {
  const [open, setOpen] = useState(false);
  const handled = useRef(alreadyHandled());
  const activeMs = useRef(0);
  const closeButton = useRef(null);
  const blockedRef = useRef(blocked);

  useEffect(() => {
    blockedRef.current = blocked;
  }, [blocked]);

  const close = useCallback(() => {
    setOpen(false);
    handled.current = true;
    remember('dismissed');
  }, []);

  const takeQuiz = useCallback(() => {
    setOpen(false);
    handled.current = true;
    remember('taken');
    onTakeQuiz();
  }, [onTakeQuiz]);

  // Count only visible, unblocked time.
  useEffect(() => {
    if (handled.current) return undefined;

    const timer = setInterval(() => {
      if (document.hidden || blockedRef.current || handled.current) return;

      activeMs.current += TICK_MS;
      if (activeMs.current >= ACTIVE_MS) {
        handled.current = true;
        remember('shown');
        setOpen(true);
        clearInterval(timer);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  // Escape closes; lock the page behind the dialog.
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="quiz-prompt" role="presentation" onClick={close}>
      <div
        className="quiz-prompt__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-prompt-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="quiz-prompt__close"
          onClick={close}
          aria-label="Close"
          ref={closeButton}
        >
          &times;
        </button>

        <span className="quiz-prompt__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path
              d="M12 3.5c.7 2.6 2.4 4.3 5 5-2.6.7-4.3 2.4-5 5-.7-2.6-2.4-4.3-5-5 2.6-.7 4.3-2.4 5-5z"
              fill="#fff"
            />
          </svg>
        </span>

        <span className="eyebrow">Made just for your skin</span>
        <h2 id="quiz-prompt-title">Not sure where to begin?</h2>
        <p>
          Answer a few quick questions and we&rsquo;ll match you to the right ESTEQO facial. It
          takes about a minute.
        </p>

        <div className="quiz-prompt__actions">
          <button type="button" className="btn btn--primary" onClick={takeQuiz}>
            Take the quiz
          </button>
          <button type="button" className="quiz-prompt__later" onClick={close}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
