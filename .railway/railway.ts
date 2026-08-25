import { defineRailway, postgres, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const Postgres = postgres("Postgres", { region: "europe-west4-drams3a" });
  const postgresVolume = volume("postgres-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "europe-west4-drams3a", sizeMB: 5000 });
  // Production only, enforced by .github/scripts/create-preview-env.sh: backup
  // object keys carry no environment discriminator, so a preview environment
  // running this cron would upload its own database into the production bucket
  // looking exactly like a real backup. Not expressible here — the Railway CLI
  // does not yet pass environment context to this file (ctx is {} as of 5.43.2).
  const DatabaseBackup = service("Database Backup", {
    replicas: { "europe-west4-drams3a": 1 },
    deploy: { cronSchedule: "0 3 * * *", restartPolicyType: "NEVER" },
    networking: { privateNetworkEndpoint: "db-backup" },
    env: {
      DATABASE_URL: preserve(),
      R2_ACCESS_KEY_ID: preserve(),
      R2_BUCKET: preserve(),
      R2_ENDPOINT: preserve(),
      R2_SECRET_ACCESS_KEY: preserve(),
    },
  });
  const App = service("App", {
    replicas: { "europe-west4-drams3a": 1 },
    build: {
      builder: "RAILPACK",
      buildCommand:
        'NODE_ENV=production DATABASE_URL="$DATABASE_PUBLIC_URL" npm run migrate && NODE_ENV=production DB_POOL_MAX=3 DATABASE_URL="$DATABASE_PUBLIC_URL" npm run build',
    },
    start: "npm run start",
    // restartPolicyType is omitted deliberately: ON_FAILURE is Railway's
    // default, so it is stored as unset and an explicit value here would leave
    // a diff that never converges. Only the retry count differs from default.
    deploy: { restartPolicyMaxRetries: 3 },
    domains: ["www.booksabout.food"],
    networking: { privateNetworkEndpoint: "web" },
    env: {
      ADMIN_API_SECRET: preserve(),
      AUTH_REDIRECT_PROXY_URL: preserve(),
      AUTH_SECRET: preserve(),
      AWS_ACCESS_KEY_ID: preserve(),
      AWS_REGION: preserve(),
      AWS_S3_BUCKET: preserve(),
      AWS_S3_ENDPOINT: preserve(),
      AWS_SECRET_ACCESS_KEY: preserve(),
      BASE_URL: preserve(),
      BETTER_AUTH_SECRET: preserve(),
      CRON_SECRET: preserve(),
      DATABASE_DIRECT_URL: preserve(),
      DATABASE_PUBLIC_URL: preserve(),
      DATABASE_URL: preserve(),
      ENABLE_SPLASH: preserve(),
      GOOGLE_API_KEY: preserve(),
      GOOGLE_CLIENT_ID: preserve(),
      GOOGLE_CLIENT_SECRET: preserve(),
      INNGEST_EVENT_KEY: preserve(),
      INNGEST_SIGNING_KEY: preserve(),
      MIXPANEL_TOKEN: preserve(),
      NEXT_PUBLIC_ADMIN_API_HOST: preserve(),
      NEXT_PUBLIC_FATHOM_ID: preserve(),
      NEXT_PUBLIC_MAPBOX_TOKEN: preserve(),
      NEXT_PUBLIC_SENTRY_DSN: preserve(),
      NIXPACKS_INSTALL_CMD: preserve(),
      NPM_RC: preserve(),
      PAYLOAD_SECRET: preserve(),
      RAILPACK_INSTALL_CMD: preserve(),
      S3_DOMAIN: preserve(),
      SENTRY_AUTH_TOKEN: preserve(),
      SENTRY_ORG: preserve(),
      SENTRY_PROJECT: preserve(),
      SHARP_INSTALL_FORCE: preserve(),
      SKIP_REDIS_CACHE: preserve(),
      SMTP_HOST: preserve(),
      SMTP_PASS: preserve(),
      SMTP_PORT: preserve(),
      SMTP_SECURE: preserve(),
      SMTP_USER: preserve(),
      TURBO_CACHE: preserve(),
      TURBO_DOWNLOAD_LOCAL_ENABLED: preserve(),
      TURBO_REMOTE_ONLY: preserve(),
      TURBO_RUN_SUMMARY: preserve(),
      UPSTASH_REDIS_TOKEN: preserve(),
      UPSTASH_REDIS_URL: preserve(),
    },
  });

  return project("books-about-food", {
    resources: [DatabaseBackup, Postgres, App, postgresVolume],
  });
});
