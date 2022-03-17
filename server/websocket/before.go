/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-03-17 14:22
**/

package websocket

import (
	"errors"

	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"github.com/lemoyxk/utils"
	"server/app"
)

func Before(conn *server.Conn, stream *socket.Stream) error {

	var token = utils.Json.Bytes(stream.Data).Get("token").String()
	var uuid = utils.Json.Bytes(stream.Data).Get("uuid").String()

	if uuid != conn.Name {
		return errors.New("uuid not match")
	}

	var client = app.Connections.Get(uuid)
	if client == nil {
		return errors.New("client not found")
	}

	if client.Token != token {
		return errors.New("token not match")
	}

	return nil
}
