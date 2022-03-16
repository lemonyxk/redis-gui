/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 12:16
**/

package websocket

import (
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"server/app"
)

func Close(conn *server.Conn) {
	console.Info("websocket server:", conn.FD, "close")
	var client = app.Connections.Get(conn.ClientIP())
	if client == nil {
		return
	}
	var t = time.Now()
	time.AfterFunc(time.Second*10, func() {
		if client.Time.Sub(t) < 0 {
			client.Close()
			app.Connections.Delete(conn.ClientIP())
			console.Info("[websocket]", "close", conn.ClientIP())
		}
	})
}
