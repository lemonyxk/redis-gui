/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-21 18:50
**/

package websocket

import (
	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
)

func Open(conn *server.Conn) {
	console.Info("websocket server:", conn.FD, "open")
}
