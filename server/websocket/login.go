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
	"sync"
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"github.com/lemoyxk/utils"
	"server/app"
	"server/message"
)

var mux sync.RWMutex

func Login(conn *server.Conn, stream *socket.Stream) error {

	var err error
	var login message.Login
	err = utils.Json.Decode(stream.Data, &login)

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

	var uuid = utils.Json.Bytes(stream.Data).Get("uuid").String()
	console.Info("uuid:", uuid)

	mux.Lock()
	defer mux.Unlock()

	var info = app.Connections.Get(uuid)
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

		app.Connections.Set(uuid, info)
	} else {
		if info.Name != login.Name || info.Split != login.Split {
			info.Close()
			app.Connections.Delete(uuid)
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

			app.Connections.Set(uuid, info)
		}
	}

	info.Name = login.Name
	info.Time = time.Now()
	info.FD = conn.FD
	info.Token = utils.Rand.UUID()
	info.Login = login

	conn.Name = uuid

	return app.Server.Json(conn.FD, app.Json{
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    info,
		},
	})
}
