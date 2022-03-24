/**
* @program: server
*
* @description:
*
* @author: lemon
*
* @create: 2022-02-19 18:07
**/

package websocket

import (
	"context"
	"errors"
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"github.com/lemoyxk/kitty/v2/socket"
	"github.com/lemoyxk/kitty/v2/socket/websocket/server"
	"github.com/lemoyxk/utils"
	"server/app"
	"server/data"
	"server/message"
)

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
	if info != nil {
		info.Close()
		app.Connections.Delete(uuid)
	}

	info, err = app.CreateInfo(login)
	if err != nil {
		console.Error(err)
	}
	app.Connections.Set(uuid, info)

	info.Name = login.Name
	info.Time = time.Now()
	info.FD = conn.FD
	info.Token = utils.Rand.UUID()
	info.Login = login

	conn.Name = uuid

	console.Info("login success:", info.Time.Format("2006-01-02 15:04:05"))

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    info,
		},
	})
}

func List(conn *server.Conn, stream *socket.Stream) error {

	var json = utils.Json.Bytes(stream.Data)

	var path = json.Get("path").String()
	var page = json.Get("page").Int()
	var limit = json.Get("limit").Int()
	var uuid = json.Get("uuid").String()
	var db = json.Get("db").Int()

	if limit > 1000 {
		return Error(conn, stream, errors.New("limit must less than 1000"))
	}
	if limit < 1 {
		return Error(conn, stream, errors.New("limit must greater than 0"))
	}

	if page < 1 {
		return Error(conn, stream, errors.New("page must greater than 0"))
	}

	var client = app.Connections.Get(uuid)
	var processID = client.GetProcessID()

	var d = app.DataMap.Get(processID, db)

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    d.Get(path, page, limit),
		},
	})
}

func DB(conn *server.Conn, stream *socket.Stream) error {
	var json = utils.Json.Bytes(stream.Data)

	var uuid = json.Get("uuid").String()
	var client = app.Connections.Get(uuid)
	var model = client.GetModel()

	db, err := model.Handler.Do(context.Background(), "CONFIG", "GET", "DATABASES").Result()
	if err != nil {
		return Error(conn, stream, err)
	}

	key, err := model.Handler.Do(context.Background(), "INFO", "KEYSPACE").Result()
	if err != nil {
		return Error(conn, stream, err)
	}

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    kitty.M{"db": db, "key": key},
		},
	})
}

func Scan(conn *server.Conn, stream *socket.Stream) error {

	var json = utils.Json.Bytes(stream.Data)

	var uuid = json.Get("uuid").String()
	var search = json.Get("search").String()
	var limit = json.Get("limit").Int()
	var iter = json.Get("iter").Int()

	if search == "" {
		return Error(conn, stream, errors.New("search must not empty"))
	}

	if limit > 1000 {
		return Error(conn, stream, errors.New("limit must less than 1000"))
	}
	if limit < 1 {
		return Error(conn, stream, errors.New("limit must greater than 0"))
	}

	var client = app.Connections.Get(uuid)

	scanIter, iter, err := client.GetModel().ScanIter(search, iter, limit)
	if err != nil {
		return Error(conn, stream, err)
	}

	var res []data.Info

	for i := 0; i < len(scanIter); i++ {
		res = append(res, data.Info{
			Size:  0,
			Name:  scanIter[i],
			Path:  scanIter[i],
			IsDir: false,
			IsKey: true,
		})
	}

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    kitty.M{"iter": iter, "data": res},
		},
	})
}

func Type(conn *server.Conn, stream *socket.Stream) error {

	var json = utils.Json.Bytes(stream.Data)

	var path = json.Get("path").String()
	var uuid = json.Get("uuid").String()
	var client = app.Connections.Get(uuid)
	var res, err = client.GetModel().Handler.Type(context.Background(), path).Result()
	if err != nil {
		return Error(conn, stream, err)
	}

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    res,
		},
	})
}

func Do(conn *server.Conn, stream *socket.Stream) error {

	var json = utils.Json.Bytes(stream.Data)

	var uuid = json.Get("uuid").String()
	var cmd = json.Get("cmd").Bytes()
	var client = app.Connections.Get(uuid)

	var arr []any
	var err = utils.Json.Decode(cmd, &arr)
	if err != nil {
		return Error(conn, stream, err)
	}

	res, err := client.GetModel().Handler.Do(context.Background(), arr...).Result()
	if err != nil {
		return Error(conn, stream, err)
	}

	return app.Server.Json(conn.FD, app.Json{
		ID:    stream.ID,
		Event: stream.Event,
		Data: http.JsonFormat{
			Status: "SUCCESS",
			Code:   200,
			Msg:    res,
		},
	})
}
