/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 10:12
**/

package app

import (
	"context"
	"strconv"
	"strings"
	"time"

	hash "github.com/lemonyxk/structure/v3/map"
	"github.com/lemoyxk/console"
	"github.com/lemoyxk/kitty/v2/http"
	"github.com/lemoyxk/kitty/v2/kitty"
	"github.com/lemoyxk/utils"
	"server/data"
	"server/redis"
)

type DataList struct {
	data *hash.Hash[string, *Process]
}

type Process struct {
	data     *hash.Hash[int, *data.Data]
	model    *redis.Model
	infoAll  []string
	hasWatch bool
}

func (p *Process) GetInfoAll() []string {
	return p.infoAll
}

func (p *Process) SetModel(model *redis.Model) {
	p.model = model
}

func (p *Process) GetModel() *redis.Model {
	return p.model
}

func NewDataList() *DataList {
	return &DataList{
		data: hash.New[string, *Process](),
	}
}

func (d *DataList) Set(processID string, db int, value *data.Data) {
	var res = d.data.Get(processID)
	if res == nil {
		res = &Process{data: hash.New[int, *data.Data]()}
		d.data.Set(processID, res)
	}

	res.data.Set(db, value)
}

func (d *DataList) GetProcess(processID string) *Process {
	return d.data.Get(processID)
}

func (d *DataList) GetAll() *hash.Hash[string, *Process] {
	return d.data
}

func (d *DataList) Get(process string, db int) *data.Data {
	var res = d.data.Get(process)
	if res == nil {
		return nil
	}

	return res.data.Get(db)
}

func (d *DataList) DeleteProcess(processID string) {
	d.data.Delete(processID)
}

func (d *DataList) DeleteDB(processID string, db int) {
	var res = d.data.Get(processID)
	if res == nil {
		return
	}

	res.data.Delete(db)
}

func (p *Process) Watch() {

	if p.hasWatch {
		return
	}

	p.hasWatch = true

	p.model.Handler.ConfigSet(context.Background(), "notify-keyspace-events", "KEA")

	var channel = `__keyevent@*__:*`

	var push = p.model.Handler.PSubscribe(context.Background(), channel)

	var stop = false

	go func() {
		for !stop {

			time.Sleep(2000 * time.Millisecond)

			var res, err = p.model.Handler.Info(context.Background(), "all").Result()
			if err != nil {
				console.Info(err)
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

			p.infoAll = append(p.infoAll, str)

			if len(p.infoAll) > 300 {
				p.infoAll = p.infoAll[1:]
			}

			Connections.GetAll().Range(func(key string, value *Info) bool {

				if !value.EmitInfoAll {
					return true
				}

				_ = Server.Json(value.FD, Json{
					Event: "/infoAll",
					Data: http.JsonFormat{
						Status: "SUCCESS",
						Code:   200,
						Msg:    []string{str},
					},
				})

				return true
			})
		}

		console.Info("redis watch server info stop")
	}()

	go func() {
		for {
			msg, err := push.ReceiveMessage(context.Background())
			if err != nil {
				console.Info("redis watch server message stop")
				stop = true
				return
			}

			var arr = strings.Split(msg.Channel, ":")
			var action = arr[1]
			var db, _ = strconv.Atoi(arr[0][11 : len(arr[0])-2])
			var key = msg.Payload

			var all = DataMap.GetAll()

			all.Range(func(processID string, process *Process) bool {

				var info = process.data.Get(db)

				if action == "expired" || action == "del" || action == "rename_from" {
					info.Delete(key)
				} else {
					info.Insert(key)
				}

				console.Info(processID, db, key, action)

				return true
			})

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
