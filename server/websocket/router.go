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
	router.Group().Handler(func(handler *server.RouteHandler) {
		handler.Route("/login").Handler(Login)

		handler.Route("/infoAll").Before(Before).Handler(InfoAll)
		handler.Route("/closeInfoAll").Before(Before).Handler(CloseInfoAll)
	})
}
