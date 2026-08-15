/** Labelled form control with inline server-side error display. */
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="form__note" style={{ marginTop: 7 }}>{hint}</p>}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Maps the API's `details` array into a { field: message } lookup. */
export function toFieldErrors(error) {
  if (!error?.details?.length) return {};
  return error.details.reduce((acc, detail) => {
    if (!acc[detail.field]) acc[detail.field] = detail.message;
    return acc;
  }, {});
}
