import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';

export default function NotFound() {
  return (
    <div className="container notfound">
      <Seo title="Page not found" noindex />
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
