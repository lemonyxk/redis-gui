/**
* @program: redis-gui
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-16 02:48
**/

package main

import (
	"os"

	"github.com/lemoyxk/console"
	"github.com/lemoyxk/utils"
	"server/websocket"
)

func main() {

	websocket.Start()

	// http.Start()

	websocket.PTY()

	// var client, err = redis.NewFailover("master", "1354243", []string{"192.168.0.100:16379"})
	// if err != nil {
	// 	panic(err)
	// }
	//
	// client.Handler.Do(context.Background(), "SELECT", "2")
	//
	// for i := 0; i < 103; i++ {
	// 	err = client.Handler.XAdd(context.Background(), &redis2.XAddArgs{
	// 		Stream: "my-stream",
	// 		ID:     "*",
	// 		Values: []string{fmt.Sprintf("key%d",i), fmt.Sprintf("value%d",i)},
	// 	}).Err()
	//
	// 	console.Info(err)
	// }

	utils.Signal.ListenKill().Done(func(sig os.Signal) {
		console.Info("kill signal", sig)
	})

}
