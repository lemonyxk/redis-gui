/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 18:07
**/

package websocket

import (
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"github.com/lemoyxk/utils"
	"server/app"
	"server/message"
)

func Login(conn *server.Conn, stream *socket.Stream) error {

	var err error
	var login message.Login
	err = utils.Json.Decode(stream.Data, &login)

	console.Infof("login: %+v\n", login)

	if err != nil {
		return app.Server.Json(conn.FD, app.Json{
			Event: stream.Event,
			Data: http.JsonFormat{
				Status: "ERROR",
				Code:   404,
				Msg:    err.Error(),
			},
		})
	}

	var info = app.Connections.Get(conn.ClientIP())
	if info == nil {
		info, err = app.CreateInfo(login)
		if err != nil {
			return app.Server.Json(conn.FD, app.Json{
				Event: stream.Event,
				Data: http.JsonFormat{
					Status: "ERROR",
					Code:   404,
					Msg:    err.Error(),
				},
			})
		}

		app.Connections.Set(conn.ClientIP(), info)
	} else {
		if info.Name != login.Name || info.Split != login.Split {
			info.Close()
			app.Connections.Delete(conn.ClientIP())
			info, err = app.CreateInfo(login)
			if err != nil {
				return app.Server.Json(conn.FD, app.Json{
					Event: stream.Event,
					Data: http.JsonFormat{
						Status: "ERROR",
						Code:   404,
						Msg:    err.Error(),
					},
				})
			}

			app.Connections.Set(conn.ClientIP(), info)
		}
	}

	info.Name = login.Name
	info.Time = time.Now()
	info.FD = conn.FD
	info.Token = utils.Rand.UUID()
	info.Login = login

	return app.Server.Json(conn.FD, app.Json{
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    info,
		},
	})
}
