FROM nginx:1.19-alpine

# https://github.com/nginxinc/docker-nginx/pull/280#issuecomment-427963755
RUN mkdir -p /var/cache/nginx /var/run && chmod 777 /var/cache/nginx /var/run
RUN sed -ri '/^user[[:space:]]/d' /etc/nginx/nginx.conf

COPY letsencrypt-dhparams.pem letsencrypt-dhparams.pem
RUN chmod 0755 letsencrypt-dhparams.pem
COPY letsencrypt-recommended-ssl.conf letsencrypt-recommended-ssl.conf
RUN chmod 0755 letsencrypt-recommended-ssl.conf

CMD nginx