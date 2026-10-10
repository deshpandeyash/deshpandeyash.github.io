# Yash Deshpande — Personal Website

A responsive, static personal website designed to be hosted for free on GitHub Pages and connected to a domain registered at GoDaddy.

## Pages included
- `index.html` — home and highlighted research
- `research.html` — research topics and project summaries
- `publications.html` — searchable publication list (replace placeholder bibliographic details)
- `teaching.html` — teaching activities
- `cv.html` — education and experience, with a placeholder CV PDF path
- `contact.html` — contact details and external profiles

## Before publishing
1. Check every page and update the text to your preferred wording.
2. Review the entries in `publications.html` and adjust titles, author lists, ordering, and links as needed.
3. Replace the CV file in `assets/files/CV.pdf` if you want to publish a newer version.
4. Optional: replace the Google Fonts import in `assets/css/style.css` with system fonts if you prefer not to load fonts from a third party.

## Deploy with GitHub Pages
1. Sign in to GitHub and create a **public** repository named `yourusername.github.io` (replace `yourusername` with your GitHub username).
2. Upload all files and folders from this ZIP to the repository root. `index.html` must be at the root.
3. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/(root)`, and save.
4. Wait for the Pages deployment to finish. Your site will first be available at `https://yourusername.github.io`.

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

## Local preview
Open `index.html` in a browser. Most content works without a local server; the publication search and mobile navigation use the included JavaScript.
