# Minimal one-shot backup container: pg_dump 18 -> Cloudflare R2.
# Run on Railway's native Cron (runs to completion, then exits).
FROM postgres:18

RUN apt-get update \
  && apt-get install -y --no-install-recommends awscli ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

ENTRYPOINT []
CMD ["/usr/local/bin/backup.sh"]
