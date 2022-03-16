/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 23:23
**/

package app

import (
	"context"
	"errors"
	"strings"

	"server/message"
	"server/redis"
)

func Login(login message.Login) (*redis.Model, error) {
	switch login.Type {
	case "cluster":
		return redis.NewCluster(login.Password, login.Addr)
	case "client":
		if len(login.Addr) == 0 {
			return nil, errors.New("addr is empty")
		}
		return redis.NewClient(login.Password, login.Addr[0])
	case "sentinel":
		return redis.NewFailover(login.MasterName, login.Password, login.Addr)
	default:
		return nil, errors.New("type is empty")
	}
}

func CreateInfo(login message.Login) (*Info, error) {
	var r, err = Login(login)
	if err != nil {
		return nil, err
	}

	res, err := r.Handler.Do(context.Background(), "INFO", "Server").Result()
	if err != nil {
		return nil, err
	}

	var info = NewInfo()

	info.SetModel(r)

	info.Split = login.Split

	var resArr = strings.Split(res.(string), "\r\n")
	for i := 0; i < len(resArr); i++ {
		if strings.HasPrefix("process_id", resArr[i]) {
			info.ProcessID = strings.TrimSpace(resArr[i])
		}
		if strings.HasPrefix("os", resArr[i]) {
			info.Os = strings.TrimSpace(resArr[i])
		}
	}

	info.Login = login

	info.Watch()

	return info, nil
}
