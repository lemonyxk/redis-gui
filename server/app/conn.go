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
	"time"

	hash "github.com/lemonyxk/structure/v3/map"
	"server/message"
	"server/redis"
)

func NewConn() *Conn {
	return &Conn{
		client: hash.New[string, *Info](),
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

	EmitInfoAll bool

	message.Login
}

func (i *Info) GetProcessID() string {
	return i.Os + i.ProcessID + i.Split
}

func (i *Info) Close() {
	_ = i.model.Handler.Close()
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
	client *hash.Hash[string, *Info]
}

func (c *Conn) Set(uuid string, value *Info) {
	c.client.Set(uuid, value)
}

func (c *Conn) Get(uuid string) *Info {
	value := c.client.Get(uuid)
	return value
}

func (c *Conn) GetAll() *hash.Hash[string, *Info] {
	return c.client
}

func (c *Conn) Delete(uuid string) {
	c.client.Delete(uuid)
}
