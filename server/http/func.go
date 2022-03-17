/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 21:51
**/

package http

import (
	"context"

	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"github.com/lemoyxk/utils"
	"server/app"
)

func List(stream *http.Stream) error {
	var path = stream.Query.First("path").String()
	var page = stream.Query.First("page").Int()
	var limit = stream.Query.First("limit").Int()
	var uuid = stream.Query.First("uuid").String()
	var db = stream.Query.First("db").Int()
	if limit > 1000 {
		return stream.JsonFormat("ERROR", 404, "limit must less than 1000")
	}

	var conn = app.Connections.Get(uuid)
	var infoID = conn.GetInfoID()

	var data = app.DataMap.Get(db, infoID)

	return stream.JsonFormat("SUCCESS", 200, data.Get(path, page, limit))
}

func DB(stream *http.Stream) error {
	var uuid = stream.Query.First("uuid").String()
	var conn = app.Connections.Get(uuid)
	var client = conn.GetModel()

	db, err := client.Handler.Do(context.Background(), "CONFIG", "GET", "DATABASES").Result()
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}
	key, err := client.Handler.Do(context.Background(), "INFO", "KEYSPACE").Result()
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}
	return stream.JsonFormat("SUCCESS", 200, kitty.M{"db": db, "key": key})
}

// func Scan(stream *http.Stream) error {
// 	var db = stream.Query.First("db").Int()
//  var uuid = stream.Query.First("uuid").String()
// 	var conn = app.Connections.Get(uuid)
// 	var infoID = conn.GetInfoID()
// 	var data = app.DataMap.Get(db, infoID)
//
// 	var res = data.Scan(20)
//
// 	console.Pretty.Dump(res)
//
// 	return stream.JsonFormat("SUCCESS", 200, res)
// }

func Type(stream *http.Stream) error {
	var path = stream.Query.First("path").String()
	var uuid = stream.Query.First("uuid").String()
	var conn = app.Connections.Get(uuid)
	var res, err = conn.GetModel().Handler.Type(context.Background(), path).Result()
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}
	return stream.JsonFormat("SUCCESS", 200, res)
}

func Do(stream *http.Stream) error {
	var uuid = stream.Form.First("uuid").String()
	var cmd = stream.Form.First("cmd").Bytes()
	var conn = app.Connections.Get(uuid)

	var arr []interface{}
	var err = utils.Json.Decode(cmd, &arr)
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	res, err := conn.GetModel().Handler.Do(context.Background(), arr...).Result()
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	return stream.JsonFormat("SUCCESS", 200, res)
}
