/**
 * Data layer.
 *
 * The site runs entirely on the bundled content in src/data — no backend
 * required. The Express + MySQL API in ../../backend remains available: set
 * VITE_USE_API=true and it will be used instead, with identical shapes.
 */

import { categories, categoryBySlug, servicesWithCategory } from '../data/menu';
import { blogCategories, blogPosts, faqs, settings, team, testimonials } from '../data/site';
import { submitEnquiry } from './forms';

const USE_API = String(import.meta.env.VITE_USE_API || '').toLowerCase() === 'true';
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// When set, blog posts come from MySQL while everything else stays on the
// bundled data — so posts can be written through /admin/blog without moving
// the whole catalogue onto the API.
const BLOG_API = (import.meta.env.VITE_BLOG_API || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/* ------------------------------------------------------------------ */
/* Local (default) source                                              */
/* ------------------------------------------------------------------ */

const shapeService = (service) => ({
  id: service.id,
  slug: service.slug,
  name: service.name,
  summary: service.summary,
  description: service.description || null,
  bullets: service.bullets || [],
  whatToExpect: service.whatToExpect || [],
  durationMinutes: service.durationMinutes ?? null,
  price: service.price ?? null,
  priceNote: service.priceNote || null,
  variants: service.variants || [],
  isNew: Boolean(service.isNew),
  // Content from ESTEQO WEBSITE CONTENT.pdf (brows).
  process: service.process || [],
  idealForList: Array.isArray(service.idealFor) ? service.idealFor : [],
  idealFor: typeof service.idealFor === 'string' ? service.idealFor : null,
  aftercare: service.aftercare || [],
  resultsLast: service.resultsLast || null,
  note: service.note || null,
  needsContent: Boolean(service.needsContent),
  isFeatured: Boolean(service.featured),
  image: service.image || null,
  category: service.category,
});

const servicesFor = (slug) =>
  servicesWithCategory.filter((service) => service.categorySlug === slug).map(shapeService);

const shapeCategory = (category) => ({
  slug: category.slug,
  name: category.name,
  tagline: category.tagline,
  intro: category.intro,
  accent: category.accent,
  heroImage: category.heroImage || null,
  serviceCount: servicesWithCategory.filter((s) => s.categorySlug === category.slug).length,
});

const shapePost = (post, { withContent = false } = {}) => {
  const category = blogCategories.find((c) => c.slug === post.categorySlug);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    ...(withContent ? { content: post.content } : {}),
    coverImage: post.coverImage || null,
    author: post.author,
    readMinutes: post.readMinutes,
    tags: post.tags || [],
    isFeatured: Boolean(post.isFeatured),
    publishedAt: post.publishedAt,
    category: category ? { slug: category.slug, name: category.name } : null,
  };
};

const sortedPosts = () =>
  [...blogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const local = {
  getSettings: async () => ({ data: settings }),

  getCategories: async () => ({ data: categories.map(shapeCategory) }),

  getCategory: async (slug) => {
    const category = categoryBySlug[slug];
    if (!category) throw new ApiError('Service category not found', { status: 404 });
    return {
      data: {
        ...shapeCategory(category),
        services: servicesFor(slug),
        faqs: faqs[slug] || [],
      },
    };
  },

  getServices: async (params = {}) => {
    let rows = servicesWithCategory.map(shapeService);

    if (params.category) rows = rows.filter((s) => s.category.slug === params.category);
    if (params.featured === 'true') rows = rows.filter((s) => s.isFeatured);
    if (params.q) {
      const term = params.q.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(term) || (s.summary || '').toLowerCase().includes(term)
      );
    }

    if (params.grouped === 'true') {
      const data = categories
        .map((category) => ({
          ...shapeCategory(category),
          services: rows.filter((s) => s.category.slug === category.slug),
        }))
        .filter((category) => category.services.length > 0);

      return { data, meta: { total: rows.length, categories: data.length } };
    }

    return { data: rows, meta: { total: rows.length } };
  },

  getService: async (slug) => {
    const service = servicesWithCategory.find((s) => s.slug === slug);
    if (!service) throw new ApiError('Service not found', { status: 404 });

    const related = servicesWithCategory
      .filter((s) => s.categorySlug === service.categorySlug && s.slug !== slug)
      .slice(0, 4)
      .map(shapeService);

    return {
      data: {
        ...shapeService(service),
        related,
        faqs: faqs[service.categorySlug] || [],
      },
    };
  },

  getPosts: async (params = {}) => {
    const limit = Number(params.limit) || 9;
    const page = Number(params.page) || 1;

    let rows = sortedPosts();
    if (params.category) rows = rows.filter((p) => p.categorySlug === params.category);
    if (params.featured === 'true') rows = rows.filter((p) => p.isFeatured);

    const total = rows.length;
    const start = (page - 1) * limit;

    return {
      data: rows.slice(start, start + limit).map((p) => shapePost(p)),
      meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  getPost: async (slug) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) throw new ApiError('Post not found', { status: 404 });

    const related = sortedPosts()
      .filter((p) => p.slug !== slug)
      .slice(0, 3)
      .map((p) => shapePost(p));

    return { data: { ...shapePost(post, { withContent: true }), related } };
  },

  getBlogCategories: async () => ({
    data: blogCategories.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description,
      postCount: blogPosts.filter((p) => p.categorySlug === category.slug).length,
    })),
  }),

  getTestimonials: async () => ({ data: testimonials }),

  getFaqs: async (params = {}) => ({ data: params.group ? faqs[params.group] || [] : faqs }),

  getTeam: async () => ({ data: team }),

  createAppointment: (body) => submitEnquiry('appointment', body),
  createContactMessage: (body) => submitEnquiry('contact', body),
  subscribe: (body) => submitEnquiry('newsletter', body),
};

/* ------------------------------------------------------------------ */
/* Optional backend source (VITE_USE_API=true)                         */
/* ------------------------------------------------------------------ */

const buildUrl = (path, params, base) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  }
  const qs = query.toString();
  return `${base ?? BASE_URL}/api${path}${qs ? `?${qs}` : ''}`;
};

async function request(path, { params, method = 'GET', body, signal, base } = {}) {
  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Could not reach the server. Please check your connection.');
  }

  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(payload?.error || `Request failed (${response.status})`, {
      status: response.status,
      details: payload?.details,
    });
  }
  return payload;
}

const remote = {
  getSettings: (o) => request('/settings', o),
  getCategories: (o) => request('/categories', o),
  getCategory: (slug, o) => request(`/categories/${slug}`, o),
  getServices: (params, o) => request('/services', { ...o, params }),
  getService: (slug, o) => request(`/services/${slug}`, o),
  getPosts: (params, o) => request('/blog/posts', { ...o, params }),
  getPost: (slug, o) => request(`/blog/posts/${slug}`, o),
  getBlogCategories: (o) => request('/blog/categories', o),
  getTestimonials: (o) => request('/testimonials', o),
  getFaqs: (params, o) => request('/faqs', { ...o, params }),
  getTeam: (o) => request('/team', o),
  createAppointment: (body) => request('/appointments', { method: 'POST', body }),
  createContactMessage: (body) => request('/contact', { method: 'POST', body }),
  subscribe: (body) => request('/newsletter', { method: 'POST', body }),
};

// The local source ignores the trailing options argument, so the two share a
// signature and pages never need to know which one is active.
//
// Blog reads try the API first and fall back to the bundled posts if it is
// unreachable. Without this the blog would show an error page whenever the
// backend is down or not deployed — which is exactly what happens on hosting
// that cannot run Node. A deliberate 404 is passed through, since that means
// the API answered and the post genuinely does not exist.
const withFallback = (fromApi, fromBundle) => async (...args) => {
  try {
    return await fromApi(...args);
  } catch (error) {
    if (error.name === 'AbortError' || error.status === 404) throw error;
    if (import.meta.env.DEV) {
      console.warn('[blog] API unavailable, using bundled posts:', error.message);
    }
    return fromBundle(...args);
  }
};

const blogViaApi = {
  getPosts: withFallback(
    (params, o) => request('/blog/posts', { ...o, params, base: BLOG_API }),
    (params, o) => local.getPosts(params, o)
  ),
  getPost: withFallback(
    (slug, o) => request(`/blog/posts/${slug}`, { ...o, base: BLOG_API }),
    (slug, o) => local.getPost(slug, o)
  ),
  getBlogCategories: withFallback(
    (o) => request('/blog/categories', { ...o, base: BLOG_API }),
    (o) => local.getBlogCategories(o)
  ),
};

export const api = USE_API ? remote : { ...local, ...(BLOG_API ? blogViaApi : {}) };
export const usingApi = USE_API;
