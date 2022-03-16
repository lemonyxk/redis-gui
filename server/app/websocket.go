/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 10:45
**/

package app

import (
	"errors"

	jsoniter "github.com/json-iterator/go"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
)

type WebSocket struct {
	server.Server
}

type Json struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

func (w *WebSocket) Json(fd int64, pack Json) error {

	var conn, ok = w.Server.GetConnection(fd)
	if !ok {
		return errors.New("client is close")
	}

	data, err := jsoniter.Marshal(pack)
	if err != nil {
		return err
	}

	_, err = conn.Write(int(socket.Text), data)

	return err
}
