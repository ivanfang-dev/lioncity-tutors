export default {
    async redirects() {
      return [
        // Moved out of /blog/ when the how-to-study series got its own path.
        {
          source: '/blog/how-to-study-history-o-level',
          destination: '/how-to-study/o-level-history',
          permanent: true,
        },
        {
          source: '/blog/igcse-biology-guide-2025',
          destination: '/igcse-biology',
          permanent: true,
        },
        {
            source: '/blog/o-level-chemistry-guide-2025',
            destination: '/o-level-chemistry',
            permanent: true,
        },
        {
            source: '/blog/psle-chinese',
            destination: '/psle-chinese',
            permanent: true,
        },
        {
            source: '/blog/ibdp-biology-guide-2025',
            destination: '/ibdp-biology',
            permanent: true,
        },
        {
            source: '/blog/o-level-biology-2025',
            destination: '/o-level-biology',
            permanent: true,
        },
        {
            source: '/blog/a-level-h2-chemistry-guide-2025',
            destination: '/a-level-chemistry',
            permanent: true,
        },
        {
            source: '/blog/psle-science',
            destination: '/psle-science',
            permanent: true,
        },
        {
            source: '/blog/a-level-preparation-guide-2025',
            destination: '/blog/a-level-preparation-guide',
            permanent: true,
        },
        {
            source: '/blog/a-level-h2-biology-guide-2025',
            destination: '/a-level-biology',
            permanent: true,
        },
        // /guides/* duplicates of /blog/* posts — /blog is the canonical
        // home for these (see Task 7, docs/seo-action-plan.md).
        {
            source: '/guides/focus-and-concentration-issues',
            destination: '/blog/focus-and-concentration-issues',
            permanent: true,
        },
        {
            source: '/guides/navigating-psle-anxiety',
            destination: '/blog/navigating-psle-anxiety',
            permanent: true,
        },
        {
            source: '/guides/improve-primary-english-composition',
            destination: '/blog/improve-primary-english-composition',
            permanent: true,
        },
      ];
    },
  };
  