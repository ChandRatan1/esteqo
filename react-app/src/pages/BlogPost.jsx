import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import Media from '../components/Media';
import { PostCard } from '../components/Cards';
import { Breadcrumbs, CtaBand } from '../components/Sections';
import { Loading, ErrorState } from '../components/States';
import { formatDate, parseMarkdown, splitBold } from '../utils/format';
import Seo, { articleSchema } from '../seo/Seo';

function Rich({ text }) {
  return splitBold(text).map((part, index) =>
    part.bold ? <strong key={index}>{part.text}</strong> : <Fragment key={index}>{part.text}</Fragment>
  );
}

function Article({ markdown }) {
  return (
    <div className="prose">
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === 'h2') return <h2 key={index}>{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={index}>{block.text}</h3>;
        if (block.type === 'ul') {
          return (
            <ul key={index}>
              {block.items.map((item, i) => (
                <li key={i}>
                  <Rich text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            <Rich text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export default function BlogPost() {
  const { postSlug } = useParams();
  const { data: post, loading, error, reload } = useApi(
    (opts) => api.getPost(postSlug, opts),
    [postSlug]
  );

  usePageMeta(post?.title, post?.excerpt);

  if (loading) return <Loading label="Loading article…" />;
  if (error) {
    return (
      <div className="container section">
        <ErrorState error={error} onRetry={reload} />
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/blog" className="btn btn--secondary">
            Back to the blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        type="article"
        breadcrumbs={[
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        schema={articleSchema(post)}
      />

      <section className="page-hero accent-cream">
        <div className="container">
          <Breadcrumbs trail={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
          <div className="page-hero__inner">
            {post.category && <span className="eyebrow">{post.category.name}</span>}
            <h1 className="page-hero__title">{post.title}</h1>
            <p className="muted" style={{ fontSize: '0.875rem', letterSpacing: '0.6px' }}>
              {post.author} · {formatDate(post.publishedAt)} · {post.readMinutes} min read
            </p>
          </div>
        </div>
      </section>

      <article className="section">
        <div className="container container--reading">
          <Media
            src={post.coverImage}
            alt={post.title}
            accent="cream"
            label={post.title}
            variant="wide"
          />
          <div style={{ marginTop: 'var(--module-spacing-small)' }}>
            {post.excerpt && (
              <p className="lede" style={{ marginBottom: 32 }}>
                {post.excerpt}
              </p>
            )}
            <Article markdown={post.content || ''} />

            {post.tags?.length > 0 && (
              <div className="chips" style={{ marginTop: 'var(--module-spacing-small)' }}>
                {post.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {post.related?.length > 0 && (
        <section className="section section--cream">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Keep reading</span>
              <h2>More from the journal</h2>
            </div>
            <div className="grid grid--3">
              {post.related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
