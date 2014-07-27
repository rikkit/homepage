forever stop server/index.js
rm cache.json

git reset --hard master
git pull

npm cache clean
npm install -g n
n stable
npm install
jam install

lessc -ru ./web/res/css/style.less > ./web/res/css/style.css

forever start --sourceDir ./server/ index.js 8080
