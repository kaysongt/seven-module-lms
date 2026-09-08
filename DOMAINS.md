# KingsWord locations and domains

One Next.js application serves the KingsWord network and five local sites. The
existing PostgreSQL training programme, accounts and staff roles remain shared.
No database migration or reseeding is needed for this change.

| Location | Requested hostname | Preview path |
| --- | --- | --- |
| Chicago | chicago.kingsword.org | /locations/chicago |
| Nigeria | nigeria.kingsword.org | /locations/nigeria |
| Calgary | calgary.kingsword.org | /locations/calgary |
| Dallas | dallas.kingsword.org | /locations/dallas |
| London | londonkingsword.org | /locations/london |

Each location supports `/`, `/about`, `/contact` and `/children` on its hostname.
Those pages are also available beneath each preview path. `/locations` lists all
five locations. On a known church hostname, location links switch domains; on a
local or Vercel preview hostname, they stay within the preview using paths.
The network homepage appears on other hosts, including the Vercel project URL
and `kingsword.org` if that domain is separately connected.

## Domain cutover

The existing Vercel project is `seven-module-lms` in `kaysongts-projects`, linked
to `kaysongt/seven-module-lms`. Retain its database environment and deployment
flow. Do not create another database or overwrite another KTI project.

1. Review the deployment's five preview paths and their About/Contact pages.
2. Confirm London spelling: the requested destination is **londonkingsword.org**;
   the existing published London website is **kingswordlondon.org**. The latter
   remains a content source, not an automatically redirected domain.
3. Add the five confirmed hostnames to this Vercel project's Production domains.
4. At each DNS provider, save the existing records and apply the **exact DNS
   values Vercel returns**. Do not guess a shared CNAME or IP: Vercel can assign
   project-specific values. Replace only conflicting web records for the exact
   hostnames; preserve mail records and the `kingsword.org` apex website.
5. Complete any ownership-verification TXT records, wait for DNS verification
   and HTTPS certificates, then confirm each hostname renders the right church.
6. Keep `APP_URL` set to the shared portal's approved HTTPS origin. Activation
   links deliberately use this configured value, never an incoming Host header.
7. Validate the existing training flow with the production database before
   opening enrollment. Roll back web DNS records if cutover must be reversed.

Application routing is configured in code; that alone does **not** create DNS
records, register domains, issue certificates or replace the live church sites.
`www.` aliases are recognized by the application but require their own hosting
and DNS configuration if wanted. The apex ministry site is not part of the five
requested domain cutovers.

## Shared training

All five hosts use the same accounts, curriculum, progress and administrator
permissions. Sessions stay host-only, so someone moving to another domain signs
in again with the same account. This includes London, which is a separate root
domain. There is no cross-domain SSO and no per-location staff isolation.
Do not use this setup to promise isolated regional administration. Keep
`DATABASE_URL` and `DIRECT_URL` consistent on the single production project.

## Content maintenance and sources

Edit `src/lib/locations.ts` for domains, service times, contacts and links.
Chicago's existing detailed pages remain in `src/components/chicago/` and its
original content settings remain in `src/lib/church.ts`.

Published sources checked September 8, 2026:

- Chicago: https://chicago.kingsword.org/
- Nigeria congregations, Dallas address/phone, Calgary phone:
  https://www.kingsword.org/locations
- Calgary address and Sunday time:
  https://kingswordcalgary.churchcenter.com/home
- London address, contact and Sunday time: https://kingswordlondon.org/
- London livestream: https://kingswordlondon.org/watch-live/live/

Nigeria is a regional directory, with four listed congregations and a link to
the complete ministry directory. Dallas service times and unverified local
giving/streaming links are omitted; visitors are directed to the local team.
Do not copy Chicago's donation destination into other location settings.
