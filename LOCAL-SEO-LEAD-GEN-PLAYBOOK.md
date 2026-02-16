# DhanuTech Local SEO & Lead Generation Implementation Playbook

## Task 1: Complete SEO & Local Domination Strategy

### Page-wise SEO metadata and heading map

| Page | Title Tag (<60) | Meta Description (<160) | H1 | H2 | H3 |
|---|---|---|---|---|---|
| Home | `Luminous Inverter Dealer in Puttur \| DhanuTech` | `Authorised Luminous inverter & battery dealer in Puttur. UPS, CCTV, laptop service & control panels across Dakshina Kannada.` | `Luminous Authorised Dealer in Puttur, Karnataka` | `Power Backup Solutions in Dakshina Kannada`; `Laptop, CCTV & Electrical Services` | `UPS Repair in Puttur`; `Battery Replacement Near You`; `Book Free Site Inspection` |
| Products | `Luminous Inverters & Batteries in Puttur \| DhanuTech` | `Buy Luminous inverters, batteries, UPS systems and laptops from DhanuTech, trusted local dealer in Puttur, Karnataka.` | `Buy Inverters, Batteries & UPS in Puttur` | `Luminous Inverter Range`; `Tubular Battery Range`; `Commercial UPS Solutions` | `2kVA Home UPS`; `220Ah Tall Tubular`; `Warranty & Installation` |
| Services | `UPS Repair, CCTV & Laptop Service in Puttur` | `Fast UPS repair, CCTV installation, laptop service and control panel works in Puttur and nearby Dakshina Kannada areas.` | `Trusted Technical Services in Puttur` | `UPS & Inverter Service`; `Laptop Sales & Repair`; `CCTV Installation`; `Electrical Automation` | `Emergency Power Failure Support`; `Annual Maintenance Plans` |
| Contact | `Contact DhanuTech Puttur \| Call & WhatsApp Support` | `Call or WhatsApp DhanuTech for inverter, battery, UPS, CCTV, laptop and electrical services in Puttur, Karnataka.` | `Contact DhanuTech - Puttur` | `Visit Our Puttur Store`; `Quick Callback Form`; `Service Coverage Areas` | `Same-Day Response`; `Free Site Inspection` |
| Blog | `Power Backup & Tech Tips Blog \| DhanuTech Puttur` | `Local guides on inverters, UPS maintenance, laptop care and CCTV planning for homes and businesses in Puttur.` | `DhanuTech Local Expert Blog` | `Inverter Buying Guides`; `UPS Maintenance Tips`; `Laptop & CCTV Advice` | `How to Choose Inverter Capacity`; `Battery Care Checklist` |

### Local keyword placement (must-use blocks)
- Primary intro paragraph on each page should include: `Puttur`, `Dakshina Kannada`, and `Karnataka` once naturally.
- Use one exact-match keyword in each page H2, such as:
  - `Luminous inverter dealer in Puttur`
  - `Luminous battery dealer near me`
  - `UPS repair in Puttur`
  - `Laptop service in Puttur`
  - `CCTV installation in Puttur`
  - `Electrical panel manufacturer in Puttur`

### Internal linking structure

```html
<!-- Sitewide internal SEO links -->
<nav aria-label="Primary">
  <a href="/index.html">Home</a>
  <a href="/luminous-authorized-dealer-puttur.html">Luminous Dealer</a>
  <a href="/products.html">Products</a>
  <a href="/services.html">Services</a>
  <a href="/contact.html">Contact</a>
  <a href="/blog.html">Blog</a>
</nav>

<!-- Contextual links example in content -->
<p>
  Need fast <a href="/services.html#ups-repair-puttur">UPS repair in Puttur</a>?
  Explore our <a href="/products.html#luminous-inverters">Luminous inverters</a> and
  request a <a href="/contact.html#free-site-inspection">free site inspection</a>.
</p>
```

### Local landing page strategy
Create geo-intent landing pages:
- `/luminous-inverter-dealer-puttur.html`
- `/ups-repair-puttur.html`
- `/laptop-service-puttur.html`
- `/cctv-installation-puttur.html`
- `/electrical-panel-manufacturer-puttur.html`

Each page should include:
1. City keyword in title/H1/url.
2. 1 local customer testimonial.
3. 1 area coverage list section.
4. FAQ block with schema.
5. Call + WhatsApp sticky CTA.

---

## Task 2: Luminous Authorised Dealership Promotion

### Hero + trust + warranty + why-buy section (HTML/CSS)

```html
<section class="luminous-hero" id="luminous-dealer">
  <p class="eyebrow">Authorised Luminous Dealer - Puttur, Karnataka</p>
  <h1>Luminous Inverter Dealer in Puttur You Can Trust</h1>
  <p>Get genuine Luminous inverters, batteries, installation and warranty support from DhanuTech in Dakshina Kannada.</p>
  <div class="cta-row">
    <a class="btn btn-primary" href="tel:+919591555095">Call Now</a>
    <a class="btn btn-whatsapp" href="https://wa.me/919591555095?text=Need%20Luminous%20inverter%20in%20Puttur" target="_blank" rel="noopener">WhatsApp Now</a>
    <a class="btn btn-outline" href="/contact.html#quote">Get Quote</a>
  </div>
</section>

<section class="trust-badges" aria-label="Trust badges">
  <div>✅ Authorised Luminous Dealer</div>
  <div>✅ Genuine Products</div>
  <div>✅ On-site Installation</div>
  <div>✅ Local Warranty Support</div>
</section>

<section class="warranty-box">
  <h2>Luminous Warranty & Service Support</h2>
  <ul>
    <li>Manufacturer warranty on inverter & battery models</li>
    <li>Doorstep service coordination from DhanuTech</li>
    <li>Priority support for Puttur and nearby locations</li>
  </ul>
</section>

<section>
  <h2>Why Buy Luminous from DhanuTech?</h2>
  <div class="why-grid">
    <article><h3>Correct Load Sizing</h3><p>Free load assessment to avoid under/over sizing.</p></article>
    <article><h3>Fast Local Support</h3><p>Rapid response for homes, shops and offices.</p></article>
    <article><h3>Transparent Pricing</h3><p>Clear quote, installation and after-sales process.</p></article>
  </div>
</section>
```

```css
.luminous-hero{padding:1.5rem;background:#eff6ff;border-radius:16px}
.eyebrow{font-weight:700;color:#1d4ed8;text-transform:uppercase;font-size:.78rem}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem}
.trust-badges{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1rem 0}
.warranty-box{padding:1rem;background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px}
.why-grid{display:grid;grid-template-columns:1fr;gap:.75rem}
@media(min-width:768px){.why-grid{grid-template-columns:repeat(3,1fr)}}
```

### Dedicated Luminous landing page structure
1. Hero with dealership proof.
2. Top inverter/battery product cards.
3. Warranty + installation process.
4. FAQs + local service areas.
5. Sticky lead buttons and quick callback form.

---

## Task 3: Lead Generation Optimization (working snippets)

```html
<!-- Sticky mobile CTAs -->
<div class="mobile-sticky-cta" role="region" aria-label="Quick contact actions">
  <a href="tel:+919591555095" class="call-btn">📞 Call Now</a>
  <a href="https://wa.me/919591555095?text=Need%20help%20with%20power%20backup" class="wa-btn" target="_blank" rel="noopener">💬 WhatsApp</a>
</div>

<section id="quick-callback">
  <h2>Request a Quick Callback</h2>
  <form id="callbackForm">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="tel" name="phone" placeholder="Mobile Number" required pattern="[0-9]{10}">
    <select name="service" required>
      <option value="">Select Service</option>
      <option>Luminous Inverter</option>
      <option>Battery Replacement</option>
      <option>UPS Repair</option>
      <option>CCTV Installation</option>
      <option>Laptop Service</option>
    </select>
    <button type="submit">Get Callback</button>
  </form>
</section>

<section id="free-site-inspection">
  <h2>Free Site Inspection in Puttur</h2>
  <p>Book a free power backup assessment for your home, office, or shop.</p>
  <a class="btn btn-primary" href="/contact.html#free-site-inspection">Book Free Inspection</a>
</section>

<section id="load-calculator">
  <h2>Free Inverter Load Calculation Tool</h2>
  <label>Enter total load (Watts)</label>
  <input id="loadWatts" type="number" min="1" placeholder="e.g. 700">
  <button type="button" onclick="calculateBackup()">Calculate</button>
  <p id="calcResult" aria-live="polite"></p>
</section>

<section class="emergency-banner">
  <p><strong>Power Failure Emergency?</strong> Call DhanuTech now for same-day support in Puttur.</p>
  <a href="tel:+919591555095">Emergency Call</a>
</section>
```

```css
.mobile-sticky-cta{position:fixed;left:0;right:0;bottom:0;display:flex;z-index:9999}
.mobile-sticky-cta a{flex:1;text-align:center;padding:.9rem 1rem;color:#fff;font-weight:700;text-decoration:none}
.call-btn{background:#1e3a8a}.wa-btn{background:#16a34a}
@media(min-width:768px){.mobile-sticky-cta{max-width:360px;left:auto;right:16px;bottom:16px;border-radius:10px;overflow:hidden}}
.emergency-banner{background:#dc2626;color:#fff;padding:1rem;border-radius:12px;display:flex;justify-content:space-between;gap:1rem;align-items:center}
.emergency-banner a{background:#fff;color:#b91c1c;padding:.5rem .8rem;border-radius:8px;font-weight:700;text-decoration:none}
```

```js
// Callback form: route to WhatsApp for lightweight lead capture
document.getElementById('callbackForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const msg = `Callback Request%0AName: ${encodeURIComponent(data.get('name'))}%0APhone: ${encodeURIComponent(data.get('phone'))}%0AService: ${encodeURIComponent(data.get('service'))}`;
  window.open(`https://wa.me/919591555095?text=${msg}`, '_blank', 'noopener');
});

function calculateBackup() {
  const watts = Number(document.getElementById('loadWatts')?.value || 0);
  const recommendedVA = Math.ceil((watts / 0.8) / 100) * 100;
  const result = watts > 0
    ? `Recommended inverter capacity: ${recommendedVA} VA (approx).`
    : 'Please enter a valid load in watts.';
  document.getElementById('calcResult').textContent = result;
}
```

---

## Task 4: Local SEO Structured Data (JSON-LD)

```html
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"LocalBusiness",
      "@id":"https://dhanutech.in/#localbusiness",
      "name":"DhanuTech",
      "image":"https://dhanutech.in/logo.png",
      "telephone":"+91-9591555095",
      "address":{"@type":"PostalAddress","addressLocality":"Puttur","addressRegion":"Karnataka","addressCountry":"IN"},
      "areaServed":["Puttur","Dakshina Kannada","Karnataka"],
      "url":"https://dhanutech.in"
    },
    {
      "@type":"ElectricalContractor",
      "@id":"https://dhanutech.in/#electrical",
      "name":"DhanuTech Electrical & Automation",
      "serviceType":["Electrical control panels","Automation","UPS wiring"],
      "areaServed":"Dakshina Kannada"
    },
    {
      "@type":"ComputerRepair",
      "@id":"https://dhanutech.in/#computerrepair",
      "name":"DhanuTech Laptop Service",
      "serviceType":["Laptop repair","Laptop upgrades","Chip-level diagnostics"],
      "areaServed":"Puttur"
    },
    {
      "@type":"Product",
      "name":"Luminous Zelio Inverter",
      "brand":{"@type":"Brand","name":"Luminous"},
      "category":"Home Inverter",
      "offers":{"@type":"Offer","priceCurrency":"INR","price":"14500","availability":"https://schema.org/InStock"}
    },
    {
      "@type":"Product",
      "name":"Luminous Tall Tubular Battery 220Ah",
      "brand":{"@type":"Brand","name":"Luminous"},
      "category":"Inverter Battery",
      "offers":{"@type":"Offer","priceCurrency":"INR","price":"17800","availability":"https://schema.org/InStock"}
    },
    {
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"Are you an authorised Luminous dealer in Puttur?","acceptedAnswer":{"@type":"Answer","text":"Yes, DhanuTech is an authorised Luminous dealer in Puttur with genuine products and warranty support."}},
        {"@type":"Question","name":"Do you provide UPS repair in Puttur?","acceptedAnswer":{"@type":"Answer","text":"Yes, we provide on-site and workshop UPS diagnostics and repair services in Puttur and nearby areas."}}
      ]
    }
  ]
}
</script>
```

---

## Task 5: Trust & Authority Building Section

```html
<section class="authority-strip" aria-label="Trust indicators">
  <article><h3>12+ Years Experience</h3><p>Serving Puttur since 2013.</p></article>
  <article><h3>500+ Happy Customers</h3><p>Homes, shops, offices and institutions.</p></article>
  <article><h3>Authorised Dealer Certificate</h3><p>Display certificate image near hero and contact page.</p></article>
</section>

<section>
  <h2>Google Reviews</h2>
  <iframe
    title="Google Reviews DhanuTech"
    loading="lazy"
    src="https://www.google.com/maps?q=DhanuTech+Puttur&output=embed"
    width="100%" height="300" style="border:0;" referrerpolicy="no-referrer-when-downgrade"></iframe>
</section>

<section>
  <h2>Service Coverage Areas</h2>
  <ul>
    <li>Puttur</li><li>Sullia</li><li>Bantwal</li><li>Belthangady</li><li>Nearby Dakshina Kannada towns</li>
  </ul>
</section>
```

---

## Task 6: Performance & Security

### Netlify `_headers` file

```txt
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-src https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://wa.me;
```

### Performance snippets

```html
<!-- Lazy loading image -->
<img src="/images/luminous-inverter.webp" alt="Luminous inverter installation in Puttur" loading="lazy" width="640" height="420">

<!-- Defer non-critical script -->
<script src="/bee-assistant.js" defer></script>
```

