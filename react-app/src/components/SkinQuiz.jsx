import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUIZ_STEPS } from '../data/skinQuiz';
import { api } from '../api/client';
import { submitQuiz } from '../api/forms';
import { useSite } from '../context/SiteContext';
import { sanitizeEmail, sanitizeName } from '../utils/validation';
import Field from './Field';

/** Maps the "main skincare concerns" answer to a real ESTEQO facial. */
const CONCERN_TO_SERVICE = {
  'Acne / Breakouts': 'acne-fighting-facial',
  Rosacea: 'sensitive-skin-facial',
  'Redness / Sensitivity / Irritation': 'sensitive-skin-facial',
  Dehydration: 'seasonal-hydrating-facial',
  'Dryness / Flakiness': 'seasonal-hydrating-facial',
  Hyperpigmentation: 'hyperpigmentation-facial',
  'Fine Lines and Wrinkles': 'anti-aging-facial',
  'Facial Muscle Tightness': 'anti-aging-facial',
  'Rough and Bumpy Texture': 'premier-contour-facial',
};

function recommendSlug(answers) {
  const concerns = answers.skincareConcerns || [];
  for (const concern of concerns) {
    if (CONCERN_TO_SERVICE[concern]) return CONCERN_TO_SERVICE[concern];
  }
  return 'signature-facial';
}

function ProgressBand({ section, stepIndex, total }) {
  return (
    <div className="quiz-progress">
      <span className="quiz-progress__label">{section}</span>
      <div className="quiz-progress__dots">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`quiz-progress__dot${i < stepIndex ? ' quiz-progress__dot--fill' : ''}${
              i === stepIndex ? ' quiz-progress__dot--current' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** One question screen — renders by step.type. */
function QuestionScreen({ step, value, onChange, onContinue }) {
  const [levelSelection, setLevelSelection] = useState(value ?? null);

  const toggleMulti = (option) => {
    const current = Array.isArray(value) ? value : [];
    const isNone = option === step.noneOption;
    if (isNone) {
      onChange(current.includes(option) ? [] : [option]);
      return;
    }
    const withoutNone = current.filter((v) => v !== step.noneOption);
    if (withoutNone.includes(option)) {
      onChange(withoutNone.filter((v) => v !== option));
      return;
    }
    if (step.maxSelect && withoutNone.length >= step.maxSelect) return;
    onChange([...withoutNone, option]);
  };

  return (
    <div className="quiz-screen">
      <div className="quiz-screen__left">
        <h2>{step.question}</h2>
        <button type="button" className="btn btn--pill-outline" onClick={() => onContinue(value)}>
          Continue
        </button>
      </div>

      <div className="quiz-screen__right">
        {step.prompt && <p className="quiz-screen__prompt">{step.prompt}</p>}

        {step.type === 'single' && step.layout === 'grid2' && (
          <div className="quiz-grid quiz-grid--2">
            {step.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`quiz-card${value === opt ? ' quiz-card--selected' : ''}`}
                onClick={() => onChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step.type === 'single' && step.layout === 'list' && (
          <div className="quiz-list">
            {step.options.map((opt) => (
              <label key={opt} className={`quiz-list__item${value === opt ? ' quiz-list__item--selected' : ''}`}>
                <input type="radio" name={step.id} checked={value === opt} onChange={() => onChange(opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {step.type === 'single' && step.layout === 'grid3' && (
          <div className="quiz-grid quiz-grid--3">
            {step.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`quiz-card quiz-card--stat${value === opt.label ? ' quiz-card--selected' : ''}`}
                onClick={() => onChange(opt.label)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.sub}</span>
              </button>
            ))}
          </div>
        )}

        {step.type === 'yesno' && (
          <div className="quiz-grid quiz-grid--2">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                className={`quiz-card quiz-card--yesno${value === opt ? ' quiz-card--selected' : ''}`}
                onClick={() => onChange(opt)}
              >
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
                  <circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6 21c0-3.5 2.7-6 6-6s6 2.5 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {opt}
              </button>
            ))}
          </div>
        )}

        {step.type === 'levels' && (
          <div className="quiz-levels">
            {step.options.map((level, i) => (
              <button
                key={level.label}
                type="button"
                className={`quiz-levels__row${levelSelection === i ? ' quiz-levels__row--selected' : ''}`}
                onClick={() => {
                  setLevelSelection(i);
                  onChange(level.label);
                }}
              >
                <span className="quiz-levels__swatch" style={{ background: level.shade }} />
                <span className="quiz-levels__label">{level.label}</span>
                <span className="quiz-levels__text">{level.text}</span>
              </button>
            ))}
          </div>
        )}

        {step.type === 'multi' && (
          <div className="quiz-grid quiz-grid--3">
            {[...step.options, ...(step.noneOption ? [step.noneOption] : [])].map((opt) => {
              const selected = Array.isArray(value) && value.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  className={`quiz-card${selected ? ' quiz-card--selected' : ''}`}
                  onClick={() => toggleMulti(opt)}
                >
                  {selected && <span className="quiz-card__check">✓</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {step.type === 'sliders' && (
          <div className="quiz-sliders">
            {step.zones.map((zone) => {
              const zoneValue = (value && value[zone]) ?? 1;
              return (
                <div key={zone} className="quiz-slider">
                  <h4>{zone}</h4>
                  <input
                    type="range"
                    min={0}
                    max={step.levels.length - 1}
                    value={zoneValue}
                    onChange={(e) =>
                      onChange({ ...(value || {}), [zone]: Number(e.target.value) })
                    }
                  />
                  <div className="quiz-slider__labels">
                    {step.levels.map((lvl) => (
                      <span key={lvl}>{lvl}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkinQuiz({ onClose }) {
  const { brand } = useSite();
  const [stepIndex, setStepIndex] = useState(-1); // -1 = intro screen
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ firstName: '', lastName: '', email: '' });
  const [leadErrors, setLeadErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle' });
  const [result, setResult] = useState(null);

  const total = QUIZ_STEPS.length;
  const step = stepIndex >= 0 && stepIndex < total ? QUIZ_STEPS[stepIndex] : null;

  const setAnswer = (val) => setAnswers((prev) => ({ ...prev, [step.id]: val }));

  const goNext = () => {
    if (stepIndex + 1 >= total) {
      setStepIndex(total); // lead form screen
    } else {
      setStepIndex(stepIndex + 1);
    }
  };
  const goBack = () => setStepIndex((i) => Math.max(-1, i - 1));

  const answerLabel = (s) => {
    const val = answers[s.id];
    if (s.type === 'sliders') {
      return s.zones.map((z) => `${z}: ${s.levels[val?.[z] ?? 1]}`).join(' · ');
    }
    if (Array.isArray(val)) return val.join(', ') || '—';
    return val || '—';
  };

  const submitLead = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!sanitizeName(lead.firstName).trim()) errors.firstName = 'Please enter your first name';
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(lead.email)) errors.email = 'Enter a valid email address';
    if (Object.keys(errors).length) {
      setLeadErrors(errors);
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const slug = recommendSlug(answers);
      const response = await api.getService(slug).catch(() => null);

      await submitQuiz({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        answers: QUIZ_STEPS.map((s) => ({ label: s.question, value: answerLabel(s) })),
        recommendedService: response?.data?.name || slug,
      });

      setResult(response?.data || null);
      setStatus({ state: 'done' });
    } catch (error) {
      setStatus({ state: 'error', message: error.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-label="Skin quiz">
      <div className="quiz-topbar">
        {stepIndex > -1 && stepIndex <= total && status.state !== 'done' ? (
          <button type="button" className="quiz-topbar__back" onClick={goBack}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <div className="quiz-topbar__brand">
          <img src="/logo.svg" alt={brand.site_name} width="132" height="40" />
          <span>Skin Quiz</span>
        </div>
        <button type="button" className="quiz-topbar__exit" onClick={onClose}>
          Exit
        </button>
      </div>

      {stepIndex === -1 && (
        <div className="quiz-intro">
          <div className="quiz-band">
            <h1>Discover Your Ideal Facial</h1>
          </div>
          <div className="quiz-intro__body">
            <p>Answer a few quick questions and we'll match you to the right ESTEQO facial.</p>
            <button type="button" className="btn btn--pill-outline" onClick={goNext}>
              Take the quiz now
            </button>
          </div>
        </div>
      )}

      {step && (
        <>
          <QuestionScreen step={step} value={answers[step.id]} onChange={setAnswer} onContinue={goNext} />
          <ProgressBand section={step.section} stepIndex={stepIndex} total={total} />
        </>
      )}

      {stepIndex === total && status.state !== 'done' && (
        <div className="quiz-lead">
          <div className="quiz-lead__card">
            <h2>Almost there!</h2>
            <p>To get your results, let us know a little more about you.</p>

            {status.state === 'error' && (
              <div className="alert alert--error" role="alert">
                {status.message}
              </div>
            )}

            <form onSubmit={submitLead} noValidate>
              <div className="form__row">
                <Field id="quiz-first" label="First name" error={leadErrors.firstName}>
                  <input
                    id="quiz-first"
                    type="text"
                    value={lead.firstName}
                    onChange={(e) => setLead((p) => ({ ...p, firstName: sanitizeName(e.target.value) }))}
                  />
                </Field>
                <Field id="quiz-last" label="Last name">
                  <input
                    id="quiz-last"
                    type="text"
                    value={lead.lastName}
                    onChange={(e) => setLead((p) => ({ ...p, lastName: sanitizeName(e.target.value) }))}
                  />
                </Field>
              </div>
              <Field id="quiz-email" label="Email" error={leadErrors.email}>
                <input
                  id="quiz-email"
                  type="email"
                  value={lead.email}
                  onChange={(e) => setLead((p) => ({ ...p, email: sanitizeEmail(e.target.value) }))}
                />
              </Field>
              <button type="submit" className="btn btn--pill-outline" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {status.state === 'done' && (
        <div className="quiz-lead">
          <div className="quiz-lead__card">
            <h2>Your match: {result?.name || 'a Signature Facial'}</h2>
            <p>{result?.summary || "We've emailed your recommendation and will follow up shortly."}</p>
            <div className="btn-row" style={{ justifyContent: 'center', marginTop: 20 }}>
              <Link
                to={`/appointment?service=${result?.slug || ''}`}
                className="btn btn--primary"
                onClick={onClose}
              >
                Book this treatment
              </Link>
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
