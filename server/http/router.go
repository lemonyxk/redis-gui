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
		handler.Get("/list").Handler(List)
		handler.Get("/db").Handler(DB)
		handler.Get("/type").Handler(Type)
		handler.Get("/scan").Handler(Scan)
		handler.Post("/do").Handler(Do)
	})
}
