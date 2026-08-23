// listings.json -> README.md. Runs in GitHub Actions; no dependencies.
import fs from "node:fs";
const D = JSON.parse(fs.readFileSync("data/listings.json", "utf8"));
const jobs = D.jobs || [];
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
const ago = (sec) => {
  const d = Math.floor((Date.now() / 1000 - sec) / 86400);
  return d <= 0 ? "today" : d === 1 ? "1d" : `${d}d`;
};
const emoji = (j) => {
  const e = ["\u{1F1FA}\u{1F1F8}"];                       // US role
  if ((j.flags || []).includes("clearance")) e.push("\u{1F510}"); // clearance required
  return e.join(" ");
};
const rows = jobs.map((j) =>
  `| **${esc(j.company)}** | ${esc(j.title)} | ${esc(j.location)} | ${emoji(j)} | ${ago(j.date_posted)} | [Apply](${j.url}) |`
).join("\n");

const README = `# H-1B Sponsored Jobs

> Live US tech roles at employers with **verified USCIS H-1B approval history**.
> Updated twice daily. Free, open data — scrape it, fork it, build on it.

Maintained by [**ApplyLoop**](https://applyloop.pro?utm_source=github&utm_medium=h1blist) · [Report a closed role](../../issues/new?template=closed.yml) · [Raw JSON](data/listings.json)

---

### Why this list is different

Most job lists tell you a role exists. This one tells you the **employer has actually
sponsored H-1B petitions before** — checked against USCIS Employer Data Hub filings
for FY2020–FY2023, with IT consultancies and staffing firms removed.

| | |
|---|---|
| \u{1F1FA}\u{1F1F8} | US-based role |
| \u{1F510} | Security clearance required |

Roles that say **"no sponsorship"** or **"US citizens only"** are excluded before
they ever reach this list.

---

## ${jobs.length} Open Roles

| Company | Role | Location | | Posted | |
|---|---|---|---|---|---|
${rows}

---

### Honest limitations

- **Sponsorship history describes the EMPLOYER, not this specific role.** A company
  that sponsored 2,000 petitions may still post a req with no sponsorship budget.
  Always confirm with the employer.
- **We do not monitor these roles for closure.** This is a point-in-time list. If you
  find a dead link, [open an issue](../../issues/new?template=closed.yml) or a PR and
  we will remove it.
- **Newest USCIS data is FY2023.** FY2024/25 are not yet published by USCIS.

### Data

\`data/listings.json\` is the source of truth and is machine-readable. Released under
[CC0](LICENSE) — no attribution required, though it is appreciated. Agents and bots
are explicitly welcome; there is also a live JSON endpoint:

\`\`\`
https://applyloop.pro/api/public/h1b-jobs
\`\`\`

---

<div align="center">
  <h3>Tired of retyping the same application?</h3>
  <p><a href="https://applyloop.pro?utm_source=github&utm_medium=h1blist_footer"><strong>ApplyLoop</strong></a> watches these boards around the clock, scores roles against your resume, and fills the applications for you — review-first, with a screenshot receipt of every submission.</p>
  <p><sub>Built for people on F-1 OPT and H-1B timelines, where speed decides outcomes.</sub></p>
</div>

<sub>Last updated: ${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC</sub>
`;
fs.writeFileSync("README.md", README);
console.log(`README written: ${jobs.length} roles`);
