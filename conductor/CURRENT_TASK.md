# Current task

## Scope and authority

- Finish delivery; do not expand audits. Whole-app UI/UX objective remains incomplete. User explicitly requires existing S3 for media and approved push, deployment, CMS import/content/media publication. Frontend may proceed after verified photo import, now satisfied. No paid provider calls, hosted generation, history rewrite, unrelated services, or user Chrome.
- Current branch main; last pushed 468d7b2. Preserve preexisting untracked conductor/unslop-round2-deduped.json, conductor/unslop-round2-raw-findings.json, docs/HANDOFF_2026-10-22.md. They are excluded from commits.
- Latest continuation requires completing the S3 rollout, CMS media, runtime verification, commit/push and cleanup. Do not ask again for authorized delivery actions.

## Completed production work

- Backend deploy 40311616319 succeeded. Earlier failures were corrected: palette test included print overrides; prod permits main only; server untracked data-backup/ and public/ were incorrectly treated as tracked edits. Both server directories remain preserved. Deployment uses exact SHA image/source, tracked-change guards, nonforce checkout, no global pruning or PSI reporting.
- Photo import 40333395855 succeeded. Public full-field readback: 150 unchanged posts, catalog unchanged. Evidence .scratch/cms-validation/production-photo-import.log and production-photo-readback.log. Source snapshot SHA256 e3f405147291de64a513a35e5ef7a725decb936dcfc2490428bcda8017fe97d0.
- Git photo seed removed in2ec9266 after successful production readback. Ignored recovery copy .scratch/cms-validation/kameko-posts.recovery.json. Photo images stay on X; Strapi owns metadata. CMS-only reader has 60s caching, in-flight sharing, strict validation and last-good CMS fallback; no Git or paid runtime fallback.
- All 30 prepared project text updates published and read back. .scratch/content-audit/production-publish.log. Input project-patches.en.json covers42 records;12 unchanged. Loveca formula corrected in CMS. Existing rich narratives preserved.
- Missing draft media/banner relations restored from published records before publishing; other draft fields and published records verified unchanged. .scratch/content-audit/draft-media-restoration.log. No nonempty draft media overwritten.
- Courta Sports already visibly present in CMS Jan–Oct2026; preserve externally supplied role/dates. Saved source .scratch/content-audit/courta-experience-source.md; do not insert duplicate experience.

## Active S3 rollout

- Existing personal MinIO alias hamweb -> https://s3.ham-san.net. Bucket personal, prefix ham-san-net/media, region local (confirmed actual server error and successful corrected request). Do not use default AWS profile: it belongs to unrelated fukui-maas-s3 identity; only identity read performed there, no bucket calls.
- Created ham-san-net-media scoped access key restricted to personal/ham-san-net/media/* plus prefix listing/location. Public download policy applies only to that prefix, not whole bucket. Real provider upload/public byte readback/delete probe passed; no probe retained.
- Seven repository S3 deployment secrets configured. Values never printed. Credential recovery files .scratch/cms-validation/s3-media-access.json and s3-env.json are mode0600 and ignored; policy s3-media-policy.json. No root MinIO credentials copied into app.
- Installed @strapi/provider-upload-aws-s3@5.47.0. plugins.ts preserves GraphQL and enables S3 only with complete configuration; path-style endpoint, no ACL header, public stable URLs, immutable year cache. CSP permits configured S3 origin while preserving existing sources. .env.example lists names only.
- deploy.yml passes seven secrets through SSH and atomically updates only those keys in server .env (mode0600), preserving other values. Existing compose env_file propagates S3 settings through future maintenance/restarts. Deployment must succeed before new CMS media uploads.
- New frontend changes remove per-project copy overrides and all four call sites; existing locale fallback tests retained, six obsolete override tests removed. Git seed deleted; docs updated for CMS ownership. No media committed.
- Postinstall regenerated unrelated Outline schema; only that generated drift was restored to HEAD.

## Verification and immediate next action

- Production deployment40348707278 succeeded at468d7b2, both services live. Media preflight40352404990 passed:130local records/635assets. Write migration40353061239 dispatched; inspect result before prepared15asset/10project upload. Live mobile photo screenshot inspected:288photos/133posts. Public object policy grants GetObject only on project prefix; anonymous listing removed. Existing S3 objectExists probe passed with scoped policy.

- Latest capped suite:378pass/0fail, .scratch/cms-validation/s3-delivery-tests.log. No new tests created. Previous384 count included six removed editorial-override tests. API build and Astro Node build passed; logs s3-api-build.log and s3-astro-build.log. Scoped formatting and diff checks passed.
- Deploy40342087912 built both images and passed Verify, then backend pull failed with actual Docker no-space error. Old API runtime inherited full build workspace. New fix uses filtered production API dependencies and compiled output only, Node CLI startup, metadata-only dependency layers cached across source changes. Fresh API production install succeeds (~879MB node_modules). Next push packaging/inspection fix, inspect exact project image holders/free bytes, reclaim only unused project images, then redeploy. Check disk bytes before heavy work. Last available15766984KiB. Use mise exec node@24.16.0 explicitly; MISE_NODE_VERSION prefix alone did not select Node and caused SQLite ABI mismatch.
- Commit/push intended S3/frontend/seed/doc changes after checks, excluding three preexisting files. Use skip-ci commit to prevent automatic frontend rollout until manual selected targets are ready. Fetch before branch work; verify personal GH identity via explicit GH_TOKEN from gh auth token --user hamzaabamboo. Human git identity only.
- Deploy S3 backend (and verified frontend when ready), then upload prepared CMS media via .scratch/content-audit/upload-project-media.mjs --write --publish with official temporary token. Existing helper source1–530/EOF read and validate-only passed15assets/10projects. Twelve screenshots reinspected/hashed in media-primary-review.json. Three concept SVGs inspected; redundant R-divide SVG inspected and excluded in favor of actual screenshots.
- Existing media migration promoted to apps/api/scripts/migrate-local-media.cjs plus fixed migrate-media.yml. Primary read complete, official provider wrapper/objectExists APIs inspected, syntax/format pass. Default dry-run; S3 byte verification before URL/provider/formats update, exact populated metadata/relations readback, original files retained. Durable host backup mount required. Run after S3 backend deployment, inspect preflight before write.
- Frontend Docker artifact had bare external imports but copied only dist. Added clean filtered production Astro dependency stage and matching Debian Node runtime; fresh filtered install succeeds, React available and Strapi absent. Runtime packaging/browser still needs deployment verification. Frontend image now SHA-pinned; deployment targets only client without global prune.

- Actual public object HEAD exposed missing Cache-Control: provider ignores bucket params for this field. Moved cache directive into upload/uploadStream actionOptions; config assertions and scoped formatting passed. Existing object cache metadata repair .scratch/cms-validation/cache-media.cjs runs with prefix-scoped key, conditional self-copy, metadata/byte SHA256 readback; process23902 active. Migration40353061239 still running; do not upload or deploy concurrently.

## Mandatory credential cleanup

- Active production custom CMS token issued by workflow40335326345. Plaintext only .scratch/cms-validation/production-cms.token mode0600; do not print. It permits project read/update and upload read/write/rollback, no project create/delete. Official Strapi service, no JWT forging.
- After all CMS writes: dispatch cms-access.yml revoke with .scratch/cms-validation/cms-access-revoke-inputs.json, verify successful absence readback, then remove owned local token/private key. RSA private key .scratch/cms-validation/cms-access.private.pem mode0600. Never finish while token remains active. Minimum supported finite expiry7days; immediate revoke mandatory.
- Keep persistent S3 app key in GitHub secrets/server env; remove local temporary secret copies only after deployment/readback. Never commit secret files, screenshots, SQLite or .scratch.

## UI/runtime evidence boundary

- Prior accepted fixes: home/room deferral, navigation/headings, locale links, tags44px, project dates, Events chevrons, About empty stack/print, photo viewer wheel containment. Supporting receipts .scratch/ui-vibe/resumed-2026-10-26/{runtime-observations,project-tranche-observations,project-layout-observations,resume-print-tags-observations,project-tranche-2-observations,project-tranche-3-observations}.json.
- Latest prior Astro build49854 passed0errors/0warnings/2hints plus existing chunk warning. Previous lint0errors/41warnings. New S3/frontend aggregate builds still required.
- Whole-app coverage index .scratch/ui-vibe/route-coverage.json is not acceptance. Remaining project/localized/interaction coverage remains explicit there. Do not claim whole-app completion from narrow CMS verification.
- Exactly one isolated agent-browser session, headed on every command. Prefix DO_NOT_TRACK=1 AGENT_BROWSER_ARGS=--use-mock-keychain,--password-store=basic,--mute-audio. Inspect sessions before/after; leave unrelated sessions alone. No mailto/tel/nonHTTP clicks, OS automation, user Chrome, audio/system changes. Existing ham-ui-vibe browser and owned4322 server remain active; reuse them.
- Preserve editable room assets/sources. No Git history rewrite; prior orphan pack cleanup reclaimed1412038656B with fsck proof, history unchanged. Disk decisions use available bytes/trend/workload, not rounded percent.
- Relevant skills already fully read in this conversation: named UI skills, agent-browser core, GYST, check+required references, performance, migration and verification/handoff gates. Do not reopen broad histories/notes. Memory only located Courta source; final citation MEMORY.md34–48 if relying on it.

- Deployment diagnostic in import-photos inspection now reports project images/current holders and filesystem bytes. Optional cleanup flag defaults false; explicit cleanup removes only API/Astro repository tags with no container holders, no force/global prune/data deletion. Inspect evidence before enabling.
- Local built gallery actual browser proof in .scratch/ui-vibe/s3-delivery/photo-observations.json:288photos/133posts, filter35/15, 2048px viewer, native wheel lock0→0, Escape then wheel0→600, mobile390×844. Native headed capture initially used wrong focused window; verified owned ChromeTesting profile/onlytasktab, activating t1 and absolute screenshot path restored correct capture. No user Chrome interaction. Task browser ham-ui-vibe and local Node4322 exec86760 active; leave unrelated seiyuu-research session untouched.
