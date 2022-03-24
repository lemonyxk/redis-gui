/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-03-17 14:23
**/

package websocket

import (
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"server/app"
)

func InfoAll(conn *server.Conn, stream *socket.Stream) error {
	var client = app.Connections.Get(conn.Name)

	client.SetEmitInfoAll(true)

	var data = app.DataMap.GetProcess(client.GetProcessID())

	return app.Server.Json(conn.FD, app.Json{
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    data.GetInfoAll(),
		},
	})
}

func CloseInfoAll(conn *server.Conn, stream *socket.Stream) error {
	var client = app.Connections.Get(conn.Name)
	client.SetEmitInfoAll(false)
	return nil
}
