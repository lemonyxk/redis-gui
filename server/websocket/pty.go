/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-03-16 18:46
**/

package websocket

import (
	"encoding/json"
	"os"
	"runtime"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/lemoyxk/console"
	kitty2 "github.com/lemoyxk/kitty/v2"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	pty "github.com/runletapp/go-console"
	"server/app"
)

var ptyMap = PtyMap{data: make(map[int64]pty.Console)}

type PtyMap struct {
	data map[int64]pty.Console
	mux  sync.RWMutex
}

func (p *PtyMap) Get(key int64) pty.Console {
	p.mux.RLock()
	defer p.mux.RUnlock()
	return p.data[key]
}

func (p *PtyMap) Set(key int64, value pty.Console) {
	p.mux.Lock()
	defer p.mux.Unlock()
	p.data[key] = value
}

func (p *PtyMap) Delete(key int64) {
	p.mux.Lock()
	defer p.mux.Unlock()
	delete(p.data, key)
}

type Size struct {
	Cols int `json:"cols"`
	Rows int `json:"rows"`
}

func PTY() {

	var ws = &app.WebSocket{}
	ws.Addr = "127.0.0.1:8669"

	var webSocketServerRouter = kitty2.NewWebSocketServerRouter()

	Router(webSocketServerRouter)

	ws.OnOpen = func(conn *server.Conn) {

		var stream = http.NewStream(conn.Response, conn.Request)
		stream.ParseQuery()

		var token = stream.Query.First("token").String()
		var uuid = stream.Query.First("uuid").String()
		if token == "" || uuid == "" {
			_ = conn.Close()
			return
		}

		var client = app.Connections.Get(uuid)
		if client == nil {
			_ = conn.Close()
			return
		}

		if client.Token != token {
			_ = conn.Close()
			return
		}

		var p = ptyMap.Get(conn.FD)
		if p == nil {
			var proc, err = pty.New(80, 24)
			if err != nil {
				panic(err)
			}
			p = proc
			ptyMap.Set(conn.FD, proc)
		}

		var args []string

		switch runtime.GOOS {
		case "windows":
			args = []string{"cmd.exe", "-l"}
		default:
			args = []string{"/bin/bash", "-c", "$SHELL -l"}
		}

		_ = p.SetENV(append(os.Environ(), "TERM=xterm"))

		if err := p.Start(args); err != nil {
			panic(err)
		}

		go func() {
			for {
				buf := make([]byte, 1024)
				read, err := p.Read(buf)
				if err != nil {
					return
				}
				_ = conn.Conn.WriteMessage(websocket.BinaryMessage, buf[:read])
			}
		}()

	}

	ws.OnClose = func(conn *server.Conn) {
		var p = ptyMap.Get(conn.FD)
		if p == nil {
			return
		}
		_ = p.Close()
		ptyMap.Delete(conn.FD)
		console.Info(conn.FD, "pty close")
	}

	ws.OnUnknown = func(conn *server.Conn, message []byte, next server.Middle) {

		if len(message) == 0 {
			return
		}

		var size Size

		var p = ptyMap.Get(conn.FD)
		if p == nil {
			return
		}

		var err = json.Unmarshal(message, &size)
		if err == nil {
			_ = p.SetSize(size.Cols, size.Rows)
			return
		}

		_, _ = p.Write(message)
	}

	ws.PingHandler = func(conn *server.Conn) func(appData string) error {
		return func(appData string) error {
			return conn.Conn.SetReadDeadline(time.Now().Add(ws.HeartBeatTimeout))
		}
	}

	ws.OnSuccess = func() {
		console.Info("websocket server start success", app.Server.Addr)
	}

	go ws.SetRouter(webSocketServerRouter).Start()
}
