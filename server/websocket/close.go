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

	var client = app.Connections.Get(conn.Name)
	if client == nil {
		return
	}

	var t = time.Now()
	time.AfterFunc(time.Second*10, func() {
		// info will be deleted when the connection open
		// so you need get the newest info
		var client = app.Connections.Get(conn.Name)
		if client != nil && client.Time.Sub(t) < 0 {
			client.Close()
			app.Connections.Delete(conn.Name)
			console.Info("[websocket]", "close", conn.Name, conn.ClientIP())
		}
	})
}
