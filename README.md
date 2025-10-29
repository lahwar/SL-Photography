# SL Photography

A single-page portfolio for SL Photography showcasing the work of photographer Sofiane Lahouar.

## Deployment notes

The HTML head now includes canonical, Open Graph, Twitter Card, and structured data markup. To keep the absolute URLs in those tags accurate across environments, set the following environment variables in your deployment pipeline:

- `SITE_BASE_URL` – the fully qualified URL that should be used for the canonical link, Open Graph `og:url`, and Twitter `twitter:url` values.
- `SOCIAL_PREVIEW_IMAGE` – the absolute URL for the social sharing preview image referenced by Open Graph `og:image` and Twitter `twitter:image`.

When building or publishing the site, update `index.html` with the desired values. One way to do that is with a short Python script:

```bash
export SITE_BASE_URL="https://portfolio.example.com"
export SOCIAL_PREVIEW_IMAGE="${SITE_BASE_URL}/images/fulls/hero.jpg"
python - <<'PY'
from pathlib import Path
import os

base = os.environ["SITE_BASE_URL"].rstrip("/")
social_image = os.environ["SOCIAL_PREVIEW_IMAGE"]
path = Path("index.html")
text = path.read_text()
text = text.replace("https://slphotography.com/", base + "/")
text = text.replace("https://slphotography.com/images/fulls/01.jpg", social_image)
path.write_text(text)
PY
```

Adjust the image path to match the asset you want to highlight in link previews, and run an equivalent command in your CI/CD system so deployments always serve the correct URLs.
