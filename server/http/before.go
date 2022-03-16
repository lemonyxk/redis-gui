/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-20 14:14
**/

package http

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"server/app"
	data2 "server/data"
)

var mux sync.RWMutex

func before(stream *http.Stream) error {
	if stream.Empty("token") {
		_ = stream.JsonFormat("ERROR", 404, "token is empty")
		return errors.New("token is empty")
	}

	var conn = app.Connections.Get(stream.ClientIP())
	if conn == nil {
		_ = stream.JsonFormat("ERROR", 404, "connection not found")
		return errors.New("connection not found")
	}

	var db = stream.AutoGet("db").Int()
	var uuid = conn.GetUUID()
	var token = stream.AutoGet("token").String()

	if token != conn.Token {
		_ = stream.JsonFormat("ERROR", 404, "token not match")
		return errors.New("token not match")
	}

	mux.Lock()
	defer mux.Unlock()

	conn.GetModel().Handler.Do(context.Background(), "SELECT", fmt.Sprintf("%d", db))
	// console.Info("command select db:", db)

	var data = app.DataMap.Get(db, uuid)

	if data == nil {
		data = data2.NewData(conn.Split)
		app.DataMap.Set(db, uuid, data)
		go func() {
			createData(conn, data, db)
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

	defer func() { _ = r.Handler.Close() }()

	r.Handler.Do(context.Background(), "SELECT", fmt.Sprintf("%d", db))
	console.Info("create data select db:", db)

	var t = time.Now()

	var resChan = r.Scan("*", 100000)

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
