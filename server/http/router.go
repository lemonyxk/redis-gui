/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 21:50
**/

package http

import (
	"github.com/lemoyxk/kitty/v2/http/server"
)

func Router(router *server.Router) {
	router.Group().Before(before).Handler(func(handler *server.RouteHandler) {
		handler.Route("GET", "/list").Handler(List)
		handler.Route("GET", "/db").Handler(DB)
		// handler.Route("GET", "/all").Handler(Scan)
		handler.Route("GET", "/type").Handler(Type)
		handler.Route("POST", "/do").Handler(Do)
	})
}
