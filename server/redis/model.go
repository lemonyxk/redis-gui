/**
* @program: redis-gui
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-16 17:07
**/

package redis

import (
	"context"
	"io"

	"github.com/go-redis/redis/v8"
)

/**
* @program: ledis
*
* @description:
*
* @author: lemo
*
* @create: 2020-04-08 17:18
**/

type Cmd interface {
	redis.Cmdable
}

type CR interface {
	Cmd
	Run
	io.Closer
}

type Run interface {
	Do(ctx context.Context, args ...interface{}) *redis.Cmd
	PSubscribe(ctx context.Context, channels ...string) *redis.PubSub
}

func NewModel(client CR) *Model {
	return &Model{Handler: client}
}

type Model struct {
	Handler CR
}

func (m *Model) Transaction(fn func(pipe Cmd) error) error {
	var pipe = m.Handler.TxPipeline()
	var err = fn(pipe)
	if err != nil {
		return err
	}
	_, err = pipe.Exec(context.Background())
	return err
}

type ScanResult struct {
	err error
	res string
}

func (res *ScanResult) LastError() error {
	return res.err
}

func (res *ScanResult) Result() string {
	return res.res
}

func (m *Model) Scan(key string, count int) chan *ScanResult {

	var ch = make(chan *ScanResult, 1)

	var cursor uint64 = 0

	go func() {
		for {

			var keys []string
			var err error
			keys, cursor, err = m.Handler.Scan(context.Background(), cursor, key, int64(count)).Result()
			if err != nil {
				ch <- &ScanResult{err: err}
				close(ch)
				return
			}

			for i := 0; i < len(keys); i++ {
				ch <- &ScanResult{res: keys[i]}
			}

			if cursor == 0 {
				break
			}
		}
		close(ch)
	}()

	return ch
}

func Client(option *redis.Options) *redis.Client {
	return redis.NewClient(option)
}

func Cluster(option *redis.ClusterOptions) *redis.ClusterClient {
	return redis.NewClusterClient(option)
}

func Failover(option *redis.FailoverOptions) *redis.Client {
	return redis.NewFailoverClient(option)
}
