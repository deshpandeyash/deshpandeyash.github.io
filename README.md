# Yash Deshpande — Personal Website

A responsive personal website built with Jekyll and a BibTeX-backed publication pipeline, designed to be hosted on GitHub Pages.

## Pages included
- `index.html` — home and highlighted research/publications
- `research.html` — broad research directions, each with related-publication links
- `publications.html` — searchable publication list with topic and year filters
- `teaching.html` — teaching activities
- `cv.html` — education and experience, with a downloadable CV
- `contact.html` — contact details and external profiles

## Publication workflow
- `publications.bib` is the source of truth for bibliography entries.
- `scripts/generate_publications.py` converts BibTeX into `_data/publications.yml`.
- `_data/publication_overrides.yml` stores per-paper tags, optional links, and visibility overrides.
- `publications.html` and `research.html` render directly from the generated data.

To refresh the publication database locally after editing `publications.bib`:

```bash
pip install -r requirements.txt
python scripts/generate_publications.py
```

## Local preview
1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   gem install bundler
   bundle install
   ```

2. Regenerate publications:

   ```bash
   python scripts/generate_publications.py
   ```

3. Run the site:

   ```bash
   bundle exec jekyll serve
   ```

## Before publishing
1. Check every page and update the text to your preferred wording.
2. Review `publications.bib` and `_data/publication_overrides.yml` when adding or retagging publications.
3. Replace the CV file in `assets/files/CV.pdf` if you want to publish a newer version.
4. Optional: replace the Google Fonts import in `assets/css/style.css` with system fonts if you prefer not to load fonts from a third party.

## Deploy with GitHub Pages
1. Push the repository to GitHub.
2. In the repository, open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. The included workflow in `.github/workflows/pages.yml` will regenerate publications from BibTeX, build the Jekyll site, and deploy it.
5. Wait for the Pages deployment to finish. Your site will be available at `https://yourusername.github.io`.

## Connect your GoDaddy domain
Do this after the GitHub Pages site is live:
1. In GitHub repository **Settings → Pages → Custom domain**, enter your exact domain (for example, `example.com`) and save.
2. In GoDaddy, open your domain's DNS management.
3. Add/update the following DNS records for an apex/root domain. Remove conflicting A/AAAA records for `@` first if present.

   | Type | Name | Value | TTL |
   |---|---|---|---|
   | A | @ | 185.199.108.153 | 600 seconds or default |
   | A | @ | 185.199.109.153 | 600 seconds or default |
   | A | @ | 185.199.110.153 | 600 seconds or default |
   | A | @ | 185.199.111.153 | 600 seconds or default |

4. For `www`, add a CNAME record:
   - **Name:** `www`
   - **Value:** `yourusername.github.io` (replace with your GitHub username; do not include `https://`)
5. Keep any domain-verification TXT records you may already have. Do not delete unrelated mail records (MX/TXT) if you use email on this domain.
6. Return to GitHub Pages settings and enable **Enforce HTTPS** once the certificate is ready. DNS and certificate provisioning may take some time.
7. Decide which address should be canonical (`example.com` or `www.example.com`) and check both work after DNS has propagated.

Official documentation:
- GitHub Pages: https://docs.github.com/en/pages
- Custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- GoDaddy DNS: https://www.godaddy.com/help/manage-dns-records-680

## Notes
- The publication filters run client-side in the browser.
- Because the site uses a build workflow, updates to `publications.bib` should be committed together with any override/tag changes.
