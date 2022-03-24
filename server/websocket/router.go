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
	router.Group().Before(Before).Handler(func(handler *server.RouteHandler) {
		handler.Route("/login").PassBefore().Handler(Login)

		handler.Route("/infoAll").Handler(InfoAll)
		handler.Route("/closeInfoAll").Handler(CloseInfoAll)

		handler.Route("/list").Handler(List)
		handler.Route("/db").Handler(DB)
		handler.Route("/scan").Handler(Scan)
		handler.Route("/type").Handler(Type)
		handler.Route("/do").Handler(Do)
	})
}
