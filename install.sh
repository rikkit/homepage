git reset --hard master
git pull

npm cache clean
npm install -g n
n stable

npm install -g grunt
npm install -g grunt-cli

cd ./web/
jam install
npm install
lessc -ru ./res/css/style.less > ./res/css/style.css
cd ..

xbuild /p:Configuration=Release ./homepage.sln

if [ -f ./server/homepage.Api/bin/Release/api.lock ];
then
    kill `cat ./server/homepage.Api/bin/Release/api.lock`
fi

mono-service -d:./server/homepage.Api/bin/Release/ -l:./api.lock -m:homepage-api homepage.Api.exe
