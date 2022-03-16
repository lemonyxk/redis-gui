current=$(pwd)
server=$current/server
client=$current/client
electron=$current/electron

function buildClient() {
    echo "build client ..."
    # build client
    cd "$client" || exit
    yarn build --aot --prod

    # clean resources
    cd "$current" || exit
    rm -rf electron/src/dist/*
    cp -R client/build/* electron/src/dist
}

function buildMacServer() {
    echo "build server ..."
    # mac
    cd "$server" || exit
    go build -o bin/server main.go
    cd "$current" || exit
    cp server/bin/server electron/src/mac-server
}

function buildMacElectron() {
    cd "$electron" || exit
    yarn make
}

function buildWindowsServer() {
    # windows
    cd "$server" || exit
    env GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc go build -o bin/server.exe main.go
    cd "$current" || exit
    cp server/bin/server.exe electron/src/windows-server
}

function buildWindowsElectron() {
    cd "$electron" || exit
    yarn make --platform win32
}

if [ "$1" == mac ]; then
    echo "build on mac"
    buildClient
    buildMacServer
    buildMacElectron
    echo "build on mac success"
elif [ "$1" == windows ]; then
    echo "build on windows"
    buildClient
    buildWindowsServer
    buildWindowsElectron
    echo "build on windows success"
else
    echo "not support"
fi
