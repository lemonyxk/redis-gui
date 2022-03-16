/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 10:08
**/

package app

import (
	"context"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"server/message"
	"server/redis"
)

func NewConn() *Conn {
	return &Conn{
		client: make(map[string]*Info),
	}
}

func NewInfo() *Info {
	return &Info{}
}

type Info struct {
	model     *redis.Model
	Name      string
	Time      time.Time
	Split     string
	Os        string
	ProcessID string
	FD        int64
	Token     string

	message.Login
}

func (i *Info) GetUUID() string {
	return i.Os + i.ProcessID + i.Split
}

func (i *Info) Close() {
	_ = i.model.Handler.Close()
}

func (i *Info) Watch() {
	i.model.Handler.ConfigSet(context.Background(), "notify-keyspace-events", "KEA")

	var channel = `__keyevent@*__:*`

	var p = i.model.Handler.PSubscribe(context.Background(), channel)

	go func() {
		for {
			msg, err := p.ReceiveMessage(context.Background())
			if err != nil {
				console.Info(err)
				return
			}

			var arr = strings.Split(msg.Channel, ":")
			var action = arr[1]
			var db, _ = strconv.Atoi(arr[0][11 : len(arr[0])-2])
			var key = msg.Payload

			var dbs = DataMap.GetDataByDB(db)
			for k := range dbs {
				DataMap.Lock()

				if action == "expired" || action == "del" || action == "rename_from" {
					dbs[k].Delete(key)
				} else {
					dbs[k].Insert(key)
				}

				DataMap.Unlock()

				console.Info(k, db, key, action)
			}

			for conn := range Server.GetConnections() {
				_ = Server.Json(conn.FD, Json{
					Event: "/serverLog",
					Data: http.JsonFormat{
						Status: "SUCCESS",
						Code:   200,
						Msg: kitty.M{
							"db":     db,
							"key":    key,
							"action": action,
						},
					},
				})
			}
		}
	}()
}

func (i *Info) SetModel(model *redis.Model) {
	i.model = model
}

func (i *Info) GetModel() *redis.Model {
	return i.model
}

type Conn struct {
	client map[string]*Info
	mux    sync.RWMutex
}

func (c *Conn) Set(key string, value *Info) {
	c.mux.Lock()
	c.client[key] = value
	c.mux.Unlock()
}

func (c *Conn) Get(key string) *Info {
	c.mux.RLock()
	value := c.client[key]
	c.mux.RUnlock()
	return value
}

func (c *Conn) Delete(key string) {
	c.mux.Lock()
	delete(c.client, key)
	c.mux.Unlock()
}
