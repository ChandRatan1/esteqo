import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceCategory from './pages/ServiceCategory';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Values from './pages/Values';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import NotFound from './pages/NotFound';
import BlogAdmin from './pages/BlogAdmin';
import ContactsAdmin from './pages/ContactsAdmin';
import ServicesAdmin from './pages/ServicesAdmin';
import PageSeoAdmin from './pages/PageSeoAdmin';
import RobotsAdmin from './pages/RobotsAdmin';

export default function App() {
  return (
    <Routes>
      <Route path="admin" element={<Navigate to="/admin/services" replace />} />
      <Route path="admin/blog" element={<BlogAdmin />} />
      <Route path="admin/contacts" element={<ContactsAdmin />} />
      <Route path="admin/services" element={<ServicesAdmin />} />
      <Route path="admin/seo" element={<PageSeoAdmin />} />
      <Route path="admin/robots" element={<RobotsAdmin />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/menu/:groupSlug" element={<Services />} />
        <Route path="services/:categorySlug" element={<ServiceCategory />} />
        <Route path="treatments/:serviceSlug" element={<ServiceDetail />} />
        <Route path="about" element={<About />} />
        <Route path="values" element={<Values />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:postSlug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
