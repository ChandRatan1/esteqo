import { useState } from 'react';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { PostCard } from '../components/Cards';
import { CtaBand, PageHero } from '../components/Sections';
import { CardSkeletons, EmptyState, ErrorState } from '../components/States';
import Seo from '../seo/Seo';

const PER_PAGE = 9;

export default function Blog() {
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);


  const { data: categories } = useApi((opts) => api.getBlogCategories(opts), []);
  const {
    data: posts,
    loading,
    error,
    reload,
  } = useApi(
    (opts) => api.getPosts({ category, page, limit: PER_PAGE }, opts).then((r) => {
      // Keep pagination meta alongside the rows.
      return { data: { posts: r.data, meta: r.meta } };
    }),
    [category, page]
  );

  const rows = posts?.posts || [];
  const meta = posts?.meta;

  const pickCategory = (slug) => {
    setCategory(slug);
    setPage(1);
  };

  return (
    <>
      <Seo
        title="Blog"
        description="Treatment guides, skin science and aftercare from the ESTEQO team in Noida."
        breadcrumbs={[{ name: 'Blog', path: '/blog' }]}
      />

      <PageHero
        eyebrow="Journal"
        title="Skin science, without the marketing"
        text="How treatments actually work, what to expect, and how to look after your skin between appointments."
        accent="light-yellow"
      />

      <section className="section">
        <div className="container">
          {categories?.length > 0 && (
            <div className="chips" style={{ marginBottom: 'var(--module-spacing-medium)' }}>
              <button
                type="button"
                className={`chip${category === '' ? ' chip--active' : ''}`}
                onClick={() => pickCategory('')}
              >
                All articles
              </button>
              {categories
                .filter((item) => item.postCount > 0)
                .map((item) => (
                  <button
                    type="button"
                    key={item.slug}
                    className={`chip${category === item.slug ? ' chip--active' : ''}`}
                    onClick={() => pickCategory(item.slug)}
                  >
                    {item.name}
                  </button>
                ))}
            </div>
          )}

          {loading && <CardSkeletons count={6} />}
          {error && <ErrorState error={error} onRetry={reload} />}

          {!loading && !error && rows.length === 0 && (
            <EmptyState>
              <p>No articles here yet — check back soon.</p>
            </EmptyState>
          )}

          {rows.length > 0 && (
            <div className="grid grid--3">
              {rows.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {meta && meta.pages > 1 && (
            <div className="pager">
              <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
                Prev
              </button>
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((number) => (
                <button
                  type="button"
                  key={number}
                  aria-current={number === page}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.pages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Have a question we have not answered?"
        text="Book a consultation and we will look at your skin properly before recommending anything."
      />
    </>
  );
}
