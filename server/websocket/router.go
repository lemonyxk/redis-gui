/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 23:24
**/

package websocket

import (
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
)

func Router(router *server.Router) {
	router.Route("/login").Handler(Login)
}
