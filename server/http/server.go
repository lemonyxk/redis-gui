/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 01:20
**/

package http

import (
	"log"

	kitty2 "github.com/lemoyxk/kitty/v2"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/http/server"
)

func Start() {

	var httpServer = kitty2.NewHttpServer("127.0.0.1:8666")

	var httpServerRouter = kitty2.NewHttpServerRouter()

	httpServer.Use(func(next server.Middle) server.Middle {
		return func(stream *http.Stream) {
			stream.Response.Header().Set("Access-Control-Allow-Origin", "*")
			stream.AutoParse()
			next(stream)
		}
	})

	Router(httpServerRouter)

	httpServer.OnSuccess = func() {
		log.Println(httpServer.LocalAddr())
	}

	go httpServer.SetRouter(httpServerRouter).Start()

}
