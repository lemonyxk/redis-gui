/**
* @program: server
*
* @description:
*
* @author: lemon
*
* @create: 2022-03-17 14:22
**/

package websocket

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"github.com/lemoyxk/utils"
	"server/app"
	data2 "server/data"
)

var mux sync.RWMutex

func Error(conn *server.Conn, stream *socket.Stream, err error) error {
	_ = app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "ERROR",
			Code:   404,
			Msg:    err.Error(),
		},
	})
	return err
}

func Before(conn *server.Conn, stream *socket.Stream) error {

	console.Info(stream.Event, stream.ID, string(stream.Data))

	var token = utils.Json.Bytes(stream.Data).Get("token").String()
	var uuid = utils.Json.Bytes(stream.Data).Get("uuid").String()
	var db = utils.Json.Bytes(stream.Data).Get("db").Int()

	var client = app.Connections.Get(uuid)
	if client == nil {
		return Error(conn, stream, errors.New("connection not found"))
	}

	var processID = client.GetProcessID()

	if token != client.Token {
		return Error(conn, stream, errors.New("token not match"))
	}

	mux.Lock()
	defer mux.Unlock()

	if client.DB != db {
		if client.Type == "client" {
			client.GetModel().Handler.Do(context.Background(), "SELECT", fmt.Sprintf("%d", db))
		} else {
			err := app.UpdateInfo(client, db)
			if err != nil {
				return Error(conn, stream, err)
			}
		}
	}

	var data = app.DataMap.Get(processID, db)

	if data == nil {
		data = data2.NewData(client.Split)
		app.DataMap.Set(processID, db, data)
		go func() {
			createData(client, data, db)
		}()
	}

	return nil
}

func createData(conn *app.Info, data *data2.Data, db int) {
	var r, err = app.Login(conn.Login)
	if err != nil {
		console.Info(err)
		return
	}

	var processID = conn.GetProcessID()

	var process = app.DataMap.GetProcess(processID)
	process.SetModel(r)
	process.Watch()

	// defer func() { _ = r.Handler.Close() }()

	r.Handler.Do(context.Background(), "SELECT", fmt.Sprintf("%d", db))
	console.Info("create data select db:", db)

	var t = time.Now()

	var resChan = r.Scan("*", 50000)

	var counter = 0

	for result := range resChan {
		data.Insert(result.Result())
		counter++
		if counter%30000 == 0 {
			_ = app.Server.Json(conn.FD, app.Json{
				Event: "/loading",
				Data: http.JsonFormat{
					Status: "SUCCESS",
					Code:   200,
					Msg:    kitty.M{"counter": counter, "db": db, "finish": false},
				},
			})
			console.Info("loading:", counter, "db:", db)
		}
	}

	_ = app.Server.Json(conn.FD, app.Json{
		Event: "/loading",
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    kitty.M{"counter": counter, "db": db, "finish": true},
		},
	})

	console.Info("loading:", counter, "db:", db)

	console.Info("create data time consuming:", time.Now().Sub(t))
}
