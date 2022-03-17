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
	"github.com/lemoyxk/utils"
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

	InfoAll     []string
	EmitInfoAll bool

	message.Login
}

func (i *Info) GetInfoID() string {
	return i.Os + i.ProcessID + i.Split
}

func (i *Info) Close() {
	_ = i.model.Handler.Close()
}

func (i *Info) Watch() {
	i.model.Handler.ConfigSet(context.Background(), "notify-keyspace-events", "KEA")

	var channel = `__keyevent@*__:*`

	var p = i.model.Handler.PSubscribe(context.Background(), channel)

	var stop = false

	go func() {
		for !stop {

			time.Sleep(time.Second * 3)

			var res, err = i.model.Handler.Info(context.Background(), "all").Result()
			if err != nil {
				console.Error(err)
				continue
			}

			var info = kitty.M{}
			var name = ""

			var lines = strings.Split(res, "\r\n")
			for i := 0; i < len(lines); i++ {
				if lines[i] == "\r" || lines[i] == "" {
					continue
				}

				if lines[i][0] == '#' {

					if lines[i][2:] == "Commandstats" {
						name = lines[i][2:]
						info[name] = kitty.M{}
					} else {
						name = lines[i][2:]
						info[name] = kitty.M{}
					}

					continue
				}

				if name == "Commandstats" {

					var kv = strings.Split(lines[i], ":")
					if len(kv) != 2 {
						continue
					}

					info[name].(kitty.M)[kv[0]] = kitty.M{}

					var kv2 = strings.Split(kv[1], ",")

					for j := 0; j < len(kv2); j++ {
						var kv3 = strings.Split(kv2[j], "=")
						if len(kv3) != 2 {
							continue
						}

						info[name].(kitty.M)[kv[0]].(kitty.M)[kv3[0]] = kv3[1]
					}

					continue
				}

				var kv = strings.Split(lines[i], ":")

				if len(kv) != 2 {
					continue
				}

				info[name].(kitty.M)[kv[0]] = kv[1]
			}

			info["Time"] = time.Now().Format("15:04:05")

			var str = string(utils.Json.Encode(info))

			i.InfoAll = append(i.InfoAll, str)

			if len(i.InfoAll) > 300 {
				i.InfoAll = i.InfoAll[1:]
			}

			if i.EmitInfoAll {
				_ = Server.Json(i.FD, Json{
					Event: "/infoAll",
					Data: http.JsonFormat{
						Status: "SUCCESS",
						Code:   200,
						Msg:    []string{str},
					},
				})
			}
		}
	}()

	go func() {
		for {
			msg, err := p.ReceiveMessage(context.Background())
			if err != nil {
				console.Error(err)
				stop = true
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

func (i *Info) SetEmitInfoAll(flag bool) {
	i.EmitInfoAll = flag
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
