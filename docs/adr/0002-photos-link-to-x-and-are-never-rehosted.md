# Photos are shown from X and never re-hosted

The photos page stores post metadata only (`apps/astro/src/constants/kameko-posts.json`). Every image loads from `pbs.twimg.com`, and every photo links to its original post. Ham wants each photo tied to the post that credits the people in it, and a post deleted on X must disappear from the site too: a tile whose image fails to load hides itself. The cost: the page depends on X's image host, and it cannot optimise or resize images beyond X's `name=small|medium|large` variants.
