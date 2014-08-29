forever stop server/index.js
rm server/cache.json

git reset --hard master
git pull

npm cache clean
npm install -g n
n stable

cd server/
npm install

cd ../web/
jam install

lessc -ru ./web/res/css/style.less > ./web/res/css/style.css

forever start --sourceDir ./server/ index.js 8080
