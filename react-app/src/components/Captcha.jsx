import { useId } from 'react';
import Field from './Field';
import { LIMITS } from '../utils/validation';

/**
 * Verification code shown at the end of the enquiry forms.
 *
 * The code is drawn as SVG with each character rotated and offset slightly,
 * over a lined background, so it is not simply selectable text. Matching is
 * case-insensitive and a fresh code can be requested at any time.
 *
 * This stops casual bot spam. It is not a substitute for a server-side check —
 * if you later move submissions onto the backend, verify there too.
 */

const CHAR_COLOURS = ['#1f1b18', '#8a6d3a', '#404040', '#257bbf'];

export default function Captcha({ code, value, onChange, onRefresh, error }) {
  const inputId = useId();
  const chars = code.split('');

  return (
    <div className="captcha">
      <div className="captcha__row">
        <div className="captcha__code">
          <svg
            viewBox="0 0 160 56"
            role="img"
            aria-label="Verification code image"
            className="captcha__svg"
          >
            <rect width="160" height="56" fill="var(--cream)" />
            {/* Noise lines */}
            {[12, 26, 40].map((y, i) => (
              <line
                key={y}
                x1="4"
                y1={y + (i % 2 ? 6 : -4)}
                x2="156"
                y2={y - (i % 2 ? 5 : -6)}
                stroke="rgba(31,27,24,0.18)"
                strokeWidth="1"
              />
            ))}
            {chars.map((char, index) => {
              // Deterministic per position + character, so it does not jitter
              // on every React re-render.
              const seed = char.charCodeAt(0) + index * 7;
              const rotate = ((seed % 21) - 10) * 1.4;
              const dy = ((seed % 7) - 3) * 1.6;
              return (
                <text
                  key={`${char}-${index}`}
                  x={18 + index * 27}
                  y={38 + dy}
                  fontFamily="Georgia, serif"
                  fontSize="30"
                  fontWeight="600"
                  fill={CHAR_COLOURS[seed % CHAR_COLOURS.length]}
                  transform={`rotate(${rotate} ${18 + index * 27} ${38 + dy})`}
                >
                  {char}
                </text>
              );
            })}
          </svg>

          <button
            type="button"
            className="captcha__refresh"
            onClick={onRefresh}
            aria-label="Get a new verification code"
            title="Get a new code"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path
                d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="captcha__input">
          <Field id={inputId} label="Enter the code above" error={error}>
            <input
              id={inputId}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              maxLength={LIMITS.captcha}
              placeholder="e.g. A7KP2"
              value={value}
              onChange={(event) => onChange(event.target.value.toUpperCase())}
            />
          </Field>
        </div>
      </div>
      <p className="form__note">Not case sensitive. Tap the arrow for a new code.</p>
    </div>
  );
}
