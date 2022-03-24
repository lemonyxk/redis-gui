/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 23:21
**/

package websocket

import (
	jsoniter "github.com/json-iterator/go"
	"github.com/lemoyxk/console"
	kitty2 "github.com/lemoyxk/kitty/v2"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"server/app"
)

func Start() {

	app.Server = &app.WebSocket{}
	app.Server.Addr = "127.0.0.1:8667"
	app.Server.Path = "/ws"

	var webSocketServerRouter = kitty2.NewWebSocketServerRouter()

	Router(webSocketServerRouter)

	app.Server.OnUnknown = func(conn *server.Conn, message []byte, next server.Middle) {
		var j = jsoniter.Get(message)
		var id = j.Get("id").ToInt64()
		var route = j.Get("event").ToString()
		var data = j.Get("data").ToString()
		if route == "" {
			return
		}
		next(conn, &socket.Stream{Pack: socket.Pack{Event: route, Data: []byte(data), ID: id}})
	}

	app.Server.OnOpen = Open
	app.Server.OnClose = Close

	app.Server.OnSuccess = func() {
		console.Info("websocket server start success", app.Server.Addr)
	}

	go app.Server.SetRouter(webSocketServerRouter).Start()

}
