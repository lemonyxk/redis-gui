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
	http2 "net/http"
	"os"
	"runtime"
	"time"

	"github.com/gorilla/websocket"
	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	pty "github.com/runletapp/go-console"
	"server/app"
)

type Size struct {
	Cols int `json:"cols"`
	Rows int `json:"rows"`
}

func PTY() {

	app.Server.OnRaw = func(w http2.ResponseWriter, r *http2.Request) {

		var upgrade = websocket.Upgrader{
			HandshakeTimeout: time.Second * 2,
			ReadBufferSize:   4096,
			WriteBufferSize:  4096,
			CheckOrigin: func(r *http2.Request) bool {
				return true
			},
		}

		conn, err := upgrade.Upgrade(w, r, nil)
		if err != nil {
			console.Error(err)
			return
		}

		defer func() { _ = conn.Close() }()

		var stream = http.NewStream(w, r)
		stream.ParseQuery()

		var token = stream.Query.First("token").String()
		var uuid = stream.Query.First("uuid").String()
		if token == "" || uuid == "" {
			return
		}

		var client = app.Connections.Get(uuid)
		if client == nil {
			return
		}

		if client.Token != token {
			return
		}

		proc, err := pty.New(80, 24)
		if err != nil {
			console.Error(err)
			return
		}

		var args []string

		switch runtime.GOOS {
		case "windows":
			args = []string{"cmd.exe", "-l"}
		default:
			args = []string{"/bin/bash", "-c", "$SHELL -l"}
		}

		_ = proc.SetENV(append(os.Environ(), "TERM=xterm"))

		if err := proc.Start(args); err != nil {
			console.Error(err)
			return
		}

		go func() {
			for {
				buf := make([]byte, 1024)
				read, err := proc.Read(buf)
				if err != nil {
					return
				}
				_ = conn.WriteMessage(websocket.BinaryMessage, buf[:read])
			}
		}()

		for {
			_, buf, err := conn.ReadMessage()
			if err != nil {
				console.Info("pty close")
				return
			}

			var size Size

			err = json.Unmarshal(buf, &size)
			if err == nil {
				_ = proc.SetSize(size.Cols, size.Rows)
				continue
			}

			_, _ = proc.Write(buf)
		}
	}
}
