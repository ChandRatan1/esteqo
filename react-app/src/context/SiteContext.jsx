import { createContext, useContext, useMemo } from 'react';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';

const SiteContext = createContext(null);

/**
 * Contact details, brand copy and the service menu are needed by the header,
 * footer and several pages — fetch them once at the root.
 *
 * FALLBACK is what renders if the API is unreachable, so the shell never
 * collapses into empty strings.
 */
const FALLBACK = {
  brand: {
    site_name: 'ESTEQO',
    site_tagline: 'Skin. Brows. Lasers. Done with Precision.',
    hero_subtitle:
      'Clinically planned treatments for visible results and long-term skin confidence.',
    founder_name: 'Seema Nanda',
    founder_title: 'Founder & Lead Cosmetologist',
  },
  contact: {
    phone: '+91 8010135135',
    phone_link: '+918010135135',
    whatsapp: '+919958066388',
    email: 'Info.esteqo@gmail.com',
    address_line1: 'Shop No. 209, First Floor, Modi Mall',
    address_line2: 'Sector 25, Noida, Uttar Pradesh – 201301',
    map_query: 'Modi Mall, Sector 25, Noida, Uttar Pradesh 201301',
    hours_weekday: 'Mon – Sat: 9:00 am – 8:00 pm',
    hours_sunday: 'Sunday: 10:00 am – 3:00 pm',
  },
  social: {},
};

export function SiteProvider({ children }) {
  const { data: settings } = useApi((opts) => api.getSettings(opts), []);
  const { data: categories } = useApi((opts) => api.getCategories(opts), []);

  const value = useMemo(
    () => ({
      brand: { ...FALLBACK.brand, ...(settings?.brand || {}) },
      contact: { ...FALLBACK.contact, ...(settings?.contact || {}) },
      social: { ...FALLBACK.social, ...(settings?.social || {}) },
      categories: categories || [],
    }),
    [settings, categories]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used inside <SiteProvider>');
  return context;
}

/** Pre-formatted links built from the contact settings. */
export function useContactLinks() {
  const { contact } = useSite();
  return useMemo(() => {
    const digits = (contact.whatsapp || contact.phone_link || '').replace(/[^\d]/g, '');
    return {
      tel: `tel:${contact.phone_link || contact.phone}`,
      mail: `mailto:${contact.email}`,
      whatsapp: `https://wa.me/${digits}`,
      maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        contact.map_query || `${contact.address_line1} ${contact.address_line2}`
      )}`,
      mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(
        contact.map_query || `${contact.address_line1} ${contact.address_line2}`
      )}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
    };
  }, [contact]);
}
