import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/useApi';

export default function NotFound() {
  usePageMeta('Page not found');

  return (
    <div className="container notfound">
      <div>
        <span className="notfound__code">404</span>
        <h1 style={{ marginBottom: 18 }}>We could not find that page</h1>
        <p className="lede" style={{ maxWidth: '46ch', marginInline: 'auto' }}>
          The link may be out of date. Try the treatment menu, or get in touch and we will point you
          in the right direction.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 34 }}>
          <Link to="/services" className="btn btn--primary">
            Treatment menu
          </Link>
          <Link to="/contact" className="btn btn--secondary">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
