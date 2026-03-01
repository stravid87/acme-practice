# --- Stage 1: Extract Traefik Binary ---
FROM traefik:v3.0 AS traefik_bin

# --- Stage 2: Build Node.js App ---
FROM node:20-slim AS node_builder
WORKDIR /app
# We target the proxy folder specifically to keep /app clean
COPY s6-rc.d/proxy/package*.json ./
RUN npm install --no-audit
COPY s6-rc.d/proxy/ .

# --- Stage 3: Final Unified Image ---
FROM node:20-alpine
WORKDIR /app

# 1. Install dependencies for extraction
RUN apk add --no-cache xz

# 2. Download and extract BOTH required parts
# Note: We extract 'noarch' first, then the binaries ('x86_64')
ADD https://github.com/just-containers/s6-overlay/releases/download/v3.1.6.2/s6-overlay-noarch.tar.xz /tmp/
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz

ADD https://github.com/just-containers/s6-overlay/releases/download/v3.1.6.2/s6-overlay-x86_64.tar.xz /tmp/
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz

# 3. Create symlinks so s6-rc is available in the standard path
RUN ln -s /package/admin/s6-overlay/command/s6-rc /usr/bin/s6-rc && \
    ln -s /package/admin/s6-overlay/command/s6-rc-compile /usr/bin/s6-rc-compile
    
# 2. Copy Binaries and Application Source
COPY --from=traefik_bin /usr/local/bin/traefik /usr/local/bin/traefik
COPY --from=node_builder /app /app

# 3. Copy Configurations and Certificates
# Note: Ensure your local 's6-rc.d' has the 'user' bundle folder!
COPY ./s6-rc.d /etc/s6-overlay/s6-rc.d
COPY ./traefik-config /etc/traefik
COPY ./certs /etc/traefik/certs

# 4. Critical Windows Fix: Convert CRLF to LF and set Permissions
RUN apk add --no-cache dos2unix && \
    find /etc/s6-overlay/s6-rc.d -type f -exec dos2unix {} + && \
    chmod -R +x /etc/s6-overlay/s6-rc.d/

ENV PATH="/package/admin/s6-overlay/command:$PATH"

# This tells S6 to specifically start the 'user' bundle (and its contents) on boot
ENV S6_STAGE2_HOOK="/usr/bin/s6-rc -u change user"

# 5. Boot using S6 Init
ENTRYPOINT ["/init"]

# MANUAL INIT OF TWO PROCESSES
# RUN echo "#!/bin/sh" > /start.sh && \
#     echo "traefik --configFile=/etc/traefik/traefik.yml &" >> /start.sh && \
#     echo "cd /app && node index.js" >> /start.sh && \
#     chmod +x /start.sh
# ENTRYPOINT ["/start.sh"]

EXPOSE 443

# Run the app
# / # cd /app
# /app # node index.js

# Run Traefik
# traefik --configFile=/etc/traefik/traefik.yml