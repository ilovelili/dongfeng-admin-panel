# Stage 0, compile angular
FROM tiangolo/node-frontend:10 as builder

WORKDIR /app

COPY package*.json /app/

# china registry to speed up npm install
RUN npm i -g mirror-config-china --registry=https://registry.npm.taobao.org --unsafe-perm

RUN npm install

COPY ./ /app/

ARG env=prod

RUN npm run build -- --output-path=./dist/out --environment $env

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=builder /app/dist/out/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=builder /nginx.conf /etc/nginx/conf.d/default.conf

# build prod: docker build -t ilovelili/dongfeng-admin-panel:prod .
# build dev: docker build -t ilovelili/dongfeng-admin-panel:dev --build-arg env="dev" .