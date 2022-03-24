/**
* @program: redis-gui
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-16 02:51
**/

package redis

import (
	"context"

	"github.com/go-redis/redis/v8"
)

// clear redis log
type rl interface {
	Printf(xtc context.Context, format string, v ...any)
}

type log struct{}

func (l *log) Printf(xtc context.Context, format string, v ...any) {

}

func init() {
	var a = &log{}
	redis.SetLogger(a)
}

func NewFailover(masterName, password string, db int, sentinelAddrs []string) (*Model, error) {

	var client = Failover(&redis.FailoverOptions{
		MasterName:    masterName,
		Username:      "",
		Password:      password,
		SentinelAddrs: sentinelAddrs,
		DB:            db,
	})

	err := client.Ping(context.Background()).Err()
	if err != nil {
		return nil, err
	}

	return NewModel(client), nil
}

func NewClient(password string, db int, addr string) (*Model, error) {
	var client = Client(&redis.Options{
		Username: "",
		Password: password,
		Addr:     addr,
		DB:       db,
	})

	err := client.Ping(context.Background()).Err()
	if err != nil {
		return nil, err
	}

	return NewModel(client), nil
}

func NewCluster(password string, addrs []string) (*Model, error) {
	var client = Cluster(&redis.ClusterOptions{
		Username: "",
		Password: password,
		Addrs:    addrs,
	})

	err := client.Ping(context.Background()).Err()
	if err != nil {
		return nil, err
	}

	return NewModel(client), nil
}
